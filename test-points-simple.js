// Simple test to verify points system
const fetch = require('node-fetch');

async function testPoints() {
  console.log('🧪 Testing points system...\n');
  
  try {
    // Test 1: Award points
    console.log('1️⃣ Testing points award...');
    const response = await fetch('http://localhost:5000/api/points/award', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user-123',
        videoId: 'test-video-456',
        videoType: 'drill',
        completionPercentage: 100
      })
    });
    
    const data = await response.json();
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Points awarded successfully!');
    } else {
      console.log('❌ Points award failed:', data.message);
    }
    
    // Test 2: Check user points
    console.log('\n2️⃣ Testing user points retrieval...');
    const userResponse = await fetch('http://localhost:5000/api/points/user/test-user-123');
    const userData = await userResponse.json();
    console.log('📊 User points:', JSON.stringify(userData, null, 2));
    
    // Test 3: Check leaderboard
    console.log('\n3️⃣ Testing leaderboard...');
    const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    const leaderboardData = await leaderboardResponse.json();
    console.log('📊 Leaderboard:', JSON.stringify(leaderboardData, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPoints();
