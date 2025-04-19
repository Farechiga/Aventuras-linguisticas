// test-token.js
const axios = require('axios');

async function testTokenService() {
  try {
    console.log('Testing speech token service...');
    const response = await axios.get('http://localhost:8888/api/get-speech-token');
    
    console.log('Response received:');
    if (response.data.token) {
      // Don't log the full token for security, just confirm it exists
      console.log('Token received: ✓');
      console.log(`Token length: ${response.data.token.length} characters`);
    } else {
      console.log('No token in response');
    }
    console.log('Region:', response.data.region);
    console.log('Test successful!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTokenService();