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
        }, { status: 400 });
      }
    }
    
    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};
