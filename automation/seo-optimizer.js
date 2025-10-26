// 🔍 SCRIPT DE OPTIMIZACIÓN SEO AUTOMÁTICA
// Ejecutar cada 24 horas para optimizar SEO
// =====================================================

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuración
const SITE_URL = process.env.SITE_URL || 'https://tu-dominio.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const ROBOTS_PATH = path.join(__dirname, '../public/robots.txt');

// Función para extraer palabras clave de contenido
function extractKeywords(content, maxKeywords = 10) {
    // Remover HTML tags
    const textContent = content.replace(/<[^>]*>/g, ' ');
    
    // Dividir en palabras y limpiar
    const words = textContent
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3);
    
    // Contar frecuencia de palabras
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Ordenar por frecuencia y devolver las más comunes
    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, maxKeywords)
        .map(([word]) => word);
}

// Función para crear slug URL-friendly
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Función para generar meta description
function generateMetaDescription(content, maxLength = 160) {
    const textContent = content.replace(/<[^>]*>/g, ' ').trim();
    if (textContent.length <= maxLength) {
        return textContent;
    }
    
    // Truncar en el último espacio antes del límite
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

// Función para generar título SEO optimizado
function generateSEOTitle(title, siteName = 'Plataforma All-in-One') {
    const maxLength = 60;
    const fullTitle = `${title} | ${siteName}`;
    
    if (fullTitle.length <= maxLength) {
        return fullTitle;
    }
    
    return title.length <= maxLength - siteName.length - 3 
        ? `${title} | ${siteName}`
        : title.substring(0, maxLength - siteName.length - 6) + '... | ' + siteName;
}

// Función para verificar estado de enlaces
async function checkLinkStatus(url) {
    try {
        const response = await axios.head(url, {
            timeout: 10000,
            maxRedirects: 5
        });
        return {
            status: response.status,
            url: url,
            working: response.status >= 200 && response.status < 400
        };
    } catch (error) {
        return {
            status: error.response?.status || 0,
            url: url,
            working: false,
            error: error.message
        };
    }
}

// Función para encontrar todos los enlaces en el sitio
async function findAllLinks() {
    try {
        // Obtener páginas de la base de datos
        const pages = await prisma.page.findMany({
            where: { published: true }
        });
        
        const links = new Set();
        
        // Extraer enlaces de cada página
        pages.forEach(page => {
            // Enlaces internos
            const internalLinks = page.content.match(/href="(\/[^"]*)"/g) || [];
            internalLinks.forEach(link => {
                const url = link.match(/href="([^"]*)"/)[1];
                if (url.startsWith('/')) {
                    links.add(SITE_URL + url);
                }
            });
            
            // Enlaces externos
            const externalLinks = page.content.match(/href="(https?:\/\/[^"]*)"/g) || [];
            externalLinks.forEach(link => {
                const url = link.match(/href="([^"]*)"/)[1];
                links.add(url);
            });
        });
        
        return Array.from(links);
    } catch (error) {
        console.error('Error encontrando enlaces:', error);
        return [];
    }
}

// Función para verificar enlaces rotos
async function checkBrokenLinks() {
    try {
        console.log('🔍 Verificando enlaces rotos...');
        
        const links = await findAllLinks();
        const results = [];
        const batchSize = 10;
        
        // Procesar enlaces en lotes para evitar sobrecarga
        for (let i = 0; i < links.length; i += batchSize) {
            const batch = links.slice(i, i + batchSize);
            const promises = batch.map(link => checkLinkStatus(link));
            const batchResults = await Promise.all(promises);
            results.push(...batchResults);
            
            // Pequeña pausa entre lotes
            if (i + batchSize < links.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        const brokenLinks = results.filter(result => !result.working);
        const workingLinks = results.filter(result => result.working);
        
        console.log(`✅ Enlaces verificados: ${results.length}`);
        console.log(`✅ Enlaces funcionando: ${workingLinks.length}`);
        console.log(`❌ Enlaces rotos: ${brokenLinks.length}`);
        
        // Guardar resultados en base de datos
        await prisma.seoReport.create({
            data: {
                type: 'broken_links',
                date: new Date(),
                totalLinks: results.length,
                workingLinks: workingLinks.length,
                brokenLinks: brokenLinks.length,
                details: JSON.stringify({
                    broken: brokenLinks,
                    working: workingLinks.slice(0, 100) // Limitar para evitar archivos muy grandes
                })
            }
        });
        
        return {
            total: results.length,
            working: workingLinks.length,
            broken: brokenLinks.length,
            brokenLinks: brokenLinks
        };
    } catch (error) {
        console.error('Error verificando enlaces rotos:', error);
        throw error;
    }
}

// Función para optimizar meta tags de páginas
async function optimizePageMetaTags() {
    try {
        console.log('🏷️ Optimizando meta tags de páginas...');
        
        const pages = await prisma.page.findMany({
            where: { published: true }
        });
        
        let optimizedCount = 0;
        
        for (const page of pages) {
            const updates = {};
            
            // Generar keywords si no existen
            if (!page.metaKeywords) {
                const keywords = extractKeywords(page.content);
                updates.metaKeywords = keywords.join(', ');
            }
            
            // Generar meta description si no existe
            if (!page.metaDescription) {
                updates.metaDescription = generateMetaDescription(page.content);
            }
            
            // Generar slug si no existe
            if (!page.slug) {
                updates.slug = createSlug(page.title);
            }
            
            // Optimizar título SEO
            if (!page.seoTitle) {
                updates.seoTitle = generateSEOTitle(page.title);
            }
            
            // Actualizar página si hay cambios
            if (Object.keys(updates).length > 0) {
                await prisma.page.update({
                    where: { id: page.id },
                    data: updates
                });
                
                optimizedCount++;
                console.log(`✅ Página optimizada: ${page.title}`);
            }
        }
        
        console.log(`🎉 ${optimizedCount} páginas optimizadas`);
        return optimizedCount;
    } catch (error) {
        console.error('Error optimizando meta tags:', error);
        throw error;
    }
}

// Función para generar sitemap XML
async function generateSitemap() {
    try {
        console.log('🗺️ Generando sitemap...');
        
        const pages = await prisma.page.findMany({
            where: { published: true },
            orderBy: { updatedAt: 'desc' }
        });
        
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Página principal
        sitemap += '  <url>\n';
        sitemap += `    <loc>${SITE_URL}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        sitemap += '    <changefreq>daily</changefreq>\n';
        sitemap += '    <priority>1.0</priority>\n';
        sitemap += '  </url>\n';
        
        // Páginas dinámicas
        pages.forEach(page => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${SITE_URL}/${page.slug || createSlug(page.title)}</loc>\n`;
            sitemap += `    <lastmod>${page.updatedAt.toISOString()}</lastmod>\n`;
            sitemap += '    <changefreq>weekly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });
        
        sitemap += '</urlset>';
        
        // Escribir sitemap
        fs.writeFileSync(SITEMAP_PATH, sitemap);
        
        console.log(`✅ Sitemap generado con ${pages.length + 1} URLs`);
        return pages.length + 1;
    } catch (error) {
        console.error('Error generando sitemap:', error);
        throw error;
    }
}

// Función para generar robots.txt
async function generateRobotsTxt() {
    try {
        console.log('🤖 Generando robots.txt...');
        
        const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /
Allow: /contact
Allow: /about
Allow: /services
Allow: /pricing

# Crawl delay
Crawl-delay: 1
`;
        
        fs.writeFileSync(ROBOTS_PATH, robotsContent);
        
        console.log('✅ robots.txt generado');
    } catch (error) {
        console.error('Error generando robots.txt:', error);
        throw error;
    }
}

// Función para analizar densidad de palabras clave
async function analyzeKeywordDensity() {
    try {
        console.log('📊 Analizando densidad de palabras clave...');
        
        const pages = await prisma.page.findMany({
            where: { published: true }
        });
        
        const keywordAnalysis = [];
        
        pages.forEach(page => {
            const keywords = extractKeywords(page.content, 20);
            const totalWords = page.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
            
            keywordAnalysis.push({
                pageId: page.id,
                pageTitle: page.title,
                keywords: keywords,
                totalWords: totalWords,
                keywordDensity: keywords.map(keyword => ({
                    keyword: keyword,
                    density: (page.content.toLowerCase().split(keyword).length - 1) / totalWords * 100
                }))
            });
        });
        
        // Guardar análisis en base de datos
        await prisma.seoReport.create({
            data: {
                type: 'keyword_density',
                date: new Date(),
                totalPages: pages.length,
                details: JSON.stringify(keywordAnalysis)
            }
        });
        
        console.log(`✅ Análisis de densidad completado para ${pages.length} páginas`);
        return keywordAnalysis;
    } catch (error) {
        console.error('Error analizando densidad de palabras clave:', error);
        throw error;
    }
}

// Función para verificar velocidad del sitio
async function checkSiteSpeed() {
    try {
        console.log('⚡ Verificando velocidad del sitio...');
        
        const pagespeedApiKey = process.env.PAGESPEED_API_KEY;
        if (!pagespeedApiKey) {
            console.log('⚠️ API Key de PageSpeed no configurada');
            return null;
        }
        
        const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
            params: {
                url: SITE_URL,
                key: pagespeedApiKey,
                strategy: 'mobile'
            }
        });
        
        const lighthouse = response.data.lighthouseResult;
        const metrics = {
            performance: Math.round(lighthouse.categories.performance.score * 100),
            accessibility: Math.round(lighthouse.categories.accessibility.score * 100),
            bestPractices: Math.round(lighthouse.categories['best-practices'].score * 100),
            seo: Math.round(lighthouse.categories.seo.score * 100),
            firstContentfulPaint: lighthouse.audits['first-contentful-paint'].numericValue,
            largestContentfulPaint: lighthouse.audits['largest-contentful-paint'].numericValue,
            cumulativeLayoutShift: lighthouse.audits['cumulative-layout-shift'].numericValue
        };
        
        // Guardar métricas en base de datos
        await prisma.seoReport.create({
            data: {
                type: 'site_speed',
                date: new Date(),
                totalPages: 1,
                details: JSON.stringify(metrics)
            }
        });
        
        console.log(`✅ Velocidad verificada - Performance: ${metrics.performance}%`);
        return metrics;
    } catch (error) {
        console.error('Error verificando velocidad:', error);
        return null;
    }
}

// Función para generar reporte SEO completo
async function generateSEOReport() {
    try {
        console.log('📊 Generando reporte SEO completo...');
        
        const report = {
            date: new Date(),
            siteUrl: SITE_URL,
            optimizations: {},
            recommendations: []
        };
        
        // Optimizar meta tags
        report.optimizations.metaTagsOptimized = await optimizePageMetaTags();
        
        // Generar sitemap
        report.optimizations.sitemapUrls = await generateSitemap();
        
        // Generar robots.txt
        await generateRobotsTxt();
        
        // Verificar enlaces rotos
        const linkCheck = await checkBrokenLinks();
        report.optimizations.brokenLinks = linkCheck.broken;
        
        // Analizar densidad de palabras clave
        const keywordAnalysis = await analyzeKeywordDensity();
        report.optimizations.keywordAnalysis = keywordAnalysis.length;
        
        // Verificar velocidad
        const speedMetrics = await checkSiteSpeed();
        if (speedMetrics) {
            report.optimizations.siteSpeed = speedMetrics.performance;
            
            // Generar recomendaciones basadas en velocidad
            if (speedMetrics.performance < 70) {
                report.recommendations.push('Optimizar imágenes para mejorar velocidad');
                report.recommendations.push('Implementar lazy loading');
                report.recommendations.push('Minificar CSS y JavaScript');
            }
        }
        
        // Generar recomendaciones basadas en enlaces rotos
        if (linkCheck.broken > 0) {
            report.recommendations.push(`Reparar ${linkCheck.broken} enlaces rotos`);
        }
        
        // Guardar reporte completo
        await prisma.seoReport.create({
            data: {
                type: 'full_report',
                date: new Date(),
                totalPages: report.optimizations.metaTagsOptimized,
                details: JSON.stringify(report)
            }
        });
        
        console.log('🎉 Reporte SEO completo generado');
        return report;
    } catch (error) {
        console.error('Error generando reporte SEO:', error);
        throw error;
    }
}

// Función para limpiar reportes antiguos
async function cleanupOldReports() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        await prisma.seoReport.deleteMany({
            where: {
                date: {
                    lt: thirtyDaysAgo
                }
            }
        });
        
        console.log('🧹 Reportes SEO antiguos eliminados');
    } catch (error) {
        console.error('Error limpiando reportes antiguos:', error);
    }
}

// Función principal de optimización SEO
async function optimizeSEO() {
    try {
        console.log('🔍 Iniciando optimización SEO automática...');
        
        const report = await generateSEOReport();
        await cleanupOldReports();
        
        console.log('✅ Optimización SEO completada');
        console.log(`📊 Resumen:`);
        console.log(`   - Meta tags optimizados: ${report.optimizations.metaTagsOptimized}`);
        console.log(`   - URLs en sitemap: ${report.optimizations.sitemapUrls}`);
        console.log(`   - Enlaces rotos: ${report.optimizations.brokenLinks}`);
        console.log(`   - Recomendaciones: ${report.recommendations.length}`);
        
        return report;
    } catch (error) {
        console.error('❌ Error en optimización SEO:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'optimize':
            optimizeSEO()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'links':
            checkBrokenLinks()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'sitemap':
            generateSitemap()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'meta':
            optimizePageMetaTags()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'speed':
            checkSiteSpeed()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        default:
            console.log('Comandos disponibles: optimize, links, sitemap, meta, speed');
            process.exit(1);
    }
}

module.exports = {
    optimizeSEO,
    checkBrokenLinks,
    generateSitemap,
    optimizePageMetaTags,
    checkSiteSpeed,
    extractKeywords,
    createSlug,
    generateMetaDescription,
    generateSEOTitle
};
