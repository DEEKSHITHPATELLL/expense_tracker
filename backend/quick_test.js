const axios = require('axios');

async function quickTest() {
    console.log('🧪 Quick Registration Test');
    console.log('=' * 30);
    
    const testData = {
        name: 'John Doe',
        email: 'john' + Date.now() + '@test.com',
        password: 'TestPass123'
    };
    
    console.log('📝 Testing with:');
    console.log(`Name: ${testData.name}`);
    console.log(`Email: ${testData.email}`);
    console.log(`Password: ${testData.password}`);
    
    try {
        const response = await axios.post('http://localhost:3000/api/auth/register', testData);
        console.log('✅ SUCCESS!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ FAILED!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

quickTest();
