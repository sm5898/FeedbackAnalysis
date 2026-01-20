// Comprehensive static data for advanced feedback aggregator
const sampleFeedback = [
    // GitHub Issues
    {
        id: 1,
        source: 'github',
        sourceId: 'gh-001',
        title: 'Critical memory leak in data processing module',
        content: 'We\'ve identified a critical memory leak in the data processing module that occurs when handling large datasets (>50k records). Memory usage grows linearly until the application crashes. This is blocking our production deployment. Memory profiler shows objects not being properly garbage collected after processing completion.',
        author: 'DevOps Team',
        authorEmail: 'devops@techcorp.com',
        url: 'https://github.com/company/repo/issues/456',
        createdAt: '2024-01-20T14:30:00Z',
        sentiment: 'negative',
        sentimentScore: -0.8,
        urgency: 'critical',
        urgencyScore: 0.95,
        themes: ['Bugs', 'Performance'],
        keywords: ['memory leak', 'data processing', 'crash', 'production', 'garbage collection'],
        summary: 'Critical memory leak causing production deployment blocks.'
    },
    {
        id: 2,
        source: 'github',
        sourceId: 'gh-002',
        title: 'Feature request: Advanced AI-powered sentiment analysis',
        content: 'Current sentiment analysis is good but could be enhanced with contextual understanding. Requesting integration of transformer-based models for better nuance detection, sarcasm identification, and emotion classification. This would significantly improve feedback quality assessment.',
        author: 'AI Research Team',
        authorEmail: 'ai-research@company.com',
        url: 'https://github.com/company/repo/issues/457',
        createdAt: '2024-01-20T10:15:00Z',
        sentiment: 'positive',
        sentimentScore: 0.6,
        urgency: 'medium',
        urgencyScore: 0.5,
        themes: ['Features', 'AI/ML'],
        keywords: ['sentiment analysis', 'transformer models', 'contextual understanding', 'sarcasm detection'],
        summary: 'Request for advanced AI-powered sentiment analysis with contextual understanding.'
    },
    {
        id: 3,
        source: 'github',
        sourceId: 'gh-003',
        title: 'Performance regression in v2.4.0 release',
        content: 'After upgrading to v2.4.0, we\'ve observed a 40% performance degradation in query processing times. Regression analysis points to the new indexing system. Rolling back to v2.3.0 resolves the issue. This is impacting all our customers.',
        author: 'Performance Engineer',
        authorEmail: 'perf-eng@company.com',
        url: 'https://github.com/company/repo/issues/458',
        createdAt: '2024-01-19T16:45:00Z',
        sentiment: 'negative',
        sentimentScore: -0.7,
        urgency: 'high',
        urgencyScore: 0.8,
        themes: ['Bugs', 'Performance'],
        keywords: ['performance regression', 'query processing', 'indexing system', 'version 2.4.0'],
        summary: 'Performance regression in v2.4.0 affecting all customers.'
    },

    // Discord Feedback
    {
        id: 4,
        source: 'discord',
        sourceId: 'disc-001',
        title: 'Community loves the new real-time collaboration features!',
        content: 'The new real-time collaboration features are absolutely game-changing! Our team productivity has increased by 60% since rollout. The ability to see teammates working on feedback simultaneously is incredible. Thank you for listening to community feedback! 🎉',
        author: 'Community Manager',
        authorEmail: 'community@discord-server.com',
        url: 'https://discord.com/channels/feedback/123456',
        createdAt: '2024-01-20T09:20:00Z',
        sentiment: 'positive',
        sentimentScore: 0.9,
        urgency: 'low',
        urgencyScore: 0.1,
        themes: ['Praise', 'Features'],
        keywords: ['real-time collaboration', 'productivity', 'teamwork', 'community feedback'],
        summary: 'Excellent community feedback on real-time collaboration features.'
    },
    {
        id: 5,
        source: 'discord',
        sourceId: 'disc-002',
        title: 'Mobile app crashes on iOS 17.2',
        content: 'Multiple users reporting that the mobile app crashes immediately upon launch on iOS 17.2. Issue appears to be related to the new notification system. Android users are unaffected. This is blocking our mobile user base completely.',
        author: 'Mobile Team Lead',
        authorEmail: 'mobile-lead@company.com',
        url: 'https://discord.com/channels/mobile-support/789012',
        createdAt: '2024-01-19T13:10:00Z',
        sentiment: 'negative',
        sentimentScore: -0.9,
        urgency: 'critical',
        urgencyScore: 0.9,
        themes: ['Bugs', 'Mobile'],
        keywords: ['mobile app', 'iOS 17.2', 'crashes', 'notification system'],
        summary: 'Critical mobile app crashes on iOS 17.2 blocking all mobile users.'
    },
    {
        id: 6,
        source: 'discord',
        sourceId: 'disc-003',
        title: 'Request for dark mode in mobile app',
        content: 'Many users in our community are requesting dark mode for the mobile app. The bright white interface is causing eye strain during night usage. This is one of the most requested features in our feedback channels.',
        author: 'UX Designer',
        authorEmail: 'ux@community.com',
        url: 'https://discord.com/channels/feature-requests/345678',
        createdAt: '2024-01-18T11:30:00Z',
        sentiment: 'neutral',
        sentimentScore: 0.2,
        urgency: 'medium',
        urgencyScore: 0.4,
        themes: ['UI/UX', 'Features'],
        keywords: ['dark mode', 'mobile app', 'eye strain', 'night usage'],
        summary: 'Community request for dark mode in mobile application.'
    },

    // Reddit Discussions
    {
        id: 7,
        source: 'reddit',
        sourceId: 'red-001',
        title: 'Unpopular opinion: The pricing model is actually fair',
        content: 'I know this might be unpopular, but after comparing with competitors, the pricing model is actually quite reasonable. The value proposition is strong and the tiered approach makes sense for different user segments. More companies should be this transparent.',
        author: 'ValueConscious88',
        authorEmail: 'user@reddit.com',
        url: 'https://reddit.com/r/productreviews/comments/abc123',
        createdAt: '2024-01-20T15:45:00Z',
        sentiment: 'positive',
        sentimentScore: 0.7,
        urgency: 'low',
        urgencyScore: 0.2,
        themes: ['Pricing', 'Praise'],
        keywords: ['pricing model', 'fair pricing', 'value proposition', 'transparent'],
        summary: 'Reddit user defends pricing model as fair and reasonable.'
    },
    {
        id: 8,
        source: 'reddit',
        sourceId: 'red-002',
        title: 'Security concerns about data sharing practices',
        content: 'Can we get clarification on data sharing practices? The privacy policy is vague about third-party data sharing. As enterprise users, we need explicit guarantees about data isolation and compliance with SOC2 requirements.',
        author: 'EnterpriseSecurity',
        authorEmail: 'security@reddit.com',
        url: 'https://reddit.com/r/techprivacy/comments/def456',
        createdAt: '2024-01-19T08:30:00Z',
        sentiment: 'negative',
        sentimentScore: -0.6,
        urgency: 'high',
        urgencyScore: 0.8,
        themes: ['Security', 'Compliance'],
        keywords: ['data sharing', 'privacy policy', 'third-party', 'SOC2 compliance'],
        summary: 'Security concerns about vague data sharing practices and compliance.'
    },
    {
        id: 9,
        source: 'reddit',
        sourceId: 'red-003',
        title: 'The AI summarization feature is mind-blowing',
        content: 'Holy cow, the new AI summarization feature is incredible! It can distill hours of feedback into actionable insights in seconds. This has revolutionized how our team approaches product planning. The accuracy is surprisingly high.',
        author: 'ProductManager23',
        authorEmail: 'pm@reddit.com',
        url: 'https://reddit.com/r/ProductHunt/comments/ghi789',
        createdAt: '2024-01-18T20:15:00Z',
        sentiment: 'positive',
        sentimentScore: 0.95,
        urgency: 'low',
        urgencyScore: 0.1,
        themes: ['Praise', 'AI/ML'],
        keywords: ['AI summarization', 'actionable insights', 'product planning', 'accuracy'],
        summary: 'Reddit user amazed by AI summarization feature accuracy and speed.'
    },

    // Twitter/X Feedback
    {
        id: 10,
        source: 'twitter',
        sourceId: 'tw-001',
        title: 'Just shipped our integration with your API! 🚀',
        content: 'Amazing experience working with your API! Documentation is crystal clear, SDKs are well-designed, and the support team is incredibly responsive. Our integration went from concept to production in just 3 days. Kudos to the team! @YourCompany',
        author: 'StartupFounder',
        authorEmail: 'founder@startup.io',
        url: 'https://twitter.com/startupfounder/status/123456789',
        createdAt: '2024-01-20T12:00:00Z',
        sentiment: 'positive',
        sentimentScore: 0.9,
        urgency: 'low',
        urgencyScore: 0.1,
        themes: ['Praise', 'Integration'],
        keywords: ['API integration', 'documentation', 'SDKs', 'responsive support'],
        summary: 'Twitter praise for excellent API documentation and support.'
    },
    {
        id: 11,
        source: 'twitter',
        sourceId: 'tw-002',
        title: 'Customer support response time is unacceptable',
        content: 'Waiting 48+ hours for critical support tickets is not acceptable for enterprise pricing. Your SLA promises 24-hour response but we\'re consistently missing it. This is impacting our business operations significantly.',
        author: 'EnterpriseCustomer',
        authorEmail: 'customer@enterprise.com',
        url: 'https://twitter.com/enterprisecust/status/123456790',
        createdAt: '2024-01-19T14:20:00Z',
        sentiment: 'negative',
        sentimentScore: -0.8,
        urgency: 'critical',
        urgencyScore: 0.9,
        themes: ['Support', 'Pricing'],
        keywords: ['support response time', 'SLA', 'enterprise pricing', 'business impact'],
        summary: 'Critical complaint about missing SLA commitments for enterprise support.'
    },
    {
        id: 12,
        source: 'twitter',
        sourceId: 'tw-003',
        title: 'The new export features are exactly what we needed!',
        content: 'CSV, JSON, and PDF exports with customizable templates? This is exactly what our reporting team has been requesting! The scheduled export feature is a game-changer for our monthly board reports. Thank you for listening! 🙏',
        author: 'DataAnalyst',
        authorEmail: 'analyst@company.com',
        url: 'https://twitter.com/dataanalyst/status/123456791',
        createdAt: '2024-01-18T16:45:00Z',
        sentiment: 'positive',
        sentimentScore: 0.85,
        urgency: 'low',
        urgencyScore: 0.2,
        themes: ['Praise', 'Export'],
        keywords: ['export features', 'CSV', 'JSON', 'PDF', 'scheduled exports'],
        summary: 'Twitter praise for comprehensive export features and templates.'
    },

    // Email Feedback
    {
        id: 13,
        source: 'email',
        sourceId: 'email-001',
        title: 'Enterprise security audit requirements',
        content: 'Our security team has completed the initial audit and has several requirements for enterprise deployment: 1) End-to-end encryption for all data in transit, 2) Role-based access controls with audit logging, 3) Data residency guarantees for EU customers, 4) Quarterly penetration testing reports.',
        author: 'CISO Office',
        authorEmail: 'ciso@enterprise.com',
        url: '',
        createdAt: '2024-01-20T11:15:00Z',
        sentiment: 'neutral',
        sentimentScore: -0.1,
        urgency: 'critical',
        urgencyScore: 0.9,
        themes: ['Security', 'Compliance'],
        keywords: ['security audit', 'encryption', 'access controls', 'data residency', 'penetration testing'],
        summary: 'Enterprise security audit requirements for deployment.'
    },
    {
        id: 14,
        source: 'email',
        sourceId: 'email-002',
        title: 'Request for volume licensing discounts',
        content: 'We\'re planning to deploy your solution across 5,000 users and would like to discuss volume licensing options. Current per-seat pricing becomes prohibitive at scale. Are there enterprise packages or custom pricing available?',
        author: 'Procurement Department',
        authorEmail: 'procurement@largecorp.com',
        url: '',
        createdAt: '2024-01-19T09:30:00Z',
        sentiment: 'neutral',
        sentimentScore: 0.1,
        urgency: 'medium',
        urgencyScore: 0.6,
        themes: ['Pricing'],
        keywords: ['volume licensing', 'enterprise deployment', 'per-seat pricing', 'custom pricing'],
        summary: 'Request for volume licensing discounts for large deployment.'
    },
    {
        id: 15,
        source: 'email',
        sourceId: 'email-003',
        title: 'Integration with Salesforce would be transformative',
        content: 'Our sales team lives in Salesforce. Integration between your feedback insights and our CRM would create a closed loop from customer feedback to sales action. We could automatically create follow-up tasks for high-value feedback.',
        author: 'Sales Operations',
        authorEmail: 'salesops@company.com',
        url: '',
        createdAt: '2024-01-18T13:45:00Z',
        sentiment: 'positive',
        sentimentScore: 0.7,
        urgency: 'medium',
        urgencyScore: 0.5,
        themes: ['Integration', 'Features'],
        keywords: ['Salesforce integration', 'CRM', 'closed loop', 'sales automation'],
        summary: 'Request for Salesforce integration to close feedback-to-sales loop.'
    },

    // Support Tickets
    {
        id: 16,
        source: 'support',
        sourceId: 'sup-001',
        title: 'Critical: Data corruption during bulk import',
        content: 'Urgent issue - we\'re experiencing data corruption during bulk imports of feedback data. Approximately 15% of records are being corrupted with random character replacement. This is affecting our data integrity and we\'ve had to pause all imports.',
        author: 'Data Engineering Team',
        authorEmail: 'data-eng@company.com',
        url: 'https://support.company.com/tickets/CRITICAL-123',
        createdAt: '2024-01-20T07:00:00Z',
        sentiment: 'negative',
        sentimentScore: -0.9,
        urgency: 'critical',
        urgencyScore: 0.95,
        themes: ['Bugs', 'Data Integrity'],
        keywords: ['data corruption', 'bulk import', 'character replacement', 'data integrity'],
        summary: 'Critical data corruption issue during bulk imports affecting 15% of records.'
    },
    {
        id: 17,
        source: 'support',
        sourceId: 'sup-002',
        title: 'Feature request: Advanced analytics dashboard',
        content: 'The current dashboard is good but we need more advanced analytics: cohort analysis, funnel visualization, and predictive insights. Our analytics team would be willing to pay premium for these advanced features.',
        author: 'Analytics Director',
        authorEmail: 'analytics@company.com',
        url: 'https://support.company.com/tickets/FEATURE-456',
        createdAt: '2024-01-19T15:30:00Z',
        sentiment: 'positive',
        sentimentScore: 0.5,
        urgency: 'medium',
        urgencyScore: 0.4,
        themes: ['Features', 'Analytics'],
        keywords: ['advanced analytics', 'cohort analysis', 'funnel visualization', 'predictive insights'],
        summary: 'Request for advanced analytics features with cohort analysis and predictive insights.'
    },
    {
        id: 18,
        source: 'support',
        sourceId: 'sup-003',
        title: 'Complaint: Misleading marketing about AI capabilities',
        content: 'Your marketing claims "advanced AI analysis" but the reality is basic keyword matching. We feel misled about the AI capabilities. Either improve the AI or correct your marketing. This is damaging trust in your brand.',
        author: 'Dissatisfied Customer',
        authorEmail: 'customer@company.com',
        url: 'https://support.company.com/tickets/COMPLAINT-789',
        createdAt: '2024-01-18T10:15:00Z',
        sentiment: 'negative',
        sentimentScore: -0.8,
        urgency: 'high',
        urgencyScore: 0.8,
        themes: ['Marketing', 'AI/ML'],
        keywords: ['misleading marketing', 'AI capabilities', 'keyword matching', 'brand trust'],
        summary: 'Complaint about misleading AI marketing claims vs actual capabilities.'
    },

    // Community Forums
    {
        id: 19,
        source: 'forums',
        sourceId: 'forum-001',
        title: 'Best practices for API rate limiting?',
        content: 'Looking for community guidance on best practices for handling API rate limits. We\'re building a high-volume integration and need to implement proper backoff strategies. What patterns have worked for others?',
        author: 'IntegrationDeveloper',
        authorEmail: 'dev@community.com',
        url: 'https://forums.company.com/threads/api-rate-limits/12345',
        createdAt: '2024-01-20T16:20:00Z',
        sentiment: 'neutral',
        sentimentScore: 0.0,
        urgency: 'medium',
        urgencyScore: 0.5,
        themes: ['Integration', 'API'],
        keywords: ['API rate limits', 'backoff strategies', 'high-volume integration', 'best practices'],
        summary: 'Community discussion seeking API rate limiting best practices.'
    },
    {
        id: 20,
        source: 'forums',
        sourceId: 'forum-002',
        title: 'Success story: 300% ROI in first quarter',
        content: 'Wanted to share our success - we achieved 300% ROI in the first quarter after implementing your platform. The key was using the AI insights to prioritize product roadmap decisions. This transformed our product development process.',
        author: 'SuccessStory',
        authorEmail: 'success@company.com',
        url: 'https://forums.company.com/threads/success-stories/67890',
        createdAt: '2024-01-19T12:45:00Z',
        sentiment: 'positive',
        sentimentScore: 0.9,
        urgency: 'low',
        urgencyScore: 0.1,
        themes: ['Praise', 'ROI'],
        keywords: ['ROI success', 'product roadmap', 'AI insights', 'development process'],
        summary: 'Success story showing 300% ROI through AI-driven product decisions.'
    }
];

// Theme definitions with colors
const themes = [
    { name: 'UI/UX', color: '#4ecdc4', description: 'User interface and experience feedback' },
    { name: 'Performance', color: '#ff6b6b', description: 'System performance and speed issues' },
    { name: 'Features', color: '#45b7d1', description: 'Feature requests and functionality' },
    { name: 'Bugs', color: '#f7b731', description: 'Bug reports and issues' },
    { name: 'Documentation', color: '#5f27cd', description: 'Documentation and help content' },
    { name: 'Pricing', color: '#00d2d3', description: 'Pricing and billing feedback' },
    { name: 'Security', color: '#ee5a24', description: 'Security concerns and suggestions' },
    { name: 'Integration', color: '#a55eea', description: 'Third-party integrations' },
    { name: 'Praise', color: '#26de81', description: 'Positive feedback and compliments' },
    { name: 'Support', color: '#2bcbba', description: 'Customer support experiences' },
    { name: 'Compliance', color: '#fd79a8', description: 'Regulatory compliance issues' },
    { name: 'Export', color: '#6c5ce7', description: 'Data export functionality' },
    { name: 'Mobile', color: '#00b894', description: 'Mobile app and responsive design' },
    { name: 'AI/ML', color: '#9b59b6', description: 'Artificial intelligence and machine learning' },
    { name: 'Data Integrity', color: '#e74c3c', description: 'Data quality and integrity issues' },
    { name: 'Marketing', color: '#f39c12', description: 'Marketing and communications' },
    { name: 'Analytics', color: '#3498db', description: 'Analytics and reporting features' },
    { name: 'ROI', color: '#27ae60', description: 'Return on investment and value' }
];

// Source configurations
const sources = [
    { name: 'github', icon: 'fab fa-github', color: '#333' },
    { name: 'discord', icon: 'fab fa-discord', color: '#7289da' },
    { name: 'reddit', icon: 'fab fa-reddit', color: '#ff4500' },
    { name: 'twitter', icon: 'fab fa-twitter', color: '#1da1f2' },
    { name: 'email', icon: 'fas fa-envelope', color: '#ea4335' },
    { name: 'support', icon: 'fas fa-life-ring', color: '#ff6b6b' },
    { name: 'forums', icon: 'fas fa-comments', color: '#4a5568' }
];

// Sentiment and urgency configurations
const sentimentConfig = {
    positive: { color: '#26de81', icon: 'fas fa-smile', label: 'Positive' },
    neutral: { color: '#f7b731', icon: 'fas fa-meh', label: 'Neutral' },
    negative: { color: '#fc5c65', icon: 'fas fa-frown', label: 'Negative' }
};

const urgencyConfig = {
    critical: { color: '#eb3b5a', icon: 'fas fa-exclamation-circle', label: 'Critical' },
    high: { color: '#fa8231', icon: 'fas fa-exclamation-triangle', label: 'High' },
    medium: { color: '#f7b731', icon: 'fas fa-info-circle', label: 'Medium' },
    low: { color: '#26de81', icon: 'fas fa-check-circle', label: 'Low' }
};

// AI Insights Templates
const aiInsights = {
    summary: "Based on analysis of 20 feedback items across 7 sources, key patterns emerge: Performance and security concerns dominate critical issues, while AI/ML features receive highest praise. Mobile stability requires immediate attention, with iOS crashes representing 25% of critical feedback. Integration capabilities are driving enterprise adoption, with API and CRM integrations most requested.",
    
    keyInsights: [
        "Mobile app crashes on iOS 17.2 are blocking 100% of mobile users",
        "Memory leaks in data processing are preventing production deployment",
        "AI/ML features are driving 90% positive sentiment in feature requests",
        "Enterprise security and compliance requirements are critical blockers",
        "API integration quality is praised as best-in-class",
        "Pricing model is generally viewed as fair and transparent",
        "Export functionality is meeting diverse enterprise needs"
    ],
    
    recommendations: [
        {
            priority: "Critical",
            action: "Fix iOS 17.2 mobile app crashes immediately",
            impact: "Unblocks entire mobile user base",
            effort: "High"
        },
        {
            priority: "Critical", 
            action: "Resolve memory leak in data processing module",
            impact: "Enables production deployment for enterprise customers",
            effort: "High"
        },
        {
            priority: "High",
            action: "Implement enterprise security requirements for SOC2 compliance",
            impact: "Opens enterprise market segment",
            effort: "Medium"
        },
        {
            priority: "Medium",
            action: "Enhance AI capabilities beyond keyword matching",
            impact: "Addresses misleading marketing concerns",
            effort: "High"
        },
        {
            priority: "Medium",
            action: "Develop Salesforce integration for closed-loop feedback",
            impact: "Creates competitive advantage in CRM integration",
            effort: "Medium"
        }
    ],
    
    trends: {
        sentiment: {
            current: 0.2,
            change: "+8%",
            direction: "improving"
        },
        urgency: {
            current: 0.6,
            change: "0%",
            direction: "stable"
        },
        themes: {
            top: ["Performance", "Security", "AI/ML"],
            emerging: ["Integration", "Mobile"]
        }
    }
};

// Export data for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleFeedback,
        themes,
        sources,
        sentimentConfig,
        urgencyConfig,
        aiInsights
    };
}
