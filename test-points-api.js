// Test script to check if points API is working
const fetch = require('node-fetch');

async function testPointsAPI() {
  try {
    console.log('🔄 Testing points API...');
    
    // Test awarding points
    const response = await fetch('http://localhost:5000/api/points/award', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user',
        videoId: 'test-video',
        videoType: 'drill',
        completionPercentage: 100
      })
    });
    
    const data = await response.json();
    console.log('📊 API Response:', data);
    
    if (data.success) {
      console.log('✅ Points API is working!');
    } else {
      console.log('❌ Points API error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('💡 Make sure the backend server is running on port 5001');
  }
}

testPointsAPI();
