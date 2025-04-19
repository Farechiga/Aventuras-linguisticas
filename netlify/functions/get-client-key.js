// netlify/functions/get-client-key.js
exports.handler = async function(event, context) {
    // Apply CORS restrictions
    const headers = {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://your-netlify-site.netlify.app',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }
    
    // Optional: Log information for debugging
    console.log("Request origin:", event.headers.origin);
    console.log("Allowed origin:", process.env.ALLOWED_ORIGIN);
    console.log("Referrer:", event.headers.referer || "No referrer");
    
    // Only check referrer if it exists (don't block requests without referrer)
    const referrer = event.headers.referer || '';
    if (referrer && !referrer.includes(process.env.ALLOWED_ORIGIN)) {
      console.log("Referrer check failed");
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Invalid referrer' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ key: process.env.CLIENT_API_KEY })
    };
  };