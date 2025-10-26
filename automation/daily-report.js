// 📊 SCRIPT DE GENERACIÓN DE REPORTES DIARIOS
// Ejecutar diariamente a las 8:00 AM
// =====================================================

const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Configuración
const prisma = new PrismaClient();
const REPORT_DIR = path.join(__dirname, '../reports');
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Crear directorio de reportes si no existe
if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
}

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

// Función para obtener datos del día
async function getDailyData() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    try {
        // Datos de facturas
        const invoices = await prisma.invoice.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                client: true
            }
        });

        // Datos de contactos
        const contacts = await prisma.contact.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // Datos de reuniones
        const meetings = await prisma.meeting.findMany({
            where: {
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                attendees: true
            }
        });

        // Datos de usuarios
        const users = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // Datos de pagos
        const payments = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // Datos de redes sociales
        const socialPosts = await prisma.socialPost.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // Cálculos
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
        const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
        const completedMeetings = meetings.filter(meeting => meeting.status === 'completed').length;
        const newClients = contacts.length;
        const newUsers = users.length;

        return {
            date: today.toLocaleDateString('es-ES'),
            invoices: {
                total: invoices.length,
                paid: paidInvoices,
                pending: pendingInvoices,
                totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0)
            },
            contacts: {
                new: newClients,
                total: await prisma.contact.count()
            },
            meetings: {
                total: meetings.length,
                completed: completedMeetings,
                upcoming: await prisma.meeting.count({
                    where: {
                        startTime: {
                            gt: endOfDay
                        }
                    }
                })
            },
            users: {
                new: newUsers,
                total: await prisma.user.count()
            },
            payments: {
                total: payments.length,
                amount: totalRevenue
            },
            social: {
                posts: socialPosts.length,
                platforms: [...new Set(socialPosts.map(post => post.platform))]
            },
            revenue: totalRevenue
        };
    } catch (error) {
        console.error('Error obteniendo datos:', error);
        throw error;
    }
}

// Función para generar HTML del reporte
function generateReportHTML(data) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Diario - ${data.date}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
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
            font-size: 1.1em;
        }
        .content {
            padding: 30px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            text-align: center;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .metric-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .list-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .list-item:last-child {
            border-bottom: none;
        }
        .list-label {
            font-weight: 500;
        }
        .list-value {
            color: #667eea;
            font-weight: bold;
        }
        .chart-placeholder {
            background: #f8f9fa;
            height: 200px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-style: italic;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-success { background-color: #28a745; }
        .status-warning { background-color: #ffc107; }
        .status-danger { background-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte Diario</h1>
            <p>Plataforma All-in-One - ${data.date}</p>
        </div>
        
        <div class="content">
            <!-- Métricas principales -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">$${data.revenue.toLocaleString()}</div>
                    <div class="metric-label">Ingresos del Día</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${data.invoices.total}</div>
                    <div class="metric-label">Facturas Generadas</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${data.contacts.new}</div>
                    <div class="metric-label">Nuevos Contactos</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${data.meetings.total}</div>
                    <div class="metric-label">Reuniones Realizadas</div>
                </div>
            </div>

            <!-- Resumen de facturas -->
            <div class="section">
                <h2>💰 Resumen de Facturas</h2>
                <div class="list-item">
                    <span class="list-label">Total de facturas generadas</span>
                    <span class="list-value">${data.invoices.total}</span>
                </div>
                <div class="list-item">
                    <span class="list-label">Facturas pagadas</span>
                    <span class="list-value">
                        <span class="status-indicator status-success"></span>
                        ${data.invoices.paid}
                    </span>
                </div>
                <div class="list-item">
                    <span class="list-label">Facturas pendientes</span>
                    <span class="list-value">
                        <span class="status-indicator status-warning"></span>
                        ${data.invoices.pending}
                    </span>
                </div>
                <div class="list-item">
                    <span class="list-label">Monto total facturado</span>
                    <span class="list-value">$${data.invoices.totalAmount.toLocaleString()}</span>
                </div>
            </div>

            <!-- Resumen de contactos -->
            <div class="section">
                <h2>👥 Gestión de Contactos</h2>
                <div class="list-item">
                    <span class="list-label">Nuevos contactos hoy</span>
                    <span class="list-value">${data.contacts.new}</span>
                </div>
                <div class="list-item">
                    <span class="list-label">Total de contactos</span>
                    <span class="list-value">${data.contacts.total}</span>
                </div>
            </div>

            <!-- Resumen de reuniones -->
            <div class="section">
                <h2>📅 Reuniones y Calendario</h2>
                <div class="list-item">
                    <span class="list-label">Reuniones realizadas hoy</span>
                    <span class="list-value">${data.meetings.total}</span>
                </div>
                <div class="list-item">
                    <span class="list-label">Reuniones completadas</span>
                    <span class="list-value">
                        <span class="status-indicator status-success"></span>
                        ${data.meetings.completed}
                    </span>
                </div>
                <div class="list-item">
                    <span class="list-label">Reuniones próximas</span>
                    <span class="list-value">${data.meetings.upcoming}</span>
                </div>
            </div>

            <!-- Resumen de usuarios -->
            <div class="section">
                <h2>👤 Usuarios del Sistema</h2>
                <div class="list-item">
                    <span class="list-label">Nuevos usuarios registrados</span>
                    <span class="list-value">${data.users.new}</span>
                </div>
                <div class="list-item">
                    <span class="list-label">Total de usuarios</span>
                    <span class="list-value">${data.users.total}</span>
                </div>
            </div>

            <!-- Resumen de redes sociales -->
            <div class="section">
                <h2>📱 Redes Sociales</h2>
                <div class="list-item">
                    <span class="list-label">Posts publicados hoy</span>
                    <span class="list-value">${data.social.posts}</span>
                </div>
                <div class="list-item">
                    <span class="list-label">Plataformas activas</span>
                    <span class="list-value">${data.social.platforms.join(', ')}</span>
                </div>
            </div>

            <!-- Gráfico de rendimiento -->
            <div class="section">
                <h2>📈 Rendimiento del Sistema</h2>
                <div class="chart-placeholder">
                    Gráfico de rendimiento diario (implementar con Chart.js)
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Reporte generado automáticamente el ${new Date().toLocaleString('es-ES')}</p>
            <p>Plataforma All-in-One - Sistema de Gestión Empresarial</p>
        </div>
    </div>
</body>
</html>
    `;
}

// Función para generar PDF
async function generatePDF(html, outputPath) {
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
                contents: '<div style="text-align: center; color: #667eea; font-size: 12px;">Reporte Diario - Plataforma All-in-One</div>'
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

// Función para enviar reporte por email
async function sendReportEmail(pdfPath, data) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || 'admin@tu-dominio.com',
        subject: `📊 Reporte Diario - ${data.date}`,
        html: `
            <h2>📊 Reporte Diario - ${data.date}</h2>
            <p>Aquí tienes el reporte diario de tu plataforma All-in-One:</p>
            
            <h3>Resumen Ejecutivo:</h3>
            <ul>
                <li>💰 Ingresos: $${data.revenue.toLocaleString()}</li>
                <li>📄 Facturas: ${data.invoices.total}</li>
                <li>👥 Nuevos contactos: ${data.contacts.new}</li>
                <li>📅 Reuniones: ${data.meetings.total}</li>
                <li>👤 Nuevos usuarios: ${data.users.new}</li>
            </ul>
            
            <p>El reporte completo en PDF está adjunto.</p>
            
            <p>Saludos,<br>Tu Plataforma All-in-One</p>
        `,
        attachments: [
            {
                filename: `reporte-diario-${data.date.replace(/\//g, '-')}.pdf`,
                path: pdfPath
            }
        ]
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        console.log('✅ Reporte enviado por email');
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        throw error;
    }
}

// Función para guardar reporte en base de datos
async function saveReportToDatabase(data, pdfPath) {
    try {
        await prisma.dailyReport.create({
            data: {
                date: new Date(),
                revenue: data.revenue,
                invoicesTotal: data.invoices.total,
                invoicesPaid: data.invoices.paid,
                invoicesPending: data.invoices.pending,
                newContacts: data.contacts.new,
                totalContacts: data.contacts.total,
                meetingsTotal: data.meetings.total,
                meetingsCompleted: data.meetings.completed,
                newUsers: data.users.new,
                totalUsers: data.users.total,
                socialPosts: data.social.posts,
                pdfPath: pdfPath,
                data: JSON.stringify(data)
            }
        });
        console.log('✅ Reporte guardado en base de datos');
    } catch (error) {
        console.error('❌ Error guardando en BD:', error);
        throw error;
    }
}

// Función principal
async function generateDailyReport() {
    try {
        console.log('📊 Iniciando generación de reporte diario...');
        
        // Obtener datos
        const data = await getDailyData();
        console.log('✅ Datos obtenidos');
        
        // Generar HTML
        const html = generateReportHTML(data);
        console.log('✅ HTML generado');
        
        // Generar PDF
        const pdfPath = path.join(REPORT_DIR, `reporte-diario-${data.date.replace(/\//g, '-')}.pdf`);
        await generatePDF(html, pdfPath);
        console.log('✅ PDF generado:', pdfPath);
        
        // Enviar por email
        await sendReportEmail(pdfPath, data);
        
        // Guardar en base de datos
        await saveReportToDatabase(data, pdfPath);
        
        // Limpiar reportes antiguos (>30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        await prisma.dailyReport.deleteMany({
            where: {
                date: {
                    lt: thirtyDaysAgo
                }
            }
        });
        
        // Limpiar archivos PDF antiguos
        const files = fs.readdirSync(REPORT_DIR);
        files.forEach(file => {
            const filePath = path.join(REPORT_DIR, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime < thirtyDaysAgo) {
                fs.unlinkSync(filePath);
            }
        });
        
        console.log('🎉 Reporte diario generado exitosamente');
        
    } catch (error) {
        console.error('❌ Error generando reporte:', error);
        
        // Enviar alerta de error
        try {
            await emailTransporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL || 'admin@tu-dominio.com',
                subject: '🚨 Error en Reporte Diario',
                html: `
                    <h2>Error en Generación de Reporte Diario</h2>
                    <p>Se produjo un error al generar el reporte diario:</p>
                    <pre>${error.message}</pre>
                    <p>Por favor, revisa los logs del sistema.</p>
                `
            });
        } catch (emailError) {
            console.error('❌ Error enviando alerta:', emailError);
        }
        
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    generateDailyReport()
        .then(() => {
            console.log('✅ Script completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script falló:', error);
            process.exit(1);
        });
}

module.exports = { generateDailyReport };
