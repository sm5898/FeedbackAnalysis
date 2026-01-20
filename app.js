// Advanced Feedback Intelligence Platform
class FeedbackIntelligenceApp {
    constructor() {
        this.feedback = [];
        this.filteredFeedback = [];
        this.currentView = 'list';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.charts = {};
        this.aiInsights = aiInsights;
        this.chartPeriod = '7d';
        
        this.init();
    }

    async init() {
        // Load feedback from Cloudflare Worker
        await this.loadFeedbackFromWorker();
        
        this.updateStats();
        this.populateThemeFilter();
        this.renderFeedback();
        this.initCharts();
        this.loadAIInsights();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    async loadFeedbackFromWorker() {
        try {
            const response = await fetch('/feedback');
            if (response.ok) {
                const data = await response.json();
                this.feedback = data;
                this.filteredFeedback = [...this.feedback];
            } else {
                // Fallback to static data if Worker is unavailable
                this.feedback = [...sampleFeedback];
                this.filteredFeedback = [...this.feedback];
            }
        } catch (error) {
            console.log('Error loading feedback from Worker:', error);
            // Fallback to static data
            this.feedback = [...sampleFeedback];
            this.filteredFeedback = [...this.feedback];
        }
    }

    // Update dashboard statistics with animations
    updateStats() {
        const totalFeedback = this.filteredFeedback.length;
        const avgSentiment = this.calculateAverageSentiment();
        const urgentItems = this.filteredFeedback.filter(f => 
            f.urgency === 'critical' || f.urgency === 'high'
        ).length;
        const activeSources = [...new Set(this.filteredFeedback.map(f => f.source))].length;

        this.animateNumber('total-feedback', totalFeedback);
        this.animateNumber('avg-sentiment', avgSentiment.toFixed(1));
        this.animateNumber('urgent-items', urgentItems);
        this.animateNumber('active-sources', activeSources);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const startValue = parseFloat(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = startValue + (targetValue - startValue) * this.easeOutQuart(progress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    calculateAverageSentiment() {
        if (this.filteredFeedback.length === 0) return 0;
        const sum = this.filteredFeedback.reduce((acc, f) => acc + f.sentimentScore, 0);
        return sum / this.filteredFeedback.length;
    }

    // Load AI insights with typing animation
    loadAIInsights() {
        const summaryElement = document.getElementById('ai-summary');
        
        // Clear any existing content and loading state
        summaryElement.innerHTML = '<div class="loading-skeleton"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';
        
        // Start typewriter effect after a short delay
        setTimeout(() => {
            this.typewriterEffect('ai-summary', this.aiInsights.summary, 30);
        }, 500);
        
        // Load other insights after summary starts
        setTimeout(() => {
            this.renderKeyInsights();
            this.renderRecommendations();
            this.updateTrendAnalysis();
        }, 2000);
    }

    typewriterEffect(elementId, text, speed) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    renderKeyInsights() {
        const container = document.getElementById('key-insights');
        container.innerHTML = '';

        this.aiInsights.keyInsights.forEach((insight, index) => {
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item';
            insightElement.style.animationDelay = `${index * 0.1}s`;
            insightElement.innerHTML = `
                <i class="fas fa-lightbulb"></i>
                <span>${insight}</span>
            `;
            container.appendChild(insightElement);
        });
    }

    renderRecommendations() {
        const container = document.getElementById('recommendations');
        container.innerHTML = '';

        this.aiInsights.recommendations.forEach((rec, index) => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.style.animationDelay = `${index * 0.1}s`;
            
            const priorityColor = {
                'Critical': '#eb3b5a',
                'High': '#fa8231',
                'Medium': '#f7b731',
                'Low': '#26de81'
            };

            recElement.innerHTML = `
                <div class="rec-header">
                    <span class="rec-priority" style="background: ${priorityColor[rec.priority]}">${rec.priority}</span>
                    <span class="rec-effort">Effort: ${rec.effort}</span>
                </div>
                <div class="rec-action">${rec.action}</div>
                <div class="rec-impact">Impact: ${rec.impact}</div>
            `;
            container.appendChild(recElement);
        });
    }

    updateTrendAnalysis() {
        const container = document.getElementById('trend-analysis');
        const trends = this.aiInsights.trends;
        
        container.innerHTML = `
            <div class="trend-card">
                <div class="trend-icon ${trends.sentiment.direction}">
                    <i class="fas fa-arrow-${trends.sentiment.direction === 'improving' ? 'up' : 'down'}"></i>
                </div>
                <div class="trend-info">
                    <span class="trend-value">${trends.sentiment.change}</span>
                    <span class="trend-label">Sentiment Trend</span>
                </div>
            </div>
            <div class="trend-card">
                <div class="trend-icon ${trends.urgency.direction}">
                    <i class="fas fa-${trends.urgency.direction === 'stable' ? 'minus' : 'exclamation'}"></i>
                </div>
                <div class="trend-info">
                    <span class="trend-value">${trends.urgency.change}</span>
                    <span class="trend-label">Urgency Level</span>
                </div>
            </div>
        `;
    }

    // Populate theme filter dropdown
    populateThemeFilter() {
        const themeFilter = document.getElementById('theme-filter');
        const allThemes = [...new Set(this.feedback.flatMap(f => f.themes))];
        
        allThemes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme;
            option.textContent = theme;
            themeFilter.appendChild(option);
        });
    }

    // Render feedback items with advanced layouts
    renderFeedback() {
        const container = document.getElementById('feedback-container');
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.filteredFeedback.slice(start, end);

        container.innerHTML = '';
        container.className = `feedback-${this.currentView}`;

        pageItems.forEach((item, index) => {
            const element = this.createFeedbackElement(item, index);
            container.appendChild(element);
        });

        this.updateLoadMoreButton();
    }

    createFeedbackElement(item, index) {
        const div = document.createElement('div');
        div.className = 'feedback-item';
        div.style.animationDelay = `${index * 0.05}s`;
        div.onclick = () => this.showFeedbackDetail(item);

        const sourceConfig = sources.find(s => s.name === item.source);
        const sentimentConf = sentimentConfig[item.sentiment];
        const urgencyConf = urgencyConfig[item.urgency];

        if (this.currentView === 'list') {
            div.innerHTML = `
                <div class="feedback-header">
                    <div>
                        <div class="feedback-title">${this.escapeHtml(item.title)}</div>
                        <div class="feedback-meta">
                            <span><i class="fas fa-user"></i> ${this.escapeHtml(item.author)}</span>
                            <span><i class="fas fa-clock"></i> ${this.formatDate(item.createdAt)}</span>
                            <span><i class="${sourceConfig.icon}" style="color: ${sourceConfig.color}"></i> ${item.source}</span>
                        </div>
                    </div>
                    <div class="feedback-badges">
                        <span class="badge sentiment-badge ${item.sentiment}">${sentimentConf.label}</span>
                        <span class="badge urgency-badge ${item.urgency}">${urgencyConf.label}</span>
                    </div>
                </div>
                <div class="feedback-content">${this.escapeHtml(item.content)}</div>
                <div class="feedback-footer">
                    <div class="feedback-themes">
                        ${item.themes.map(theme => `<span class="badge theme-badge">${theme}</span>`).join('')}
                    </div>
                    <div class="feedback-keywords">
                        ${item.keywords.slice(0, 3).map(keyword => `<small>${keyword}</small>`).join(' • ')}
                    </div>
                </div>
            `;
        } else if (this.currentView === 'cards') {
            div.innerHTML = `
                <div class="card-header">
                    <div class="card-source ${item.source}">
                        <i class="${sourceConfig.icon}"></i>
                        <span>${item.source}</span>
                    </div>
                    <div class="card-badges">
                        <span class="badge sentiment-badge ${item.sentiment}">${sentimentConf.label}</span>
                        <span class="badge urgency-badge ${item.urgency}">${urgencyConf.label}</span>
                    </div>
                </div>
                <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                <p class="card-content">${this.escapeHtml(item.content.substring(0, 150))}${item.content.length > 150 ? '...' : ''}</p>
                <div class="card-footer">
                    <span><i class="fas fa-user"></i> ${this.escapeHtml(item.author)}</span>
                    <span><i class="fas fa-clock"></i> ${this.formatDate(item.createdAt)}</span>
                </div>
            `;
        } else if (this.currentView === 'compact') {
            div.innerHTML = `
                <div class="compact-row">
                    <span class="compact-title">${this.escapeHtml(item.title)}</span>
                    <span class="compact-source ${item.source}">${item.source}</span>
                    <span class="compact-sentiment ${item.sentiment}">${sentimentConf.label}</span>
                    <span class="compact-urgency ${item.urgency}">${urgencyConf.label}</span>
                    <span class="compact-date">${this.formatDate(item.createdAt)}</span>
                </div>
            `;
        }

        return div;
    }

    // Show detailed feedback modal with AI analysis
    showFeedbackDetail(item) {
        const modal = document.getElementById('feedback-modal');
        const sourceConfig = sources.find(s => s.name === item.source);
        const sentimentConf = sentimentConfig[item.sentiment];
        const urgencyConf = urgencyConfig[item.urgency];

        document.getElementById('modal-source').innerHTML = `
            <i class="${sourceConfig.icon}"></i> ${item.source}
        `;
        document.getElementById('modal-source').className = `badge source-badge`;

        document.getElementById('modal-sentiment').innerHTML = `
            <i class="${sentimentConf.icon}"></i> ${sentimentConf.label}
        `;
        document.getElementById('modal-sentiment').className = `badge sentiment-badge ${item.sentiment}`;

        document.getElementById('modal-urgency').innerHTML = `
            <i class="${urgencyConf.icon}"></i> ${urgencyConf.label}
        `;
        document.getElementById('modal-urgency').className = `badge urgency-badge ${item.urgency}`;

        document.getElementById('modal-title').textContent = 'Feedback Analysis';
        document.getElementById('detail-title').textContent = item.title;
        document.getElementById('detail-content').textContent = item.content;
        document.getElementById('detail-author').innerHTML = `<i class="fas fa-user"></i> ${item.author}`;
        document.getElementById('detail-date').innerHTML = `<i class="fas fa-clock"></i> ${this.formatDate(item.createdAt)}`;
        
        const linkElement = document.getElementById('detail-link');
        if (item.url) {
            linkElement.href = item.url;
            linkElement.style.display = 'inline-flex';
        } else {
            linkElement.style.display = 'none';
        }

        // AI Analysis
        const aiAnalysis = this.generateAIAnalysis(item);
        document.getElementById('ai-analysis').innerHTML = aiAnalysis;

        document.getElementById('detail-themes').innerHTML = item.themes
            .map(theme => `<span class="badge theme-badge">${theme}</span>`)
            .join('');

        document.getElementById('detail-keywords').innerHTML = item.keywords
            .map(keyword => `<span class="badge" style="background: #f0f0f0; color: #666;">${keyword}</span>`)
            .join('');

        modal.style.display = 'block';
    }

    generateAIAnalysis(item) {
        const analyses = [
            `Sentiment analysis indicates ${item.sentiment} emotional tone with ${Math.abs(item.sentimentScore * 100).toFixed(0)}% confidence.`,
            `Urgency assessment: ${item.urgency} priority - ${item.urgencyScore > 0.7 ? 'requires immediate attention' : 'can be addressed in standard sprint'}.`,
            `Key themes identified: ${item.themes.join(', ')}.`,
            `Stakeholder impact: ${item.urgency === 'critical' ? 'High - affects multiple teams/departments' : item.urgency === 'high' ? 'Medium - impacts specific workflows' : 'Low - localized issue'}.`,
            `Recommended action: ${this.getRecommendedAction(item)}.`
        ];

        return analyses.join(' ');
    }

    getRecommendedAction(item) {
        if (item.urgency === 'critical') {
            return 'Immediate escalation to senior leadership and emergency response team';
        } else if (item.urgency === 'high') {
            return 'Prioritize in current sprint and assign to senior developer';
        } else if (item.themes.includes('Bugs')) {
            return 'Add to bug backlog and schedule for next release';
        } else if (item.themes.includes('Features')) {
            return 'Evaluate for product roadmap inclusion';
        } else {
            return 'Standard triage and assignment to appropriate team';
        }
    }

    // Initialize advanced charts
    initCharts() {
        this.createSentimentChart();
        this.createSourceChart();
        this.createThemeChart();
        this.createUrgencyChart();
    }

    createSentimentChart() {
        const ctx = document.getElementById('sentiment-chart').getContext('2d');
        const sentimentData = this.getSentimentTrends();

        this.charts.sentiment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sentimentData.labels,
                datasets: [{
                    label: 'Sentiment Score',
                    data: sentimentData.data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: -1,
                        max: 1
                    }
                }
            }
        });
    }

    createSourceChart() {
        const ctx = document.getElementById('source-chart').getContext('2d');
        const sourceData = this.getSourceDistribution();

        this.charts.source = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sourceData.labels,
                datasets: [{
                    data: sourceData.data,
                    backgroundColor: sourceData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    createThemeChart() {
        const ctx = document.getElementById('theme-chart').getContext('2d');
        const themeData = this.getThemeDistribution();

        this.charts.theme = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: themeData.labels,
                datasets: [{
                    label: 'Feedback Count',
                    data: themeData.data,
                    backgroundColor: themeData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    createUrgencyChart() {
        const ctx = document.getElementById('urgency-chart').getContext('2d');
        const urgencyData = this.getUrgencyDistribution();

        this.charts.urgency = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: urgencyData.labels,
                datasets: [{
                    data: urgencyData.data,
                    backgroundColor: urgencyData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Chart data methods
    getSentimentTrends() {
        const periods = {
            '7d': 7,
            '30d': 30,
            '90d': 90
        };
        
        const days = periods[this.chartPeriod] || 7;
        const labels = [];
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();
            
            const dayFeedback = this.filteredFeedback.filter(f => {
                const fDate = new Date(f.createdAt);
                return fDate.toDateString() === date.toDateString();
            });
            
            labels.push(dateStr);
            const avgSentiment = dayFeedback.length > 0 
                ? dayFeedback.reduce((acc, f) => acc + f.sentimentScore, 0) / dayFeedback.length
                : 0;
            data.push(avgSentiment);
        }

        return { labels, data };
    }

    getThemeDistribution() {
        const themeCounts = {};
        this.filteredFeedback.forEach(f => {
            f.themes.forEach(theme => {
                themeCounts[theme] = (themeCounts[theme] || 0) + 1;
            });
        });

        const sortedThemes = Object.entries(themeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        return {
            labels: sortedThemes.map(([theme]) => theme),
            data: sortedThemes.map(([, count]) => count),
            colors: sortedThemes.map(([theme]) => {
                const themeConfig = themes.find(t => t.name === theme);
                return themeConfig ? themeConfig.color : '#6366f1';
            })
        };
    }

    getSourceDistribution() {
        const sourceCounts = {};
        this.filteredFeedback.forEach(f => {
            sourceCounts[f.source] = (sourceCounts[f.source] || 0) + 1;
        });

        return {
            labels: Object.keys(sourceCounts),
            data: Object.values(sourceCounts),
            colors: Object.keys(sourceCounts).map(source => {
                const sourceConfig = sources.find(s => s.name === source);
                return sourceConfig ? sourceConfig.color : '#6366f1';
            })
        };
    }

    getUrgencyDistribution() {
        const urgencyCounts = { critical: 0, high: 0, medium: 0, low: 0 };
        this.filteredFeedback.forEach(f => {
            urgencyCounts[f.urgency]++;
        });

        return {
            labels: Object.keys(urgencyCounts),
            data: Object.values(urgencyCounts),
            colors: Object.keys(urgencyCounts).map(level => urgencyConfig[level].color)
        };
    }

    // Advanced filtering and AI search
    applyFilters() {
        const sourceFilter = document.getElementById('source-filter').value;
        const sentimentFilter = document.getElementById('sentiment-filter').value;
        const urgencyFilter = document.getElementById('urgency-filter').value;
        const themeFilter = document.getElementById('theme-filter').value;
        const authorFilter = document.getElementById('author-filter')?.value.toLowerCase();
        const dateFrom = document.getElementById('date-from')?.value;
        const dateTo = document.getElementById('date-to')?.value;

        this.filteredFeedback = this.feedback.filter(item => {
            return (!sourceFilter || item.source === sourceFilter) &&
                   (!sentimentFilter || item.sentiment === sentimentFilter) &&
                   (!urgencyFilter || item.urgency === urgencyFilter) &&
                   (!themeFilter || item.themes.includes(themeFilter)) &&
                   (!authorFilter || item.author.toLowerCase().includes(authorFilter)) &&
                   (!dateFrom || new Date(item.createdAt) >= new Date(dateFrom)) &&
                   (!dateTo || new Date(item.createdAt) <= new Date(dateTo));
        });

        this.currentPage = 1;
        this.updateStats();
        this.renderFeedback();
        this.updateCharts();
    }

    async refreshData() {
        // Show loading state
        this.showNotification('Refreshing data...', 'info');
        
        try {
            // Reload feedback from Worker
            await this.loadFeedbackFromWorker();
            
            // Update all components
            this.updateStats();
            this.renderFeedback();
            this.updateCharts();
            this.loadAIInsights();
            
            this.showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showNotification('Failed to refresh data', 'error');
        }
    }

    searchFeedback() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        
        if (searchTerm === '') {
            this.applyFilters();
            return;
        }

        this.filteredFeedback = this.feedback.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.content.toLowerCase().includes(searchTerm) ||
                   item.author.toLowerCase().includes(searchTerm) ||
                   item.themes.some(theme => theme.toLowerCase().includes(searchTerm)) ||
                   item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
        });

        this.currentPage = 1;
        this.updateStats();
        this.renderFeedback();
        this.updateCharts();
    }

    performAISearch() {
        const searchTerm = document.getElementById('search-input').value;
        if (!searchTerm) return;

        // Simulate AI-powered search with semantic understanding
        const aiResults = this.feedback.filter(item => {
            const semanticScore = this.calculateSemanticRelevance(item, searchTerm);
            return semanticScore > 0.5;
        });

        this.filteredFeedback = aiResults;
        this.currentPage = 1;
        this.updateStats();
        this.renderFeedback();
        
        // Show AI search notification
        this.showNotification(`AI found ${aiResults.length} semantically relevant results`, 'success');
    }

    calculateSemanticRelevance(item, searchTerm) {
        // Simple semantic relevance simulation
        const terms = searchTerm.toLowerCase().split(' ');
        let relevanceScore = 0;

        terms.forEach(term => {
            if (item.title.toLowerCase().includes(term)) relevanceScore += 0.3;
            if (item.content.toLowerCase().includes(term)) relevanceScore += 0.2;
            if (item.themes.some(theme => theme.toLowerCase().includes(term))) relevanceScore += 0.4;
            if (item.keywords.some(keyword => keyword.toLowerCase().includes(term))) relevanceScore += 0.3;
        });

        return Math.min(relevanceScore / terms.length, 1);
    }

    // View controls
    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.view-btn').classList.add('active');
        this.renderFeedback();
    }

    setChartPeriod(period) {
        this.chartPeriod = period;
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.updateCharts();
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.initCharts();
    }

    // Export functionality
    exportData() {
        const format = 'csv'; // Default to CSV
        const dataToExport = this.filteredFeedback;

        if (format === 'csv') {
            this.exportToCSV(dataToExport);
        }
    }

    exportToCSV(data) {
        const headers = [
            'ID', 'Source', 'Title', 'Content', 'Author', 'Created At',
            'Sentiment', 'Sentiment Score', 'Urgency', 'Urgency Score',
            'Themes', 'Keywords', 'URL'
        ];

        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.id,
                item.source,
                `"${this.escapeCsv(item.title)}"`,
                `"${this.escapeCsv(item.content)}"`,
                `"${item.author}"`,
                item.createdAt,
                item.sentiment,
                item.sentimentScore,
                item.urgency,
                item.urgencyScore,
                `"${item.themes.join('; ')}"`,
                `"${item.keywords.join('; ')}"`,
                item.url || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback-intelligence-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    // Refresh data with animation
    refreshData() {
        const container = document.getElementById('feedback-container');
        container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';
        
        setTimeout(() => {
            this.filteredFeedback = [...this.feedback];
            this.currentPage = 1;
            this.updateStats();
            this.renderFeedback();
            this.updateCharts();
            this.loadAIInsights();
            this.showNotification('Data refreshed with latest insights!', 'success');
        }, 1500);
    }

    // Generate new AI insights
    generateAIInsights() {
        this.showNotification('Generating AI insights...', 'info');
        
        setTimeout(() => {
            this.loadAIInsights();
            this.showNotification('AI insights updated successfully!', 'success');
        }, 2000);
    }

    // Utility functions
    updateLoadMoreButton() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const hasMore = end < this.filteredFeedback.length;
        
        const loadMoreBtn = document.querySelector('.load-more button');
        if (hasMore) {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Load More (${this.filteredFeedback.length - end} remaining)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    loadMoreFeedback() {
        this.currentPage++;
        this.renderFeedback();
    }

    toggleAdvancedFilters() {
        const advancedFilters = document.getElementById('advanced-filters');
        const isVisible = advancedFilters.style.display !== 'none';
        advancedFilters.style.display = isVisible ? 'none' : 'block';
        event.target.textContent = isVisible ? 'Advanced' : 'Basic';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeCsv(text) {
        return text.replace(/"/g, '""');
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            const randomUpdate = Math.random() > 0.8;
            if (randomUpdate) {
                this.showNotification('New feedback received!', 'info');
                // In real app, this would fetch new data
            }
        }, 30000); // Check every 30 seconds
    }

    setupEventListeners() {
        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('feedback-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('feedback-modal').style.display = 'none';
            }
            if (e.key === '/' && e.ctrlKey) {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.refreshData();
            }
        });
    }

    // AI Chat functionality
    async handleChatInput(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            await this.sendAIMessage();
        }
    }

    async sendAIMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addChatMessage(message, 'user');
        
        // Generate AI response
        const aiResponse = await this.generateAIResponse(message);
        
        // Add AI response to chat
        setTimeout(() => {
            this.addChatMessage(aiResponse, 'ai');
        }, 1000);
        
        // Clear input
        input.value = '';
    }

    async generateAIResponse(userMessage) {
        const responses = {
            'themes': `Based on current feedback data, top themes are: ${this.aiInsights.trends.themes.top.join(', ')}. These themes represent ${this.aiInsights.trends.themes.top.length * 100}% of critical issues.`,
            
            'sentiment': `Current sentiment trend is ${this.aiInsights.trends.sentiment.direction} with a ${this.aiInsights.trends.sentiment.change} change. The average sentiment score is ${this.aiInsights.trends.sentiment.current}.`,
            
            'urgency': `Urgency levels are ${this.aiInsights.trends.urgency.direction}. Critical issues require immediate attention, while high-priority items should be addressed in current sprint.`,
            
            'recommendations': `I recommend prioritizing the ${this.aiInsights.recommendations[0].priority} issues first: ${this.aiInsights.recommendations[0].action}`,
            
            'sources': `Feedback is distributed across ${Object.keys(this.getSourceDistribution()).length} sources, with ${this.getTopSource()} being most active.`,
            
            'default': `I can analyze specific feedback items, themes, or provide detailed insights. What specific aspect would you like to explore?`
        };

        // Try to get real-time analysis from Worker
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback: { content: userMessage } })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return `AI Analysis: ${data.analysis.sentiment} sentiment detected. Key themes: ${data.analysis.themes.join(', ')}. Recommendations: ${data.analysis.recommendations.join(', ')}`;
                }
            }
        } catch (error) {
            console.log('Error getting AI analysis:', error);
        }

        // Fallback to keyword matching
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    getTopSource() {
        const sourceCounts = {};
        this.feedback.forEach(f => {
            sourceCounts[f.source] = (sourceCounts[f.source] || 0) + 1;
        });
        
        return Object.keys(sourceCounts).reduce((a, b) => 
            sourceCounts[a] > sourceCounts[b] ? a : b
        );
    }
}

// Global functions for HTML onclick handlers
function closeModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

function setView(view) {
    app.setView(view);
}

function setChartPeriod(period) {
    app.setChartPeriod(period);
}

function loadMoreFeedback() {
    app.loadMoreFeedback();
}

function exportData() {
    app.exportData();
}

function refreshData() {
    app.refreshData();
}

function applyFilters() {
    app.applyFilters();
}

function searchFeedback() {
    app.searchFeedback();
}

function performAISearch() {
    app.performAISearch();
}

function generateAIInsights() {
    app.generateAIInsights();
}

function toggleAdvancedFilters() {
    app.toggleAdvancedFilters();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .card-source {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
    }
    
    .card-source.github { background: #333; }
    .card-source.discord { background: #7289da; }
    .card-source.reddit { background: #ff4500; }
    .card-source.twitter { background: #1da1f2; }
    .card-source.email { background: #ea4335; }
    .card-source.support { background: #ff6b6b; }
    .card-source.forums { background: #4a5568; }
    
    .card-badges {
        display: flex;
        gap: 0.5rem;
    }
    
    .card-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
        line-height: 1.4;
    }
    
    .card-content {
        color: var(--text-primary);
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    
    .feedback-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }
    
    .feedback-cards .feedback-item {
        background: var(--card-bg);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .feedback-compact {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .compact-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--light-bg);
        border-radius: 8px;
        align-items: center;
        font-size: 0.875rem;
        transition: all 0.3s ease;
    }
    
    .compact-row:hover {
        background: var(--card-bg);
        transform: translateX(5px);
    }
    
    .compact-title {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .compact-source {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        text-align: center;
    }
    
    .compact-sentiment, .compact-urgency {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        text-align: center;
    }
    
    .compact-date {
        color: var(--text-secondary);
        font-size: 0.75rem;
    }
    
    .rec-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .rec-priority {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        color: white;
    }
    
    .rec-effort {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .rec-action {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .rec-impact {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FeedbackIntelligenceApp();
});
