export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle feedback ingestion (mock for now)
    if (request.method === 'POST' && url.pathname === '/ingest') {
      try {
        const body = await request.json();
        const feedbackId = Date.now().toString();
        
        // Mock storage - in production, use KV
        console.log('Storing feedback:', { ...body, id: feedbackId });
        
        return Response.json({ 
          success: true, 
          id: feedbackId,
          message: 'Feedback ingested successfully (mock)' 
        });
      } catch (error) {
        return Response.json({ 
          success: false, 
          error: error.message 
        }, { status: 400 });
      }
    }
    
    // Handle feedback retrieval (mock for now)
    if (url.pathname === '/feedback') {
      try {
        // Mock data - in production, fetch from KV
        const mockData = [
          {
            id: "1",
            title: "Great dashboard!",
            content: "Love the new interface and real-time updates",
            author: "user123",
            source: "discord",
            sentiment: "positive",
            urgency: "low",
            themes: ["UI/UX"],
            keywords: ["interface", "updates", "dashboard"],
            createdAt: new Date().toISOString()
          },
          {
            id: "2", 
            title: "Performance issues",
            content: "The dashboard is loading slowly with large datasets",
            author: "dev456",
            source: "github",
            sentiment: "negative",
            urgency: "high",
            themes: ["Performance"],
            keywords: ["slow", "loading", "performance"],
            createdAt: new Date().toISOString()
          }
        ];
        
        return Response.json(mockData);
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
