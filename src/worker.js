export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle feedback ingestion
    if (request.method === 'POST' && url.pathname === '/ingest') {
      try {
        const body = await request.json();
        const feedbackId = Date.now().toString();
        
        // Store in KV with metadata
        await env.FEEDBACK.put(feedbackId, JSON.stringify({
          ...body,
          id: feedbackId,
          createdAt: new Date().toISOString(),
          source: body.source || 'manual'
        }));
        
        return Response.json({ 
          success: true, 
          id: feedbackId,
          message: 'Feedback ingested successfully' 
        });
      } catch (error) {
        return Response.json({ 
          success: false, 
          error: error.message 
        }, { status: 400 });
      }
    }
    
    // Handle feedback retrieval
    if (url.pathname === '/feedback') {
      try {
        const list = await env.FEEDBACK.list();
        const items = await Promise.all(
          list.keys.map(async key => {
            const value = await env.FEEDBACK.get(key.name);
            return JSON.parse(value);
          })
        );
        
        // Sort by creation date (newest first)
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return Response.json(items);
      } catch (error) {
        return Response.json({ 
          success: false, 
          error: error.message 
        }, { status: 500 });
      }
    }
    
    // Handle feedback deletion
    if (request.method === 'DELETE' && url.pathname.startsWith('/feedback/')) {
      const id = url.pathname.split('/feedback/')[1];
      try {
        await env.FEEDBACK.delete(id);
        return Response.json({ 
          success: true, 
          message: 'Feedback deleted successfully' 
        });
      } catch (error) {
        return Response.json({ 
          success: false, 
          error: error.message 
        }, { status: 500 });
      }
    }
    
    // Handle AI analysis endpoint
    if (request.method === 'POST' && url.pathname === '/analyze') {
      try {
        const body = await request.json();
        const feedback = body.feedback;
        
        // Simple AI analysis simulation
        const analysis = {
          sentiment: analyzeSentiment(feedback.content),
          urgency: analyzeUrgency(feedback.content),
          themes: extractThemes(feedback.content),
          keywords: extractKeywords(feedback.content),
          recommendations: generateRecommendations(feedback.content)
        };
        
        return Response.json({ 
          success: true, 
          analysis 
        });
      } catch (error) {
        return Response.json({ 
          success: false, 
          error: error.message 
        }, { status: 500 });
      }
    }
    
    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};

// Simple analysis functions
function analyzeSentiment(content) {
  const positiveWords = ['good', 'great', 'excellent', 'love', 'amazing', 'perfect', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'broken', 'crash'];
  
  const words = content.toLowerCase().split(' ');
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function analyzeUrgency(content) {
  const urgentWords = ['critical', 'urgent', 'emergency', 'immediate', 'asap', 'blocking', 'broken', 'crash'];
  const words = content.toLowerCase().split(' ');
  const urgentCount = words.filter(word => urgentWords.includes(word)).length;
  
  if (urgentCount >= 2) return 'critical';
  if (urgentCount >= 1) return 'high';
  if (urgentCount >= 0.5) return 'medium';
  return 'low';
}

function extractThemes(content) {
  const themes = {
    'Performance': ['performance', 'slow', 'fast', 'speed', 'optimize'],
    'UI/UX': ['interface', 'design', 'user experience', 'ux', 'ui'],
    'Bugs': ['bug', 'error', 'crash', 'broken', 'issue'],
    'Features': ['feature', 'request', 'add', 'implement'],
    'Integration': ['integration', 'api', 'connect', 'sync'],
    'Security': ['security', 'vulnerability', 'auth', 'permission']
  };
  
  const detectedThemes = [];
  const words = content.toLowerCase().split(' ');
  
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(keyword => words.includes(keyword))) {
      detectedThemes.push(theme);
    }
  }
  
  return detectedThemes;
}

function extractKeywords(content) {
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3);
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function generateRecommendations(content) {
  const recommendations = [];
  
  if (content.toLowerCase().includes('bug') || content.toLowerCase().includes('error')) {
    recommendations.push('Investigate and fix reported issues');
  }
  
  if (content.toLowerCase().includes('feature') || content.toLowerCase().includes('request')) {
    recommendations.push('Evaluate feature request for roadmap inclusion');
  }
  
  if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('slow')) {
    recommendations.push('Optimize performance and investigate bottlenecks');
  }
  
  return recommendations;
}
