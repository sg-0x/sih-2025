// Debug script to test points system
const fetch = require('node-fetch');

async function debugPoints() {
  console.log('🔍 Debugging points system...\n');
  
  // Test 1: Check if backend server is running
  console.log('1️⃣ Testing backend server connection...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      console.log('✅ Backend server is running');
    } else {
      console.log('❌ Backend server not responding properly');
    }
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log('💡 Please start the backend server: cd backend && node server.js');
    return;
  }
  
  // Test 2: Test points API
  console.log('\n2️⃣ Testing points API...');
  try {
    const pointsResponse = await fetch('http://localhost:5000/api/points/award', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'debug-user',
        videoId: 'debug-video',
        videoType: 'drill',
        completionPercentage: 100
      })
    });
    
    const pointsData = await pointsResponse.json();
    console.log('📊 Points API Response:', JSON.stringify(pointsData, null, 2));
    
    if (pointsData.success) {
      console.log('✅ Points API is working correctly');
    } else {
      console.log('❌ Points API error:', pointsData.message);
    }
  } catch (error) {
    console.log('❌ Points API error:', error.message);
  }
  
  // Test 3: Check user points
  console.log('\n3️⃣ Testing user points retrieval...');
  try {
    const userPointsResponse = await fetch('http://localhost:5000/api/points/user/debug-user');
    const userPointsData = await userPointsResponse.json();
    console.log('📊 User Points Response:', JSON.stringify(userPointsData, null, 2));
    
    if (userPointsData.success) {
      console.log('✅ User points retrieval is working');
    } else {
      console.log('❌ User points error:', userPointsData.message);
    }
  } catch (error) {
    console.log('❌ User points error:', error.message);
  }
  
  // Test 4: Check leaderboard
  console.log('\n4️⃣ Testing leaderboard...');
  try {
    const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
    const leaderboardData = await leaderboardResponse.json();
    console.log('📊 Leaderboard Response:', JSON.stringify(leaderboardData, null, 2));
    
    if (leaderboardData.success) {
      console.log('✅ Leaderboard is working');
    } else {
      console.log('❌ Leaderboard error:', leaderboardData.message);
    }
  } catch (error) {
    console.log('❌ Leaderboard error:', error.message);
  }
  
  console.log('\n🎯 Debug complete!');
}

debugPoints();
