async function getSpeechToken() {
  try {
    // Log the client key (first few characters only for security)
    const keyPrefix = CLIENT_API_KEY ? CLIENT_API_KEY.substring(0, 3) + "..." : "undefined";
    console.log("Using client key:", keyPrefix);
    console.log(`Making request to ${tokenEndpoint} with region: ${speechRegion}`);
    
    // Get new token from our serverless function with API key
    console.log("Preparing to fetch speech token");
    const response = await fetch('/api/get-speech-token', {
      method: 'GET',
      headers: {
        'x-api-key': CLIENT_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Speech token response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Speech token error response:", errorText);
      throw new Error('Failed to get token: ' + response.statusText);
    }
    
    const data = await response.json();
    console.log("Speech token received successfully");
    
  } catch (error) {
    console.error('Detailed error getting speech token:', error);
    console.error('Error details:', error.stack);

    if (error.response) {
      console.error('Azure response status:', error.response.status);
      console.error('Azure response data:', JSON.stringify(error.response.data));
    }

    throw error;
  }
}