// ⏰ SCRIPT DE RECORDATORIOS AUTOMÁTICOS
// Ejecutar cada 5 minutos para verificar recordatorios
// =====================================================

const schedule = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const prisma = new PrismaClient();

// Configuración de servicios
const emailTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const twilioClient = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

// Configuración de recordatorios
const REMINDER_INTERVALS = {
    meeting: {
        24: '24 horas antes',
        2: '2 horas antes',
        30: '30 minutos antes'
    },
    invoice: {
        7: '7 días antes del vencimiento',
        3: '3 días antes del vencimiento',
        1: '1 día antes del vencimiento'
    },
    payment: {
        3: '3 días después del vencimiento',
        7: '7 días después del vencimiento',
        14: '14 días después del vencimiento'
    }
};

// Función para enviar email
async function sendEmail(to, subject, html, attachments = []) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Email enviado a: ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Error enviando email a ${to}:`, error);
        return false;
    }
}

// Función para enviar SMS
async function sendSMS(to, message) {
    try {
        if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
            console.log('⚠️ Twilio no configurado, saltando SMS');
            return false;
        }

        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: to
        });

        console.log(`✅ SMS enviado a: ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Error enviando SMS a ${to}:`, error);
        return false;
    }
}

// Función para enviar notificación push (simulada)
async function sendPushNotification(userId, title, message, data = {}) {
    try {
        // En una implementación real, usarías Firebase Cloud Messaging o similar
        console.log(`📱 Push notification para usuario ${userId}: ${title} - ${message}`);
        
        // Guardar notificación en base de datos
        await prisma.notification.create({
            data: {
                userId: userId,
                title: title,
                message: message,
                type: 'reminder',
                data: JSON.stringify(data),
                read: false
            }
        });

        return true;
    } catch (error) {
        console.error(`❌ Error enviando push notification:`, error);
        return false;
    }
}

// Función para obtener recordatorios de reuniones
async function getMeetingReminders() {
    try {
        const now = new Date();
        const reminders = [];

        // Recordatorio 24 horas antes
        const meetings24h = await prisma.meeting.findMany({
            where: {
                startTime: {
                    gte: new Date(now.getTime() + 23 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() + 25 * 60 * 60 * 1000)
                },
                status: 'scheduled'
            },
            include: {
                attendees: true,
                organizer: true
            }
        });

        // Recordatorio 2 horas antes
        const meetings2h = await prisma.meeting.findMany({
            where: {
                startTime: {
                    gte: new Date(now.getTime() + 1.5 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() + 2.5 * 60 * 60 * 1000)
                },
                status: 'scheduled'
            },
            include: {
                attendees: true,
                organizer: true
            }
        });

        // Recordatorio 30 minutos antes
        const meetings30m = await prisma.meeting.findMany({
            where: {
                startTime: {
                    gte: new Date(now.getTime() + 25 * 60 * 1000),
                    lte: new Date(now.getTime() + 35 * 60 * 1000)
                },
                status: 'scheduled'
            },
            include: {
                attendees: true,
                organizer: true
            }
        });

        return [
            ...meetings24h.map(m => ({ ...m, reminderType: '24h' })),
            ...meetings2h.map(m => ({ ...m, reminderType: '2h' })),
            ...meetings30m.map(m => ({ ...m, reminderType: '30m' }))
        ];
    } catch (error) {
        console.error('Error obteniendo recordatorios de reuniones:', error);
        throw error;
    }
}

// Función para obtener recordatorios de facturas
async function getInvoiceReminders() {
    try {
        const now = new Date();
        const reminders = [];

        // Recordatorio 7 días antes del vencimiento
        const invoices7d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        // Recordatorio 3 días antes del vencimiento
        const invoices3d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        // Recordatorio 1 día antes del vencimiento
        const invoices1d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() + 20 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() + 28 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        return [
            ...invoices7d.map(i => ({ ...i, reminderType: '7d' })),
            ...invoices3d.map(i => ({ ...i, reminderType: '3d' })),
            ...invoices1d.map(i => ({ ...i, reminderType: '1d' }))
        ];
    } catch (error) {
        console.error('Error obteniendo recordatorios de facturas:', error);
        throw error;
    }
}

// Función para obtener recordatorios de pagos vencidos
async function getPaymentReminders() {
    try {
        const now = new Date();
        const reminders = [];

        // Recordatorio 3 días después del vencimiento
        const payments3d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        // Recordatorio 7 días después del vencimiento
        const payments7d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        // Recordatorio 14 días después del vencimiento
        const payments14d = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    gte: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
                    lte: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000)
                },
                status: 'pending'
            },
            include: {
                client: true
            }
        });

        return [
            ...payments3d.map(p => ({ ...p, reminderType: '3d_overdue' })),
            ...payments7d.map(p => ({ ...p, reminderType: '7d_overdue' })),
            ...payments14d.map(p => ({ ...p, reminderType: '14d_overdue' }))
        ];
    } catch (error) {
        console.error('Error obteniendo recordatorios de pagos:', error);
        throw error;
    }
}

// Función para procesar recordatorios de reuniones
async function processMeetingReminders() {
    try {
        console.log('📅 Procesando recordatorios de reuniones...');
        
        const reminders = await getMeetingReminders();
        console.log(`📋 Encontrados ${reminders.length} recordatorios de reuniones`);

        for (const meeting of reminders) {
            const timeLeft = getTimeLeftText(meeting.reminderType);
            
            // Enviar recordatorios a todos los asistentes
            for (const attendee of meeting.attendees) {
                const subject = `📅 Recordatorio de Reunión: ${meeting.title}`;
                const html = generateMeetingReminderHTML(meeting, timeLeft);
                
                // Email
                await sendEmail(attendee.email, subject, html);
                
                // SMS si tiene número de teléfono
                if (attendee.phone) {
                    const smsMessage = `Recordatorio: ${meeting.title} ${timeLeft}. Hora: ${meeting.startTime.toLocaleString()}`;
                    await sendSMS(attendee.phone, smsMessage);
                }
                
                // Push notification
                await sendPushNotification(
                    attendee.id,
                    'Recordatorio de Reunión',
                    `${meeting.title} ${timeLeft}`,
                    { meetingId: meeting.id, type: 'meeting_reminder' }
                );
            }

            // Registrar recordatorio enviado
            await prisma.reminderLog.create({
                data: {
                    type: 'meeting',
                    entityId: meeting.id,
                    reminderType: meeting.reminderType,
                    sentAt: new Date(),
                    recipients: meeting.attendees.length
                }
            });
        }

        console.log('✅ Recordatorios de reuniones procesados');
    } catch (error) {
        console.error('❌ Error procesando recordatorios de reuniones:', error);
        throw error;
    }
}

// Función para procesar recordatorios de facturas
async function processInvoiceReminders() {
    try {
        console.log('💰 Procesando recordatorios de facturas...');
        
        const reminders = await getInvoiceReminders();
        console.log(`📋 Encontrados ${reminders.length} recordatorios de facturas`);

        for (const invoice of reminders) {
            const timeLeft = getTimeLeftText(invoice.reminderType);
            
            const subject = `💰 Recordatorio de Factura: ${invoice.invoiceNumber}`;
            const html = generateInvoiceReminderHTML(invoice, timeLeft);
            
            // Email
            await sendEmail(invoice.client.email, subject, html);
            
            // SMS si tiene número de teléfono
            if (invoice.client.phone) {
                const smsMessage = `Recordatorio: Factura ${invoice.invoiceNumber} por $${invoice.amount} ${timeLeft}`;
                await sendSMS(invoice.client.phone, smsMessage);
            }
            
            // Push notification al cliente
            await sendPushNotification(
                invoice.client.id,
                'Recordatorio de Factura',
                `Factura ${invoice.invoiceNumber} ${timeLeft}`,
                { invoiceId: invoice.id, type: 'invoice_reminder' }
            );

            // Registrar recordatorio enviado
            await prisma.reminderLog.create({
                data: {
                    type: 'invoice',
                    entityId: invoice.id,
                    reminderType: invoice.reminderType,
                    sentAt: new Date(),
                    recipients: 1
                }
            });
        }

        console.log('✅ Recordatorios de facturas procesados');
    } catch (error) {
        console.error('❌ Error procesando recordatorios de facturas:', error);
        throw error;
    }
}

// Función para procesar recordatorios de pagos vencidos
async function processPaymentReminders() {
    try {
        console.log('⚠️ Procesando recordatorios de pagos vencidos...');
        
        const reminders = await getPaymentReminders();
        console.log(`📋 Encontrados ${reminders.length} recordatorios de pagos vencidos`);

        for (const payment of reminders) {
            const timeOverdue = getTimeOverdueText(payment.reminderType);
            
            const subject = `⚠️ Pago Vencido: ${payment.invoiceNumber}`;
            const html = generatePaymentReminderHTML(payment, timeOverdue);
            
            // Email
            await sendEmail(payment.client.email, subject, html);
            
            // SMS si tiene número de teléfono
            if (payment.client.phone) {
                const smsMessage = `URGENTE: Factura ${payment.invoiceNumber} por $${payment.amount} ${timeOverdue}`;
                await sendSMS(payment.client.phone, smsMessage);
            }
            
            // Push notification al cliente
            await sendPushNotification(
                payment.client.id,
                'Pago Vencido',
                `Factura ${payment.invoiceNumber} ${timeOverdue}`,
                { invoiceId: payment.id, type: 'payment_overdue' }
            );

            // Registrar recordatorio enviado
            await prisma.reminderLog.create({
                data: {
                    type: 'payment_overdue',
                    entityId: payment.id,
                    reminderType: payment.reminderType,
                    sentAt: new Date(),
                    recipients: 1
                }
            });
        }

        console.log('✅ Recordatorios de pagos vencidos procesados');
    } catch (error) {
        console.error('❌ Error procesando recordatorios de pagos vencidos:', error);
        throw error;
    }
}

// Funciones auxiliares
function getTimeLeftText(reminderType) {
    const texts = {
        '24h': 'en 24 horas',
        '2h': 'en 2 horas',
        '30m': 'en 30 minutos',
        '7d': 'en 7 días',
        '3d': 'en 3 días',
        '1d': 'en 1 día',
        '3d_overdue': 'vencida hace 3 días',
        '7d_overdue': 'vencida hace 7 días',
        '14d_overdue': 'vencida hace 14 días'
    };
    return texts[reminderType] || '';
}

function getTimeOverdueText(reminderType) {
    const texts = {
        '3d_overdue': 'vencida hace 3 días',
        '7d_overdue': 'vencida hace 7 días',
        '14d_overdue': 'vencida hace 14 días'
    };
    return texts[reminderType] || '';
}

function generateMeetingReminderHTML(meeting, timeLeft) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">📅 Recordatorio de Reunión</h2>
            <p>Hola,</p>
            <p>Te recordamos que tienes una reunión programada:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${meeting.title}</h3>
                <p><strong>📅 Fecha:</strong> ${meeting.startTime.toLocaleDateString()}</p>
                <p><strong>🕐 Hora:</strong> ${meeting.startTime.toLocaleTimeString()}</p>
                <p><strong>📍 Lugar:</strong> ${meeting.location || 'Por definir'}</p>
                <p><strong>⏰ Tiempo restante:</strong> ${timeLeft}</p>
            </div>
            
            <p>${meeting.description || 'No hay descripción adicional.'}</p>
            
            <p>¡Nos vemos pronto!</p>
            <p>Equipo de Plataforma All-in-One</p>
        </div>
    `;
}

function generateInvoiceReminderHTML(invoice, timeLeft) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">💰 Recordatorio de Factura</h2>
            <p>Hola ${invoice.client.name},</p>
            <p>Te recordamos que tienes una factura pendiente:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Factura #${invoice.invoiceNumber}</h3>
                <p><strong>💰 Monto:</strong> $${invoice.amount}</p>
                <p><strong>📅 Fecha de vencimiento:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
                <p><strong>⏰ Tiempo restante:</strong> ${timeLeft}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}/invoices/${invoice.id}/pay" 
                   style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                    💳 Pagar Ahora
                </a>
            </div>
            
            <p>Si ya realizaste el pago, por favor ignora este mensaje.</p>
            <p>Gracias por tu confianza.</p>
            <p>Equipo de Plataforma All-in-One</p>
        </div>
    `;
}

function generatePaymentReminderHTML(payment, timeOverdue) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">⚠️ Pago Vencido</h2>
            <p>Hola ${payment.client.name},</p>
            <p>Te informamos que tienes una factura vencida:</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Factura #${payment.invoiceNumber}</h3>
                <p><strong>💰 Monto:</strong> $${payment.amount}</p>
                <p><strong>📅 Fecha de vencimiento:</strong> ${payment.dueDate.toLocaleDateString()}</p>
                <p><strong>⚠️ Estado:</strong> ${timeOverdue}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}/invoices/${payment.id}/pay" 
                   style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                    💳 Pagar Ahora
                </a>
            </div>
            
            <p><strong>Importante:</strong> Por favor realiza el pago lo antes posible para evitar cargos adicionales.</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Equipo de Plataforma All-in-One</p>
        </div>
    `;
}

// Función principal para procesar todos los recordatorios
async function processAllReminders() {
    try {
        console.log('⏰ Iniciando procesamiento de recordatorios...');
        
        await processMeetingReminders();
        await processInvoiceReminders();
        await processPaymentReminders();
        
        console.log('🎉 Todos los recordatorios procesados');
    } catch (error) {
        console.error('❌ Error procesando recordatorios:', error);
        throw error;
    }
}

// Función para limpiar logs antiguos
async function cleanupReminderLogs() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await prisma.reminderLog.deleteMany({
            where: {
                sentAt: {
                    lt: thirtyDaysAgo
                }
            }
        });

        console.log('🧹 Logs de recordatorios antiguos eliminados');
    } catch (error) {
        console.error('❌ Error limpiando logs:', error);
    }
}

// Configurar tareas programadas
function setupReminderScheduler() {
    console.log('⏰ Configurando scheduler de recordatorios...');

    // Procesar recordatorios cada 5 minutos
    schedule.scheduleJob('*/5 * * * *', async () => {
        try {
            await processAllReminders();
        } catch (error) {
            console.error('Error en procesamiento de recordatorios:', error);
        }
    });

    // Limpiar logs antiguos cada día a las 2 AM
    schedule.scheduleJob('0 2 * * *', async () => {
        try {
            await cleanupReminderLogs();
        } catch (error) {
            console.error('Error limpiando logs:', error);
        }
    });

    console.log('✅ Scheduler de recordatorios configurado');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'meetings':
            processMeetingReminders()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'invoices':
            processInvoiceReminders()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'payments':
            processPaymentReminders()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'all':
            processAllReminders()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'schedule':
            setupReminderScheduler();
            // Mantener el proceso corriendo
            process.on('SIGINT', () => {
                console.log('🛑 Deteniendo scheduler de recordatorios...');
                schedule.gracefulShutdown();
                process.exit(0);
            });
            break;
        default:
            console.log('Comandos disponibles: meetings, invoices, payments, all, schedule');
            process.exit(1);
    }
}

module.exports = {
    processMeetingReminders,
    processInvoiceReminders,
    processPaymentReminders,
    processAllReminders,
    setupReminderScheduler
};
