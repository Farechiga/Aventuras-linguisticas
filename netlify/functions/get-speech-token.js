// netlify/functions/get-speech-token.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Set strict CORS headers - only allow your domain
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://your-netlify-site.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Check for API key (from request header)
  const clientApiKey = event.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== process.env.CLIENT_API_KEY) {
    console.log('Invalid or missing API key');
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Unauthorized access' })
    };
  }

  try {
    // Get Azure Speech key and region from environment variables
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION.toLowerCase();

    if (!speechKey || !speechRegion) {
      console.error('Azure Speech credentials not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Speech service configuration error' })
      };
    }

    console.log(`Attempting to get token from region: ${speechRegion}`);

    // Azure Speech token endpoint
    const tokenEndpoint = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

    // Request the token
    const response = await axios({
      method: 'post',
      url: tokenEndpoint,
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('Token retrieved successfully');

    // Return successful response with token and region
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: response.data,
        region: speechRegion
      })
    };
  } catch (error) {
    console.error('Error getting speech token:', error.message);
    
    let errorDetails = error.message;
    if (error.response) {
      errorDetails = `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`;
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to retrieve speech token',
        details: errorDetails
      })
    };
  }
};