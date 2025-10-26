// 📱 SCRIPT DE PUBLICACIÓN AUTOMÁTICA EN REDES SOCIALES
// Ejecutar según programación configurada
// =====================================================

const schedule = require('node-schedule');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configuración de APIs de redes sociales
const socialAPIs = {
    instagram: {
        baseURL: 'https://graph.facebook.com/v18.0',
        async post(imagePath, caption, accessToken) {
            try {
                // Subir imagen
                const formData = new FormData();
                formData.append('image_url', imagePath);
                formData.append('caption', caption);
                formData.append('access_token', accessToken);

                const response = await axios.post(`${this.baseURL}/me/media`, formData);
                const mediaId = response.data.id;

                // Publicar
                const publishResponse = await axios.post(`${this.baseURL}/me/media_publish`, {
                    creation_id: mediaId,
                    access_token: accessToken
                });

                return publishResponse.data;
            } catch (error) {
                console.error('Error posting to Instagram:', error.response?.data || error.message);
                throw error;
            }
        }
    },

    facebook: {
        baseURL: 'https://graph.facebook.com/v18.0',
        async post(message, imagePath, accessToken) {
            try {
                const formData = new FormData();
                formData.append('message', message);
                if (imagePath) {
                    formData.append('source', fs.createReadStream(imagePath));
                }
                formData.append('access_token', accessToken);

                const response = await axios.post(`${this.baseURL}/me/photos`, formData);
                return response.data;
            } catch (error) {
                console.error('Error posting to Facebook:', error.response?.data || error.message);
                throw error;
            }
        }
    },

    twitter: {
        baseURL: 'https://api.twitter.com/2',
        async tweet(text, imagePath, accessToken) {
            try {
                let mediaId = null;
                
                // Subir imagen si existe
                if (imagePath) {
                    const imageBuffer = fs.readFileSync(imagePath);
                    const imageBase64 = imageBuffer.toString('base64');
                    
                    const mediaResponse = await axios.post(`${this.baseURL}/media/upload`, {
                        media_data: imageBase64
                    }, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    
                    mediaId = mediaResponse.data.media_id_string;
                }

                // Crear tweet
                const tweetData = {
                    text: text
                };

                if (mediaId) {
                    tweetData.media = {
                        media_ids: [mediaId]
                    };
                }

                const response = await axios.post(`${this.baseURL}/tweets`, tweetData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return response.data;
            } catch (error) {
                console.error('Error posting to Twitter:', error.response?.data || error.message);
                throw error;
            }
        }
    },

    linkedin: {
        baseURL: 'https://api.linkedin.com/v2',
        async post(text, imagePath, accessToken) {
            try {
                let mediaId = null;
                
                // Subir imagen si existe
                if (imagePath) {
                    const imageBuffer = fs.readFileSync(imagePath);
                    const imageBase64 = imageBuffer.toString('base64');
                    
                    const mediaResponse = await axios.post(`${this.baseURL}/assets?action=registerUpload`, {
                        registerUploadRequest: {
                            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                            owner: 'urn:li:person:YOUR_PERSON_ID',
                            serviceRelationships: [{
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent'
                            }]
                        }
                    }, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    mediaId = mediaResponse.data.value.asset;
                }

                // Crear post
                const postData = {
                    author: 'urn:li:person:YOUR_PERSON_ID',
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: {
                                text: text
                            },
                            shareMediaCategory: imagePath ? 'IMAGE' : 'NONE'
                        }
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                    }
                };

                if (mediaId) {
                    postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
                        status: 'READY',
                        description: {
                            text: text
                        },
                        media: mediaId
                    }];
                }

                const response = await axios.post(`${this.baseURL}/ugcPosts`, postData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return response.data;
            } catch (error) {
                console.error('Error posting to LinkedIn:', error.response?.data || error.message);
                throw error;
            }
        }
    },

    tiktok: {
        baseURL: 'https://open-api.tiktok.com',
        async post(videoPath, caption, accessToken) {
            try {
                // TikTok requiere un proceso más complejo para subir videos
                // Este es un ejemplo simplificado
                const formData = new FormData();
                formData.append('video', fs.createReadStream(videoPath));
                formData.append('description', caption);
                formData.append('access_token', accessToken);

                const response = await axios.post(`${this.baseURL}/share/video/upload/`, formData);
                return response.data;
            } catch (error) {
                console.error('Error posting to TikTok:', error.response?.data || error.message);
                throw error;
            }
        }
    }
};

// Función para obtener contenido programado
async function getScheduledContent() {
    try {
        const now = new Date();
        const scheduledPosts = await prisma.socialPost.findMany({
            where: {
                scheduledTime: {
                    lte: now
                },
                status: 'scheduled'
            },
            include: {
                user: true
            }
        });

        return scheduledPosts;
    } catch (error) {
        console.error('Error obteniendo contenido programado:', error);
        throw error;
    }
}

// Función para publicar en una plataforma específica
async function publishToPlatform(post, platform) {
    try {
        const user = post.user;
        const platformConfig = user.socialConfigs.find(config => config.platform === platform);
        
        if (!platformConfig || !platformConfig.accessToken) {
            throw new Error(`No hay configuración para ${platform}`);
        }

        let result;
        const api = socialAPIs[platform];

        switch (platform) {
            case 'instagram':
                result = await api.post(post.imageUrl, post.content, platformConfig.accessToken);
                break;
            case 'facebook':
                result = await api.post(post.content, post.imageUrl, platformConfig.accessToken);
                break;
            case 'twitter':
                result = await api.tweet(post.content, post.imageUrl, platformConfig.accessToken);
                break;
            case 'linkedin':
                result = await api.post(post.content, post.imageUrl, platformConfig.accessToken);
                break;
            case 'tiktok':
                result = await api.post(post.videoUrl, post.content, platformConfig.accessToken);
                break;
            default:
                throw new Error(`Plataforma no soportada: ${platform}`);
        }

        return result;
    } catch (error) {
        console.error(`Error publicando en ${platform}:`, error);
        throw error;
    }
}

// Función para actualizar estado del post
async function updatePostStatus(postId, status, errorMessage = null) {
    try {
        await prisma.socialPost.update({
            where: { id: postId },
            data: {
                status: status,
                publishedAt: status === 'published' ? new Date() : null,
                errorMessage: errorMessage
            }
        });
    } catch (error) {
        console.error('Error actualizando estado del post:', error);
    }
}

// Función para publicar contenido programado
async function publishScheduledContent() {
    try {
        console.log('📱 Iniciando publicación de contenido programado...');
        
        const scheduledPosts = await getScheduledContent();
        console.log(`📋 Encontrados ${scheduledPosts.length} posts programados`);

        for (const post of scheduledPosts) {
            console.log(`📝 Procesando post: ${post.id}`);
            
            const platforms = post.platforms || ['facebook', 'twitter', 'instagram'];
            const results = [];
            let hasError = false;

            for (const platform of platforms) {
                try {
                    console.log(`🚀 Publicando en ${platform}...`);
                    const result = await publishToPlatform(post, platform);
                    results.push({
                        platform: platform,
                        success: true,
                        result: result
                    });
                    console.log(`✅ Publicado exitosamente en ${platform}`);
                } catch (error) {
                    console.error(`❌ Error en ${platform}:`, error.message);
                    results.push({
                        platform: platform,
                        success: false,
                        error: error.message
                    });
                    hasError = true;
                }
            }

            // Actualizar estado del post
            if (hasError) {
                await updatePostStatus(post.id, 'partial', 'Algunas plataformas fallaron');
            } else {
                await updatePostStatus(post.id, 'published');
            }

            // Guardar resultados
            await prisma.socialPostResult.create({
                data: {
                    postId: post.id,
                    results: JSON.stringify(results),
                    publishedAt: new Date()
                }
            });
        }

        console.log('🎉 Publicación programada completada');
    } catch (error) {
        console.error('❌ Error en publicación programada:', error);
        throw error;
    }
}

// Función para programar un post
async function schedulePost(content, platforms, scheduledTime, userId) {
    try {
        const post = await prisma.socialPost.create({
            data: {
                content: content.content,
                imageUrl: content.imageUrl,
                videoUrl: content.videoUrl,
                platforms: platforms,
                scheduledTime: new Date(scheduledTime),
                status: 'scheduled',
                userId: userId
            }
        });

        console.log(`📅 Post programado para ${scheduledTime}: ${post.id}`);
        return post;
    } catch (error) {
        console.error('Error programando post:', error);
        throw error;
    }
}

// Función para generar contenido automático
async function generateAutomaticContent() {
    try {
        console.log('🤖 Generando contenido automático...');
        
        // Obtener datos del día para generar contenido
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Obtener estadísticas del día
        const invoices = await prisma.invoice.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        const revenue = await prisma.payment.aggregate({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            _sum: {
                amount: true
            }
        });

        const newContacts = await prisma.contact.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // Generar contenido basado en estadísticas
        const contentTemplates = [
            {
                text: `📊 ¡Excelente día! Generamos ${invoices} facturas y $${revenue._sum.amount || 0} en ingresos. ¡Gracias por confiar en nosotros! #NegociosExitosos #Facturacion`,
                platforms: ['facebook', 'twitter', 'linkedin']
            },
            {
                text: `👥 ¡Bienvenidos ${newContacts} nuevos contactos hoy! Estamos creciendo gracias a ustedes. #CrecimientoEmpresarial #NuevosClientes`,
                platforms: ['facebook', 'twitter']
            },
            {
                text: `💼 La gestión empresarial nunca fue tan fácil. Automatiza tus procesos con nuestra plataforma All-in-One. #Productividad #Automatizacion`,
                platforms: ['linkedin', 'twitter']
            }
        ];

        // Programar contenido para diferentes horarios
        const scheduleTimes = [
            new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas después
            new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 horas después
            new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 horas después
        ];

        for (let i = 0; i < contentTemplates.length && i < scheduleTimes.length; i++) {
            const template = contentTemplates[i];
            const scheduleTime = scheduleTimes[i];

            await schedulePost(
                {
                    content: template.text,
                    imageUrl: null,
                    videoUrl: null
                },
                template.platforms,
                scheduleTime,
                1 // ID del usuario administrador
            );
        }

        console.log('✅ Contenido automático generado');
    } catch (error) {
        console.error('❌ Error generando contenido automático:', error);
        throw error;
    }
}

// Función para analizar rendimiento de posts
async function analyzePostPerformance() {
    try {
        console.log('📈 Analizando rendimiento de posts...');
        
        const posts = await prisma.socialPost.findMany({
            where: {
                status: 'published',
                publishedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
                }
            },
            include: {
                results: true
            }
        });

        const platformStats = {};
        
        for (const post of posts) {
            for (const result of post.results) {
                const results = JSON.parse(result.results);
                
                for (const platformResult of results) {
                    if (!platformStats[platformResult.platform]) {
                        platformStats[platformResult.platform] = {
                            total: 0,
                            successful: 0,
                            failed: 0
                        };
                    }
                    
                    platformStats[platformResult.platform].total++;
                    if (platformResult.success) {
                        platformStats[platformResult.platform].successful++;
                    } else {
                        platformStats[platformResult.platform].failed++;
                    }
                }
            }
        }

        // Guardar estadísticas
        await prisma.socialAnalytics.create({
            data: {
                date: new Date(),
                platformStats: JSON.stringify(platformStats),
                totalPosts: posts.length
            }
        });

        console.log('📊 Estadísticas de rendimiento:', platformStats);
        console.log('✅ Análisis de rendimiento completado');
    } catch (error) {
        console.error('❌ Error analizando rendimiento:', error);
        throw error;
    }
}

// Programar tareas automáticas
function setupScheduledTasks() {
    console.log('⏰ Configurando tareas programadas...');

    // Publicar contenido programado cada 5 minutos
    schedule.scheduleJob('*/5 * * * *', async () => {
        try {
            await publishScheduledContent();
        } catch (error) {
            console.error('Error en publicación programada:', error);
        }
    });

    // Generar contenido automático cada día a las 9 AM
    schedule.scheduleJob('0 9 * * *', async () => {
        try {
            await generateAutomaticContent();
        } catch (error) {
            console.error('Error generando contenido automático:', error);
        }
    });

    // Analizar rendimiento cada día a las 11 PM
    schedule.scheduleJob('0 23 * * *', async () => {
        try {
            await analyzePostPerformance();
        } catch (error) {
            console.error('Error analizando rendimiento:', error);
        }
    });

    console.log('✅ Tareas programadas configuradas');
}

// Función para limpiar posts antiguos
async function cleanupOldPosts() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Eliminar posts antiguos
        await prisma.socialPost.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo
                },
                status: 'published'
            }
        });

        // Eliminar resultados antiguos
        await prisma.socialPostResult.deleteMany({
            where: {
                publishedAt: {
                    lt: thirtyDaysAgo
                }
            }
        });

        console.log('🧹 Posts antiguos eliminados');
    } catch (error) {
        console.error('❌ Error limpiando posts antiguos:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'publish':
            publishScheduledContent()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'generate':
            generateAutomaticContent()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'analyze':
            analyzePostPerformance()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'cleanup':
            cleanupOldPosts()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'schedule':
            setupScheduledTasks();
            // Mantener el proceso corriendo
            process.on('SIGINT', () => {
                console.log('🛑 Deteniendo scheduler...');
                schedule.gracefulShutdown();
                process.exit(0);
            });
            break;
        default:
            console.log('Comandos disponibles: publish, generate, analyze, cleanup, schedule');
            process.exit(1);
    }
}

module.exports = {
    publishScheduledContent,
    generateAutomaticContent,
    analyzePostPerformance,
    schedulePost,
    setupScheduledTasks,
    cleanupOldPosts
};
