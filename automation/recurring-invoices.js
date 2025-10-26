// 💰 SCRIPT DE FACTURAS AUTOMÁTICAS RECURRENTES
// Ejecutar el 1ro de cada mes para generar facturas recurrentes
// =====================================================

const schedule = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configuración de email
const emailTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Configuración de directorios
const INVOICES_DIR = path.join(__dirname, '../invoices');
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Crear directorios si no existen
if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

// Función para generar número de factura
async function generateInvoiceNumber() {
    try {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        
        // Obtener el último número de factura del mes
        const lastInvoice = await prisma.invoice.findFirst({
            where: {
                invoiceNumber: {
                    startsWith: `INV-${year}${month}`
                }
            },
            orderBy: {
                invoiceNumber: 'desc'
            }
        });

        let nextNumber = 1;
        if (lastInvoice) {
            const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
            nextNumber = lastNumber + 1;
        }

        return `INV-${year}${month}-${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
        console.error('Error generando número de factura:', error);
        throw error;
    }
}

// Función para obtener servicios recurrentes
async function getRecurringServices() {
    try {
        const recurringServices = await prisma.recurringService.findMany({
            where: {
                isActive: true,
                nextBillingDate: {
                    lte: new Date()
                }
            },
            include: {
                client: true,
                service: true
            }
        });

        return recurringServices;
    } catch (error) {
        console.error('Error obteniendo servicios recurrentes:', error);
        throw error;
    }
}

// Función para generar HTML de factura
function generateInvoiceHTML(invoice, client, service) {
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + (service.paymentTerms || 30) * 24 * 60 * 60 * 1000);

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 30px;
        }
        .company-info, .client-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        .company-info h3, .client-info h3 {
            margin-top: 0;
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .invoice-meta {
            background: #e9ecef;
            padding: 20px;
            margin: 0 30px;
            border-radius: 8px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }
        .meta-item {
            text-align: center;
        }
        .meta-label {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .meta-value {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }
        .items-table {
            margin: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 500;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        .total-section {
            margin: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .total-row.final {
            border-top: 2px solid #667eea;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 1.2em;
            font-weight: bold;
            color: #667eea;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
        }
        .payment-info {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 30px;
        }
        .payment-info h3 {
            margin-top: 0;
            color: #0066cc;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>FACTURA</h1>
            <p>Plataforma All-in-One</p>
        </div>
        
        <div class="invoice-details">
            <div class="company-info">
                <h3>Información de la Empresa</h3>
                <p><strong>Plataforma All-in-One</strong></p>
                <p>123 Calle Principal<br>
                Ciudad, Estado 12345<br>
                Teléfono: +1 (555) 123-4567<br>
                Email: facturacion@all-in-one.com</p>
            </div>
            
            <div class="client-info">
                <h3>Facturar a</h3>
                <p><strong>${client.name}</strong></p>
                <p>${client.address || 'Dirección no especificada'}<br>
                ${client.city || ''} ${client.state || ''} ${client.zipCode || ''}<br>
                Teléfono: ${client.phone || 'No especificado'}<br>
                Email: ${client.email}</p>
            </div>
        </div>
        
        <div class="invoice-meta">
            <div class="meta-item">
                <div class="meta-label">Número de Factura</div>
                <div class="meta-value">${invoice.invoiceNumber}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Fecha de Emisión</div>
                <div class="meta-value">${currentDate.toLocaleDateString('es-ES')}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Fecha de Vencimiento</div>
                <div class="meta-value">${dueDate.toLocaleDateString('es-ES')}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Período</div>
                <div class="meta-value">${service.billingPeriod || 'Mensual'}</div>
            </div>
        </div>
        
        <div class="items-table">
            <table>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${service.name}</td>
                        <td>1</td>
                        <td>$${service.price.toFixed(2)}</td>
                        <td>$${service.price.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${service.price.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>IVA (${service.taxRate || 0}%):</span>
                <span>$${((service.price * (service.taxRate || 0)) / 100).toFixed(2)}</span>
            </div>
            <div class="total-row final">
                <span>Total:</span>
                <span>$${invoice.amount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="payment-info">
            <h3>💳 Información de Pago</h3>
            <p>Puedes pagar esta factura de las siguientes maneras:</p>
            <ul>
                <li><strong>Tarjeta de Crédito/Débito:</strong> <a href="${process.env.APP_URL}/invoices/${invoice.id}/pay">Pagar Online</a></li>
                <li><strong>Transferencia Bancaria:</strong> Ver detalles en el email</li>
                <li><strong>PayPal:</strong> Disponible en el enlace de pago</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Gracias por confiar en nuestros servicios.</p>
            <p>Si tienes alguna pregunta sobre esta factura, no dudes en contactarnos.</p>
            <p><strong>Plataforma All-in-One</strong> - Sistema de Gestión Empresarial</p>
        </div>
    </div>
</body>
</html>
    `;
}

// Función para generar PDF de factura
async function generateInvoicePDF(html, outputPath) {
    return new Promise((resolve, reject) => {
        const options = {
            format: 'A4',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            header: {
                height: '20mm',
                contents: '<div style="text-align: center; color: #667eea; font-size: 12px;">Plataforma All-in-One</div>'
            },
            footer: {
                height: '20mm',
                contents: {
                    default: '<div style="text-align: center; color: #666; font-size: 10px;">Página {{page}} de {{pages}}</div>'
                }
            }
        };

        pdf.create(html, options).toFile(outputPath, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

// Función para enviar factura por email
async function sendInvoiceEmail(client, invoice, pdfPath) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: client.email,
            subject: `💰 Nueva Factura: ${invoice.invoiceNumber}`,
            html: `
                <h2>💰 Nueva Factura Generada</h2>
                <p>Hola ${client.name},</p>
                <p>Se ha generado una nueva factura para tu servicio recurrente:</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Detalles de la Factura</h3>
                    <p><strong>Número:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Monto:</strong> $${invoice.amount}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${invoice.dueDate.toLocaleDateString('es-ES')}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.APP_URL}/invoices/${invoice.id}/pay" 
                       style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                        💳 Pagar Ahora
                    </a>
                </div>
                
                <p>La factura en PDF está adjunta a este email.</p>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                
                <p>Saludos,<br>Equipo de Plataforma All-in-One</p>
            `,
            attachments: [
                {
                    filename: `factura-${invoice.invoiceNumber}.pdf`,
                    path: pdfPath
                }
            ]
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Factura enviada por email a: ${client.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Error enviando factura a ${client.email}:`, error);
        return false;
    }
}

// Función para crear factura recurrente
async function createRecurringInvoice(service, client) {
    try {
        // Generar número de factura
        const invoiceNumber = await generateInvoiceNumber();
        
        // Calcular fecha de vencimiento
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (service.paymentTerms || 30));
        
        // Calcular monto total (precio + impuestos)
        const taxAmount = (service.price * (service.taxRate || 0)) / 100;
        const totalAmount = service.price + taxAmount;
        
        // Crear factura en base de datos
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber: invoiceNumber,
                clientId: client.id,
                amount: totalAmount,
                dueDate: dueDate,
                status: 'pending',
                type: 'recurring',
                serviceId: service.id,
                description: `Factura recurrente por: ${service.name}`,
                taxRate: service.taxRate || 0,
                taxAmount: taxAmount
            }
        });

        console.log(`✅ Factura creada: ${invoiceNumber}`);
        return invoice;
    } catch (error) {
        console.error('Error creando factura recurrente:', error);
        throw error;
    }
}

// Función para actualizar próximo ciclo de facturación
async function updateNextBillingDate(service) {
    try {
        const nextBillingDate = new Date();
        
        switch (service.billingFrequency) {
            case 'monthly':
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                break;
            case 'quarterly':
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
                break;
            case 'yearly':
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                break;
            default:
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        }

        await prisma.recurringService.update({
            where: { id: service.id },
            data: { nextBillingDate: nextBillingDate }
        });

        console.log(`✅ Próxima facturación actualizada para: ${nextBillingDate.toLocaleDateString()}`);
    } catch (error) {
        console.error('Error actualizando próxima facturación:', error);
        throw error;
    }
}

// Función para procesar facturas recurrentes
async function processRecurringInvoices() {
    try {
        console.log('💰 Iniciando procesamiento de facturas recurrentes...');
        
        const recurringServices = await getRecurringServices();
        console.log(`📋 Encontrados ${recurringServices.length} servicios recurrentes`);

        const results = {
            processed: 0,
            successful: 0,
            failed: 0,
            errors: []
        };

        for (const service of recurringServices) {
            try {
                console.log(`📝 Procesando servicio: ${service.service.name} para ${service.client.name}`);
                
                // Crear factura
                const invoice = await createRecurringInvoice(service.service, service.client);
                
                // Generar HTML
                const html = generateInvoiceHTML(invoice, service.client, service.service);
                
                // Generar PDF
                const pdfPath = path.join(INVOICES_DIR, `factura-${invoice.invoiceNumber}.pdf`);
                await generateInvoicePDF(html, pdfPath);
                
                // Enviar por email
                const emailSent = await sendInvoiceEmail(service.client, invoice, pdfPath);
                
                // Actualizar próxima fecha de facturación
                await updateNextBillingDate(service);
                
                // Registrar en log
                await prisma.invoiceLog.create({
                    data: {
                        invoiceId: invoice.id,
                        action: 'recurring_generated',
                        details: `Factura recurrente generada automáticamente`,
                        timestamp: new Date()
                    }
                });

                results.processed++;
                results.successful++;
                
                console.log(`✅ Factura procesada exitosamente: ${invoice.invoiceNumber}`);
                
            } catch (error) {
                console.error(`❌ Error procesando servicio ${service.id}:`, error);
                results.processed++;
                results.failed++;
                results.errors.push({
                    serviceId: service.id,
                    error: error.message
                });
            }
        }

        // Enviar reporte de procesamiento
        await sendProcessingReport(results);
        
        console.log('🎉 Procesamiento de facturas recurrentes completado');
        console.log(`📊 Resultados: ${results.successful} exitosas, ${results.failed} fallidas`);
        
        return results;
    } catch (error) {
        console.error('❌ Error procesando facturas recurrentes:', error);
        throw error;
    }
}

// Función para enviar reporte de procesamiento
async function sendProcessingReport(results) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL || 'admin@tu-dominio.com',
            subject: `📊 Reporte de Facturas Recurrentes - ${new Date().toLocaleDateString()}`,
            html: `
                <h2>📊 Reporte de Facturas Recurrentes</h2>
                <p>Fecha: ${new Date().toLocaleDateString()}</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Resumen del Procesamiento</h3>
                    <ul>
                        <li><strong>Total procesadas:</strong> ${results.processed}</li>
                        <li><strong>Exitosas:</strong> ${results.successful}</li>
                        <li><strong>Fallidas:</strong> ${results.failed}</li>
                    </ul>
                </div>
                
                ${results.errors.length > 0 ? `
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>⚠️ Errores Encontrados</h3>
                        <ul>
                            ${results.errors.map(error => `<li>Servicio ${error.serviceId}: ${error.error}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <p>El procesamiento automático de facturas recurrentes ha sido completado.</p>
            `
        };

        await emailTransporter.sendMail(mailOptions);
        console.log('✅ Reporte de procesamiento enviado');
    } catch (error) {
        console.error('❌ Error enviando reporte:', error);
    }
}

// Función para limpiar facturas antiguas
async function cleanupOldInvoices() {
    try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Eliminar archivos PDF antiguos
        const files = fs.readdirSync(INVOICES_DIR);
        files.forEach(file => {
            const filePath = path.join(INVOICES_DIR, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime < ninetyDaysAgo) {
                fs.unlinkSync(filePath);
            }
        });

        // Eliminar logs antiguos
        await prisma.invoiceLog.deleteMany({
            where: {
                timestamp: {
                    lt: ninetyDaysAgo
                }
            }
        });

        console.log('🧹 Facturas y logs antiguos eliminados');
    } catch (error) {
        console.error('❌ Error limpiando facturas antiguas:', error);
    }
}

// Configurar tareas programadas
function setupRecurringInvoiceScheduler() {
    console.log('⏰ Configurando scheduler de facturas recurrentes...');

    // Procesar facturas recurrentes el 1ro de cada mes a las 6 AM
    schedule.scheduleJob('0 6 1 * *', async () => {
        try {
            await processRecurringInvoices();
        } catch (error) {
            console.error('Error procesando facturas recurrentes:', error);
        }
    });

    // Limpiar facturas antiguas cada domingo a las 2 AM
    schedule.scheduleJob('0 2 * * 0', async () => {
        try {
            await cleanupOldInvoices();
        } catch (error) {
            console.error('Error limpiando facturas antiguas:', error);
        }
    });

    console.log('✅ Scheduler de facturas recurrentes configurado');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'process':
            processRecurringInvoices()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'cleanup':
            cleanupOldInvoices()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'schedule':
            setupRecurringInvoiceScheduler();
            // Mantener el proceso corriendo
            process.on('SIGINT', () => {
                console.log('🛑 Deteniendo scheduler de facturas...');
                schedule.gracefulShutdown();
                process.exit(0);
            });
            break;
        default:
            console.log('Comandos disponibles: process, cleanup, schedule');
            process.exit(1);
    }
}

module.exports = {
    processRecurringInvoices,
    createRecurringInvoice,
    generateInvoicePDF,
    sendInvoiceEmail,
    cleanupOldInvoices,
    setupRecurringInvoiceScheduler
};
