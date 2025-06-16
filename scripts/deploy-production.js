#!/usr/bin/env node

/**
 * Production Deployment Script for AI PDF Chatbot
 * This script helps prepare the application for Render deployment
 *
 * Usage: node scripts/deploy-production.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production deployment preparation...\n');

// Check if we're in the correct directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the ai-pdf-reader directory.');
  process.exit(1);
}

// Check environment variables
console.log('🔍 Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_GOOGLE_API_KEY',
  'NEXT_PUBLIC_CONVEX_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:', missingVars.join(', '));
  console.log('   Make sure to set these in Render\'s environment variables section.');
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Generate Convex code
  console.log('🔧 Generating Convex code...');
  execSync('npx convex codegen', { stdio: 'inherit' });

  // Run linting
  console.log('🧹 Running linter...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Linting warnings found, but continuing...');
  }

  // Build the application
  console.log('🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Production build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Create a new Web Service on Render');
  console.log('3. Connect your GitHub repository');
  console.log('4. Set the environment variables in Render');
  console.log('5. Deploy!');
  console.log('\n📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions.');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
