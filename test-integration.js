// Test script for KV and AI integration
// Run this to test the new API endpoints

async function testIngestion() {
  const mockFeedback = {
    title: "Test feedback",
    content: "This is a test feedback message",
    author: "testuser",
    source: "test",
    sentiment: "neutral",
    urgency: "low",
    themes: ["Testing"],
    keywords: ["test", "feedback"]
  };

  try {
    const response = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockFeedback)
    });
    
    console.log("Ingestion test:", response.status, await response.text());
  } catch (error) {
    console.error("Ingestion error:", error);
  }
}

async function testRetrieval() {
  try {
    const response = await fetch("/api/feedback");
    const data = await response.json();
    console.log("Retrieval test:", data.length, "items");
  } catch (error) {
    console.error("Retrieval error:", error);
  }
}

async function testAI() {
  try {
    const response = await fetch("/api/summarize");
    const data = await response.json();
    console.log("AI summary test:", data);
  } catch (error) {
    console.error("AI error:", error);
  }
}

// Run tests
testIngestion();
testRetrieval();
testAI();
