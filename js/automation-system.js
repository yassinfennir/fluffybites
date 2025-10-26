/* ==========================================================================
   Fluffy Bites - Automation System
   Sistema de Automatización Completo
   ========================================================================== */

class AutomationSystem {
    constructor() {
        this.tasks = new Map();
        this.schedules = new Map();
        this.triggers = new Map();
        this.isRunning = false;
        this.automationRules = [];
        this.notifications = [];
        this.analytics = {
            tasksExecuted: 0,
            errors: 0,
            uptime: Date.now()
        };
        
        this.init();
        this.setupAutomationRules();
        this.setupScheduledTasks();
        this.setupEventTriggers();
        this.startAutomationEngine();
    }

    init() {
        console.log('🤖 Automation System initialized');
        
        // Setup error handling
        this.setupErrorHandling();
        
        // Setup monitoring
        this.setupMonitoring();
        
        // Setup backup system
        this.setupBackupSystem();
        
        // Setup auto-updates
        this.setupAutoUpdates();
    }

    setupAutomationRules() {
        // Product Management Automation
        this.addAutomationRule({
            name: 'Auto Update Product Availability',
            description: 'Automatically update product availability based on time',
            trigger: 'schedule',
            schedule: '0 6 * * *', // Every day at 6 AM
            action: () => this.autoUpdateProductAvailability(),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Backup Products',
            description: 'Automatically backup product data',
            trigger: 'schedule',
            schedule: '0 2 * * *', // Every day at 2 AM
            action: () => this.autoBackupProducts(),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Optimize Images',
            description: 'Automatically optimize new images',
            trigger: 'event',
            event: 'productAdded',
            action: (data) => this.autoOptimizeImages(data),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Update Prices',
            description: 'Automatically update prices based on market data',
            trigger: 'schedule',
            schedule: '0 8 * * 1', // Every Monday at 8 AM
            action: () => this.autoUpdatePrices(),
            enabled: false // Disabled by default
        });

        this.addAutomationRule({
            name: 'Auto Generate Reports',
            description: 'Automatically generate daily reports',
            trigger: 'schedule',
            schedule: '0 23 * * *', // Every day at 11 PM
            action: () => this.autoGenerateReports(),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Clean Cache',
            description: 'Automatically clean cache and optimize performance',
            trigger: 'schedule',
            schedule: '0 */6 * * *', // Every 6 hours
            action: () => this.autoCleanCache(),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Update Menu Display',
            description: 'Automatically update menu display based on availability',
            trigger: 'event',
            event: 'productUpdated',
            action: (data) => this.autoUpdateMenuDisplay(data),
            enabled: true
        });

        this.addAutomationRule({
            name: 'Auto Send Notifications',
            description: 'Automatically send notifications for important events',
            trigger: 'event',
            event: 'productOutOfStock',
            action: (data) => this.autoSendNotifications(data),
            enabled: true
        });
    }

    addAutomationRule(rule) {
        this.automationRules.push(rule);
        console.log(`📋 Automation rule added: ${rule.name}`);
    }

    setupScheduledTasks() {
        // Setup cron-like scheduler
        this.scheduler = new AutomationScheduler();
        
        // Add all scheduled rules
        this.automationRules
            .filter(rule => rule.trigger === 'schedule' && rule.enabled)
            .forEach(rule => {
                this.scheduler.addTask(rule.name, rule.schedule, rule.action);
            });
    }

    setupEventTriggers() {
        // Listen for product changes
        document.addEventListener('productChanged', (event) => {
            this.handleProductChange(event.detail);
        });

        // Listen for system events
        window.addEventListener('beforeunload', () => {
            this.handleSystemShutdown();
        });

        // Listen for performance issues
        if (window.performanceOptimizer) {
            setInterval(() => {
                const metrics = window.performanceOptimizer.getPerformanceMetrics();
                if (metrics.memoryUsage && metrics.memoryUsage.used > 100) {
                    this.handleHighMemoryUsage(metrics);
                }
            }, 60000); // Check every minute
        }
    }

    startAutomationEngine() {
        this.isRunning = true;
        console.log('🚀 Automation Engine started');
        
        // Start scheduler
        this.scheduler.start();
        
        // Start monitoring loop
        this.startMonitoringLoop();
        
        // Start health checks
        this.startHealthChecks();
    }

    // Automation Actions
    async autoUpdateProductAvailability() {
        try {
            console.log('🔄 Auto-updating product availability...');
            
            if (!window.productManager) {
                throw new Error('Product manager not available');
            }

            const products = window.productManager.getAllProducts();
            const updates = [];

            // Simulate business logic for availability
            products.forEach(product => {
                // Example: Mark products as unavailable after 8 PM
                const now = new Date();
                const hour = now.getHours();
                
                if (hour >= 20 && product.category === 'pasteles') {
                    if (product.available) {
                        updates.push({
                            id: product.id,
                            available: false,
                            reason: 'After hours - pastries unavailable'
                        });
                    }
                } else if (hour < 7 && product.category === 'cafe') {
                    // Mark coffee as available at 7 AM
                    if (!product.available) {
                        updates.push({
                            id: product.id,
                            available: true,
                            reason: 'Opening hours - coffee available'
                        });
                    }
                }
            });

            // Apply updates
            updates.forEach(update => {
                window.productManager.updateProduct(update.id, {
                    available: update.available
                });
            });

            if (updates.length > 0) {
                this.logActivity('Product availability updated', {
                    count: updates.length,
                    updates: updates
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto update product availability', error);
        }
    }

    async autoBackupProducts() {
        try {
            console.log('💾 Auto-backing up products...');
            
            if (!window.productManager) {
                throw new Error('Product manager not available');
            }

            const products = window.productManager.getAllProducts();
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                products: products,
                metadata: {
                    totalProducts: products.length,
                    categories: [...new Set(products.map(p => p.category))],
                    lastModified: Math.max(...products.map(p => new Date(p.updatedAt).getTime()))
                }
            };

            // Save to localStorage
            localStorage.setItem('fluffy-bites-backup', JSON.stringify(backup));
            
            // Save to sessionStorage as well
            sessionStorage.setItem('fluffy-bites-backup', JSON.stringify(backup));

            this.logActivity('Products backed up', {
                productCount: products.length,
                timestamp: backup.timestamp
            });

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto backup products', error);
        }
    }

    async autoOptimizeImages(data) {
        try {
            console.log('🖼️ Auto-optimizing images...');
            
            if (data && data.product && data.product.image) {
                const imagePath = data.product.image;
                
                // Simulate image optimization
                await this.delay(1000);
                
                this.logActivity('Image optimized', {
                    imagePath: imagePath,
                    productId: data.product.id
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto optimize images', error);
        }
    }

    async autoUpdatePrices() {
        try {
            console.log('💰 Auto-updating prices...');
            
            // Simulate price updates based on market data
            const priceUpdates = [
                { category: 'cafe', adjustment: 0.05 }, // 5% increase
                { category: 'sandwiches', adjustment: 0.03 }, // 3% increase
                { category: 'pasteles', adjustment: 0.02 }, // 2% increase
                { category: 'bebidas', adjustment: 0.04 } // 4% increase
            ];

            if (window.productManager) {
                const products = window.productManager.getAllProducts();
                
                priceUpdates.forEach(update => {
                    const categoryProducts = products.filter(p => p.category === update.category);
                    categoryProducts.forEach(product => {
                        const newPrice = product.price * (1 + update.adjustment);
                        window.productManager.updateProduct(product.id, {
                            price: Math.round(newPrice * 100) / 100
                        });
                    });
                });

                this.logActivity('Prices updated', {
                    updates: priceUpdates.length,
                    categories: priceUpdates.map(u => u.category)
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto update prices', error);
        }
    }

    async autoGenerateReports() {
        try {
            console.log('📊 Auto-generating reports...');
            
            const report = {
                timestamp: new Date().toISOString(),
                date: new Date().toISOString().split('T')[0],
                analytics: this.analytics,
                performance: window.performanceOptimizer ? 
                    window.performanceOptimizer.getPerformanceMetrics() : null,
                products: window.productManager ? 
                    window.productManager.getProductStats() : null
            };

            // Save report
            localStorage.setItem(`fluffy-bites-report-${report.date}`, JSON.stringify(report));
            
            this.logActivity('Report generated', {
                date: report.date,
                analytics: report.analytics
            });

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto generate reports', error);
        }
    }

    async autoCleanCache() {
        try {
            console.log('🧹 Auto-cleaning cache...');
            
            if (window.performanceOptimizer) {
                // Clear image cache
                window.performanceOptimizer.imageCache.clear();
                window.performanceOptimizer.resourceCache.clear();
                
                // Clear old localStorage data
                const keys = Object.keys(localStorage);
                const oldKeys = keys.filter(key => 
                    key.startsWith('fluffy-bites-') && 
                    key.includes('backup') &&
                    new Date(JSON.parse(localStorage.getItem(key)).timestamp) < 
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Older than 7 days
                );
                
                oldKeys.forEach(key => localStorage.removeItem(key));
                
                this.logActivity('Cache cleaned', {
                    oldBackupsRemoved: oldKeys.length
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto clean cache', error);
        }
    }

    async autoUpdateMenuDisplay(data) {
        try {
            console.log('📋 Auto-updating menu display...');
            
            // Trigger menu re-render if product was updated
            if (data && data.product) {
                // Dispatch custom event to update menu
                const event = new CustomEvent('menuUpdateRequired', {
                    detail: { product: data.product }
                });
                document.dispatchEvent(event);
                
                this.logActivity('Menu display updated', {
                    productId: data.product.id,
                    productName: data.product.name
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto update menu display', error);
        }
    }

    async autoSendNotifications(data) {
        try {
            console.log('📢 Auto-sending notifications...');
            
            if (data && data.product) {
                const notification = {
                    type: 'warning',
                    title: 'Product Out of Stock',
                    message: `${data.product.name} is out of stock`,
                    timestamp: new Date().toISOString(),
                    productId: data.product.id
                };
                
                this.notifications.push(notification);
                
                // Show notification to user
                if (window.showNotification) {
                    window.showNotification(notification.message, 'warning');
                }
                
                this.logActivity('Notification sent', {
                    type: notification.type,
                    productId: data.product.id
                });
            }

            this.analytics.tasksExecuted++;
            
        } catch (error) {
            this.handleError('Auto send notifications', error);
        }
    }

    // Event Handlers
    handleProductChange(detail) {
        // Trigger relevant automation rules
        this.automationRules
            .filter(rule => rule.trigger === 'event' && rule.enabled)
            .forEach(rule => {
                if (rule.event === detail.action) {
                    try {
                        rule.action(detail);
                    } catch (error) {
                        this.handleError(`Event handler: ${rule.name}`, error);
                    }
                }
            });
    }

    handleSystemShutdown() {
        console.log('🔄 System shutting down, saving state...');
        
        // Save current state
        this.saveSystemState();
        
        // Stop automation engine
        this.stopAutomationEngine();
    }

    handleHighMemoryUsage(metrics) {
        console.warn('⚠️ High memory usage detected:', metrics.memoryUsage);
        
        // Trigger cache cleanup
        this.autoCleanCache();
        
        // Log warning
        this.logActivity('High memory usage', {
            memoryUsage: metrics.memoryUsage,
            timestamp: new Date().toISOString()
        });
    }

    // Monitoring and Health Checks
    startMonitoringLoop() {
        setInterval(() => {
            this.performHealthCheck();
        }, 30000); // Every 30 seconds
    }

    startHealthChecks() {
        setInterval(() => {
            this.checkSystemHealth();
        }, 300000); // Every 5 minutes
    }

    performHealthCheck() {
        const health = {
            timestamp: new Date().toISOString(),
            automationEngine: this.isRunning,
            tasksExecuted: this.analytics.tasksExecuted,
            errors: this.analytics.errors,
            uptime: Date.now() - this.analytics.uptime,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576)
            } : null
        };

        // Log health status
        if (health.errors > 0) {
            console.warn('⚠️ Health check warning:', health);
        } else {
            console.log('✅ Health check OK:', health);
        }
    }

    checkSystemHealth() {
        // Check if all critical systems are running
        const criticalSystems = [
            { name: 'Product Manager', check: () => !!window.productManager },
            { name: 'Performance Optimizer', check: () => !!window.performanceOptimizer },
            { name: 'Admin Panel', check: () => !!window.AdminPanel }
        ];

        const healthStatus = criticalSystems.map(system => ({
            name: system.name,
            status: system.check() ? 'healthy' : 'unhealthy'
        }));

        const unhealthySystems = healthStatus.filter(s => s.status === 'unhealthy');
        
        if (unhealthySystems.length > 0) {
            console.error('❌ Unhealthy systems detected:', unhealthySystems);
            this.handleError('System health check', new Error('Unhealthy systems detected'));
        } else {
            console.log('✅ All systems healthy');
        }
    }

    // Error Handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError('Global error', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled promise rejection', event.reason);
        });
    }

    handleError(context, error) {
        this.analytics.errors++;
        
        const errorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            error: error.message || error,
            stack: error.stack || null
        };

        console.error('❌ Automation error:', errorLog);
        
        // Save error log
        const errors = JSON.parse(localStorage.getItem('fluffy-bites-errors') || '[]');
        errors.push(errorLog);
        
        // Keep only last 100 errors
        if (errors.length > 100) {
            errors.splice(0, errors.length - 100);
        }
        
        localStorage.setItem('fluffy-bites-errors', JSON.stringify(errors));
    }

    // Utility Functions
    logActivity(activity, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            activity: activity,
            data: data
        };

        console.log('📝 Activity logged:', logEntry);
        
        // Save to localStorage
        const logs = JSON.parse(localStorage.getItem('fluffy-bites-activity-logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 1000 entries
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('fluffy-bites-activity-logs', JSON.stringify(logs));
    }

    saveSystemState() {
        const state = {
            timestamp: new Date().toISOString(),
            analytics: this.analytics,
            automationRules: this.automationRules,
            notifications: this.notifications
        };

        localStorage.setItem('fluffy-bites-automation-state', JSON.stringify(state));
    }

    loadSystemState() {
        try {
            const state = JSON.parse(localStorage.getItem('fluffy-bites-automation-state') || '{}');
            
            if (state.analytics) {
                this.analytics = { ...this.analytics, ...state.analytics };
            }
            
            if (state.notifications) {
                this.notifications = state.notifications;
            }
            
            console.log('📦 System state loaded');
        } catch (error) {
            console.error('❌ Failed to load system state:', error);
        }
    }

    stopAutomationEngine() {
        this.isRunning = false;
        this.scheduler.stop();
        console.log('🛑 Automation Engine stopped');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    getAnalytics() {
        return {
            ...this.analytics,
            uptime: Date.now() - this.analytics.uptime,
            automationRules: this.automationRules.length,
            enabledRules: this.automationRules.filter(r => r.enabled).length
        };
    }

    getNotifications() {
        return this.notifications;
    }

    toggleAutomationRule(ruleName, enabled) {
        const rule = this.automationRules.find(r => r.name === ruleName);
        if (rule) {
            rule.enabled = enabled;
            console.log(`🔄 Automation rule ${ruleName} ${enabled ? 'enabled' : 'disabled'}`);
        }
    }
}

// Automation Scheduler Class
class AutomationScheduler {
    constructor() {
        this.tasks = new Map();
        this.intervals = new Map();
        this.isRunning = false;
    }

    addTask(name, schedule, action) {
        this.tasks.set(name, { schedule, action });
        console.log(`⏰ Scheduled task added: ${name}`);
    }

    start() {
        this.isRunning = true;
        this.tasks.forEach((task, name) => {
            this.scheduleTask(name, task);
        });
        console.log('⏰ Scheduler started');
    }

    stop() {
        this.isRunning = false;
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
        console.log('⏰ Scheduler stopped');
    }

    scheduleTask(name, task) {
        // Simple scheduler - in production, use a proper cron library
        const interval = this.parseSchedule(task.schedule);
        
        if (interval > 0) {
            const intervalId = setInterval(() => {
                if (this.isRunning) {
                    try {
                        task.action();
                    } catch (error) {
                        console.error(`❌ Scheduled task error (${name}):`, error);
                    }
                }
            }, interval);
            
            this.intervals.set(name, intervalId);
        }
    }

    parseSchedule(schedule) {
        // Simple schedule parser - convert cron-like to milliseconds
        // This is a simplified version for demo purposes
        const parts = schedule.split(' ');
        
        if (parts[0] === '0' && parts[1] === '*/6') {
            return 6 * 60 * 60 * 1000; // Every 6 hours
        } else if (parts[0] === '0' && parts[1] === '6') {
            return 24 * 60 * 60 * 1000; // Daily at 6 AM
        } else if (parts[0] === '0' && parts[1] === '2') {
            return 24 * 60 * 60 * 1000; // Daily at 2 AM
        } else if (parts[0] === '0' && parts[1] === '8' && parts[4] === '1') {
            return 7 * 24 * 60 * 60 * 1000; // Weekly on Monday at 8 AM
        } else if (parts[0] === '0' && parts[1] === '23') {
            return 24 * 60 * 60 * 1000; // Daily at 11 PM
        }
        
        return 60000; // Default: every minute
    }
}

// Initialize Automation System
document.addEventListener('DOMContentLoaded', () => {
    const automationSystem = new AutomationSystem();
    
    // Make globally available
    window.automationSystem = automationSystem;
    
    // Load previous state
    automationSystem.loadSystemState();
    
    console.log('🤖 Fluffy Bites Automation System ready!');
});

// Export for global access
window.AutomationSystem = AutomationSystem;
window.AutomationScheduler = AutomationScheduler;
