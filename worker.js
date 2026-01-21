export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // KV ingestion endpoint
    if (request.method === "POST" && url.pathname === "/api/ingest") {
      try {
        const body = await request.json();
        const feedbackId = Date.now().toString();
        
        await env.FEEDBACK.put(feedbackId, JSON.stringify({
          ...body,
          id: feedbackId,
          createdAt: new Date().toISOString(),
          source: body.source || 'manual'
        }));
        
        return new Response("ok", { status: 200 });
      } catch (error) {
        return new Response("error", { status: 400 });
      }
    }
    
    // KV retrieval endpoint
    if (url.pathname === "/api/feedback") {
      try {
        const list = await env.FEEDBACK.list();
        const items = await Promise.all(
          list.keys.map(async key => {
            const value = await env.FEEDBACK.get(key.name);
            return JSON.parse(value);
          })
        );
        
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return Response.json(items);
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
    
    // AI summarization endpoint
    if (url.pathname === "/api/summarize") {
      try {
        const mock = await env.FEEDBACK.get("1", { type: "json" });
        const result = await env.AI.run("@cf/llama-3.1-8b-instruct", {
          prompt: `Summarize this feedback data in 3 bullet points: ${JSON.stringify(mock)}`
        });
        return Response.json(result);
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
    
    // AI sentiment analysis endpoint
    if (url.pathname === "/api/analyze") {
      try {
        const body = await request.json();
        const feedback = body.feedback;
        
        const result = await env.AI.run("@cf/llama-3.1-8b-instruct", {
          prompt: `Analyze sentiment and extract themes from this feedback: ${feedback.content}. Return JSON with sentiment (positive/neutral/negative) and themes array.`
        });
        return Response.json(result);
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
    
    // Legacy endpoints for compatibility
    if (request.method === 'POST' && url.pathname === '/ingest') {
      return this.handleIngest(request, env);
    }
    
    if (url.pathname === '/feedback') {
      return this.handleFeedback(request, env);
    }
    
    // Serve static assets
    return env.ASSETS.fetch(request);
  },

  async handleIngest(request, env) {
    try {
      const body = await request.json();
      const feedbackId = Date.now().toString();
      
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
  },

  async handleFeedback(request, env) {
    try {
      const list = await env.FEEDBACK.list();
      const items = await Promise.all(
        list.keys.map(async key => {
          const value = await env.FEEDBACK.get(key.name);
          return JSON.parse(value);
        })
      );
      
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return Response.json(items);
    } catch (error) {
      return Response.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
  }
};
