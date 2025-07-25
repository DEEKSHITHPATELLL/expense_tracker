#!/usr/bin/env node

/**
 * Registration Debug Script for Expense Tracker
 * This script helps identify and fix registration issues
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Expense Tracker Registration Debug Tool');
console.log('=' * 60);

// Step 1: Check Environment Variables
console.log('\n📋 Step 1: Checking Environment Variables');
console.log('-'.repeat(40));

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const frontendUrl = process.env.FRONTEND_URL;

if (!mongoUri) {
    console.log('❌ MONGODB_URI is missing from .env file');
} else {
    console.log(`✅ MONGODB_URI: ${mongoUri.substring(0, 20)}...`);
}

if (!jwtSecret) {
    console.log('❌ JWT_SECRET is missing from .env file');
} else {
    console.log(`✅ JWT_SECRET: ${jwtSecret.substring(0, 8)}...`);
}

if (!frontendUrl) {
    console.log('⚠️  FRONTEND_URL is missing (using default)');
} else {
    console.log(`✅ FRONTEND_URL: ${frontendUrl}`);
}

// Step 2: Test Database Connection
async function testDatabaseConnection() {
    console.log('\n🔗 Step 2: Testing Database Connection');
    console.log('-'.repeat(40));
    
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        
        console.log('✅ MongoDB connection successful!');
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log(`   Port: ${mongoose.connection.port}`);
        
        return true;
    } catch (error) {
        console.log('❌ MongoDB connection failed:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.log('💡 Authentication issue - check username/password in connection string');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('💡 DNS resolution failed - check cluster URL');
        } else if (error.message.includes('timeout')) {
            console.log('💡 Connection timeout - check network/firewall settings');
        }
        
        return false;
    }
}

// Step 3: Test User Model
async function testUserModel() {
    console.log('\n👤 Step 3: Testing User Model');
    console.log('-'.repeat(40));
    
    try {
        // Import User model
        const User = require('./models/user');
        
        console.log('✅ User model loaded successfully');
        
        // Test model schema
        const userSchema = User.schema;
        console.log('✅ User schema fields:');
        Object.keys(userSchema.paths).forEach(field => {
            if (field !== '_id' && field !== '__v') {
                const fieldInfo = userSchema.paths[field];
                const required = fieldInfo.isRequired ? '(required)' : '(optional)';
                console.log(`   - ${field}: ${fieldInfo.instance} ${required}`);
            }
        });
        
        return User;
    } catch (error) {
        console.log('❌ Error loading User model:', error.message);
        return null;
    }
}

// Step 4: Test Registration Logic
async function testRegistrationLogic(User) {
    console.log('\n🧪 Step 4: Testing Registration Logic');
    console.log('-'.repeat(40));
    
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123'
    };
    
    try {
        // Check if test user already exists
        console.log('🔄 Checking for existing test user...');
        const existingUser = await User.findOne({ email: testUser.email });
        
        if (existingUser) {
            console.log('⚠️  Test user already exists, deleting...');
            await User.deleteOne({ email: testUser.email });
            console.log('✅ Test user deleted');
        }
        
        // Test user creation
        console.log('🔄 Testing user creation...');
        const newUser = await User.create(testUser);
        
        console.log('✅ User created successfully!');
        console.log(`   ID: ${newUser._id}`);
        console.log(`   Name: ${newUser.name}`);
        console.log(`   Email: ${newUser.email}`);
        console.log(`   Created: ${newUser.createdAt}`);
        
        // Test password hashing
        console.log('🔄 Testing password hashing...');
        const isPasswordHashed = newUser.password !== testUser.password;
        
        if (isPasswordHashed) {
            console.log('✅ Password is properly hashed');
        } else {
            console.log('❌ Password is not hashed - security issue!');
        }
        
        // Test password comparison
        console.log('🔄 Testing password comparison...');
        const isPasswordValid = await newUser.comparePassword(testUser.password);
        
        if (isPasswordValid) {
            console.log('✅ Password comparison works correctly');
        } else {
            console.log('❌ Password comparison failed');
        }
        
        // Clean up test user
        await User.deleteOne({ email: testUser.email });
        console.log('✅ Test user cleaned up');
        
        return true;
        
    } catch (error) {
        console.log('❌ Registration logic test failed:', error.message);
        
        if (error.code === 11000) {
            console.log('💡 Duplicate key error - user already exists');
        } else if (error.name === 'ValidationError') {
            console.log('💡 Validation error:');
            Object.keys(error.errors).forEach(field => {
                console.log(`   - ${field}: ${error.errors[field].message}`);
            });
        }
        
        return false;
    }
}

// Step 5: Test Validation Rules
async function testValidationRules() {
    console.log('\n✅ Step 5: Testing Validation Rules');
    console.log('-'.repeat(40));
    
    try {
        const { validateRegister } = require('./middleware/validation');
        
        console.log('✅ Validation middleware loaded');
        
        // Test validation rules
        const validationRules = validateRegister;
        console.log(`✅ Found ${validationRules.length} validation rules:`);
        
        validationRules.forEach((rule, index) => {
            console.log(`   ${index + 1}. ${rule.builder.fields[0]} validation`);
        });
        
        return true;
    } catch (error) {
        console.log('❌ Error loading validation rules:', error.message);
        return false;
    }
}

// Step 6: Test API Endpoint
async function testAPIEndpoint() {
    console.log('\n🌐 Step 6: Testing API Endpoint');
    console.log('-'.repeat(40));
    
    try {
        const express = require('express');
        const request = require('supertest');
        
        // Create test app
        const app = express();
        app.use(express.json());
        
        // Load routes
        const authRoutes = require('./routes/auth');
        app.use('/api/auth', authRoutes);
        
        console.log('✅ Test server created');
        
        // Test registration endpoint
        const testData = {
            name: 'API Test User',
            email: 'apitest@example.com',
            password: 'ApiTest123'
        };
        
        console.log('🔄 Testing POST /api/auth/register...');
        
        const response = await request(app)
            .post('/api/auth/register')
            .send(testData)
            .expect('Content-Type', /json/);
        
        console.log(`✅ API Response Status: ${response.status}`);
        console.log(`✅ API Response Body:`, response.body);
        
        if (response.status === 201 && response.body.success) {
            console.log('✅ Registration endpoint working correctly!');
            return true;
        } else {
            console.log('❌ Registration endpoint returned error');
            return false;
        }
        
    } catch (error) {
        console.log('❌ API endpoint test failed:', error.message);
        return false;
    }
}

// Main function
async function main() {
    try {
        // Test database connection
        const dbConnected = await testDatabaseConnection();
        if (!dbConnected) {
            console.log('\n❌ Cannot proceed without database connection');
            process.exit(1);
        }
        
        // Test user model
        const User = await testUserModel();
        if (!User) {
            console.log('\n❌ Cannot proceed without User model');
            process.exit(1);
        }
        
        // Test registration logic
        const registrationWorks = await testRegistrationLogic(User);
        
        // Test validation rules
        const validationWorks = await testValidationRules();
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 DIAGNOSTIC SUMMARY');
        console.log('='.repeat(60));
        
        console.log(`✅ Environment Variables: ${mongoUri && jwtSecret ? 'OK' : 'ISSUES'}`);
        console.log(`✅ Database Connection: ${dbConnected ? 'OK' : 'FAILED'}`);
        console.log(`✅ User Model: ${User ? 'OK' : 'FAILED'}`);
        console.log(`✅ Registration Logic: ${registrationWorks ? 'OK' : 'FAILED'}`);
        console.log(`✅ Validation Rules: ${validationWorks ? 'OK' : 'FAILED'}`);
        
        if (dbConnected && User && registrationWorks && validationWorks) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ Registration should be working correctly');
            console.log('\n💡 If you\'re still getting "registration failed":');
            console.log('   1. Check frontend console for detailed error messages');
            console.log('   2. Check server logs when registration is attempted');
            console.log('   3. Verify the frontend is sending correct data format');
            console.log('   4. Check CORS settings if frontend is on different port');
        } else {
            console.log('\n⚠️  ISSUES DETECTED!');
            console.log('💡 Fix the failed components above to resolve registration issues');
        }
        
    } catch (error) {
        console.error('❌ Diagnostic script failed:', error);
    } finally {
        // Close database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the diagnostic
main();
