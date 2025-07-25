#!/usr/bin/env node

/**
 * Simple Registration Test Script
 * Tests the registration endpoint directly
 */

const axios = require('axios');

async function testRegistration() {
    console.log('🧪 Testing Registration Endpoint');
    console.log('=' * 40);
    
    const testUser = {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com', // Unique email
        password: 'TestPass123'
    };
    
    console.log('📝 Test Data:');
    console.log(`   Name: ${testUser.name}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    
    try {
        console.log('\n🔄 Making registration request...');
        
        const response = await axios.post('http://localhost:3000/api/auth/register', testUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('✅ Registration successful!');
        console.log('📊 Response:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${response.data.success}`);
        console.log(`   Message: ${response.data.message}`);
        
        if (response.data.data) {
            console.log(`   User ID: ${response.data.data.user.id}`);
            console.log(`   User Name: ${response.data.data.user.name}`);
            console.log(`   User Email: ${response.data.data.user.email}`);
        }
        
    } catch (error) {
        console.log('❌ Registration failed!');
        
        if (error.response) {
            // Server responded with error
            console.log('📊 Error Response:');
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data.message || 'No message'}`);
            
            if (error.response.data.errors) {
                console.log('   Validation Errors:');
                error.response.data.errors.forEach(err => {
                    console.log(`     - ${err.path}: ${err.msg}`);
                });
            }
            
            // Common error analysis
            if (error.response.status === 400) {
                console.log('\n💡 Bad Request (400) - Possible causes:');
                console.log('   - Validation failed (check password requirements)');
                console.log('   - User already exists');
                console.log('   - Missing required fields');
            } else if (error.response.status === 500) {
                console.log('\n💡 Server Error (500) - Possible causes:');
                console.log('   - Database connection issue');
                console.log('   - Server configuration problem');
                console.log('   - Code error in registration logic');
            }
            
        } else if (error.request) {
            // Request was made but no response
            console.log('❌ No response from server');
            console.log('💡 Possible causes:');
            console.log('   - Server is not running');
            console.log('   - Wrong port (check if server is on port 3000)');
            console.log('   - Network connectivity issue');
            
        } else {
            // Something else happened
            console.log('❌ Request setup error:', error.message);
        }
    }
}

// Test server health first
async function testServerHealth() {
    console.log('🏥 Testing Server Health');
    console.log('-' * 30);
    
    try {
        const response = await axios.get('http://localhost:3000/api/health', {
            timeout: 5000
        });
        
        console.log('✅ Server is running!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${response.data.message}`);
        return true;
        
    } catch (error) {
        console.log('❌ Server health check failed');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Server is not running on port 3000');
            console.log('   Run: npm start or node server.js');
        } else {
            console.log(`💡 Error: ${error.message}`);
        }
        
        return false;
    }
}

async function main() {
    console.log('🚀 Expense Tracker Registration Test');
    console.log('=' * 50);
    
    // Test server health first
    const serverRunning = await testServerHealth();
    
    if (!serverRunning) {
        console.log('\n❌ Cannot test registration - server is not running');
        console.log('\n🔧 To fix:');
        console.log('1. Navigate to expense_tracker/backend');
        console.log('2. Run: npm start');
        console.log('3. Wait for "Server is running on port 3000"');
        console.log('4. Run this test again');
        return;
    }
    
    console.log('\n');
    await testRegistration();
    
    console.log('\n' + '=' * 50);
    console.log('🎯 TROUBLESHOOTING GUIDE');
    console.log('=' * 50);
    
    console.log('\n🔧 If registration is still failing:');
    console.log('\n1. Check server logs:');
    console.log('   - Look for error messages in terminal where server is running');
    console.log('   - Check for database connection errors');
    
    console.log('\n2. Verify environment variables:');
    console.log('   - Check .env file has MONGODB_URI and JWT_SECRET');
    console.log('   - Ensure MongoDB connection string is correct');
    
    console.log('\n3. Check password requirements:');
    console.log('   - Must be at least 6 characters');
    console.log('   - Must contain uppercase, lowercase, and number');
    
    console.log('\n4. Database issues:');
    console.log('   - Verify MongoDB Atlas cluster is running');
    console.log('   - Check network access settings in MongoDB Atlas');
    console.log('   - Ensure database user has write permissions');
    
    console.log('\n5. Run full diagnostic:');
    console.log('   node debug_registration.js');
}

main();
