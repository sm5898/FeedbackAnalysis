// Feedback Aggregator Application
class FeedbackApp {
    constructor() {
        this.feedback = [...sampleFeedback];
        this.filteredFeedback = [...this.feedback];
        this.currentView = 'list';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.updateStats();
        this.populateThemeFilter();
        this.renderFeedback();
        this.initCharts();
        this.setupEventListeners();
    }

    // Update dashboard statistics
    updateStats() {
        const totalFeedback = this.filteredFeedback.length;
        const avgSentiment = this.calculateAverageSentiment();
        const urgentItems = this.filteredFeedback.filter(f => 
            f.urgency === 'critical' || f.urgency === 'high'
        ).length;
        const topTheme = this.getTopTheme();

        document.getElementById('total-feedback').textContent = totalFeedback;
        document.getElementById('avg-sentiment').textContent = avgSentiment.toFixed(1);
        document.getElementById('urgent-items').textContent = urgentItems;
        document.getElementById('top-theme').textContent = topTheme || '-';
    }

    calculateAverageSentiment() {
        if (this.filteredFeedback.length === 0) return 0;
        const sum = this.filteredFeedback.reduce((acc, f) => acc + f.sentimentScore, 0);
        return sum / this.filteredFeedback.length;
    }

    getTopTheme() {
        const themeCounts = {};
        this.filteredFeedback.forEach(f => {
            f.themes.forEach(theme => {
                themeCounts[theme] = (themeCounts[theme] || 0) + 1;
            });
        });
        
        return Object.keys(themeCounts).reduce((a, b) => 
            themeCounts[a] > themeCounts[b] ? a : b, ''
        );
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

    // Render feedback items
    renderFeedback() {
        const container = document.getElementById('feedback-container');
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.filteredFeedback.slice(start, end);

        container.innerHTML = '';
        container.className = this.currentView === 'grid' ? 'feedback-grid' : 'feedback-list';

        pageItems.forEach(item => {
            const element = this.createFeedbackElement(item);
            container.appendChild(element);
        });

        // Hide load more if all items are shown
        const loadMoreBtn = document.querySelector('.load-more button');
        if (end >= this.filteredFeedback.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    createFeedbackElement(item) {
        const div = document.createElement('div');
        div.className = 'feedback-item';
        div.onclick = () => this.showFeedbackDetail(item);

        const sourceConfig = sources.find(s => s.name === item.source);
        const sentimentConf = sentimentConfig[item.sentiment];
        const urgencyConf = urgencyConfig[item.urgency];

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

        return div;
    }

    // Show feedback detail modal
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

        document.getElementById('detail-themes').innerHTML = item.themes
            .map(theme => `<span class="badge theme-badge">${theme}</span>`)
            .join('');

        document.getElementById('detail-keywords').innerHTML = item.keywords
            .map(keyword => `<span class="badge" style="background: #f0f0f0; color: #666;">${keyword}</span>`)
            .join('');

        modal.style.display = 'block';
    }

    // Initialize charts
    initCharts() {
        this.createSentimentChart();
        this.createThemeChart();
        this.createSourceChart();
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
                    label: 'Average Sentiment',
                    data: sentimentData.data,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    createThemeChart() {
        const ctx = document.getElementById('theme-chart').getContext('2d');
        const themeData = this.getThemeDistribution();

        this.charts.theme = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: themeData.labels,
                datasets: [{
                    data: themeData.data,
                    backgroundColor: themeData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createSourceChart() {
        const ctx = document.getElementById('source-chart').getContext('2d');
        const sourceData = this.getSourceBreakdown();

        this.charts.source = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sourceData.labels,
                datasets: [{
                    label: 'Feedback Count',
                    data: sourceData.data,
                    backgroundColor: sourceData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
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
                maintainAspectRatio: false
            }
        });
    }

    // Chart data methods
    getSentimentTrends() {
        const last7Days = [];
        const sentimentData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();
            
            const dayFeedback = this.filteredFeedback.filter(f => {
                const fDate = new Date(f.createdAt);
                return fDate.toDateString() === date.toDateString();
            });
            
            last7Days.push(dateStr);
            const avgSentiment = dayFeedback.length > 0 
                ? dayFeedback.reduce((acc, f) => acc + f.sentimentScore, 0) / dayFeedback.length
                : 0;
            sentimentData.push(avgSentiment);
        }

        return { labels: last7Days, data: sentimentData };
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
            .slice(0, 5);

        return {
            labels: sortedThemes.map(([theme]) => theme),
            data: sortedThemes.map(([, count]) => count),
            colors: sortedThemes.map(([theme]) => {
                const themeConfig = themes.find(t => t.name === theme);
                return themeConfig ? themeConfig.color : '#4f46e5';
            })
        };
    }

    getSourceBreakdown() {
        const sourceCounts = {};
        this.filteredFeedback.forEach(f => {
            sourceCounts[f.source] = (sourceCounts[f.source] || 0) + 1;
        });

        return {
            labels: Object.keys(sourceCounts),
            data: Object.values(sourceCounts),
            colors: Object.keys(sourceCounts).map(source => {
                const sourceConfig = sources.find(s => s.name === source);
                return sourceConfig ? sourceConfig.color : '#4f46e5';
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

    // Filter and search functionality
    applyFilters() {
        const sourceFilter = document.getElementById('source-filter').value;
        const sentimentFilter = document.getElementById('sentiment-filter').value;
        const urgencyFilter = document.getElementById('urgency-filter').value;
        const themeFilter = document.getElementById('theme-filter').value;

        this.filteredFeedback = this.feedback.filter(item => {
            return (!sourceFilter || item.source === sourceFilter) &&
                   (!sentimentFilter || item.sentiment === sentimentFilter) &&
                   (!urgencyFilter || item.urgency === urgencyFilter) &&
                   (!themeFilter || item.themes.includes(themeFilter));
        });

        this.currentPage = 1;
        this.updateStats();
        this.renderFeedback();
        this.updateCharts();
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

    updateCharts() {
        // Update all charts with new filtered data
        this.charts.sentiment.destroy();
        this.charts.theme.destroy();
        this.charts.source.destroy();
        this.charts.urgency.destroy();
        
        this.initCharts();
    }

    // View toggle
    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.toggle-btn').classList.add('active');
        this.renderFeedback();
    }

    // Load more feedback
    loadMoreFeedback() {
        this.currentPage++;
        this.renderFeedback();
    }

    // Export functionality
    exportData() {
        const format = 'csv'; // Default to CSV for simplicity
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
        a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Refresh data
    refreshData() {
        // Simulate data refresh with animation
        const container = document.getElementById('feedback-container');
        container.innerHTML = '<div class="loading">Loading fresh data...</div>';
        
        setTimeout(() => {
            this.filteredFeedback = [...this.feedback];
            this.currentPage = 1;
            this.updateStats();
            this.renderFeedback();
            this.updateCharts();
        }, 1000);
    }

    // Utility functions
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
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
        });
    }
}

// Global functions for HTML onclick handlers
function closeModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

function setView(view) {
    app.setView(view);
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FeedbackApp();
});
