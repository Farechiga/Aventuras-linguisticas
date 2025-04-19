// netlify/functions/get-client-key.js
exports.handler = async function(event, context) {
    // Apply CORS restrictions
    const headers = {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://your-netlify-site.netlify.app',
      'Content-Type': 'application/json'
    };
    
    // Optional: Check referrer to ensure requests come from your site
    const referrer = event.headers.referer || '';
    if (!referrer.includes(process.env.ALLOWED_ORIGIN)) {
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