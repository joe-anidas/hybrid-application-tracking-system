import 'dotenv/config'
import mongoose from 'mongoose'
import { seedAllDemoData } from './config/seedDemoData.js'

/**
 * Load Demo Data Script
 * 
 * This script seeds the database with demo data.
 * Run it manually when you need to populate or refresh demo data.
 * 
 * Usage:
 *   node load.js
 */

const loadDemoData = async () => {
  try {
    console.log('🌱 Starting demo data loading...\n')

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hybrid-ats')
    console.log('✅ MongoDB connected\n')

    // Seed all demo data
    await seedAllDemoData()

    console.log('\n✅ Demo data loading completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - 7 Demo Users (1 Admin, 1 Bot Mimic, 5 Applicants)')
    console.log('   - 8 Demo Jobs (4 Technical, 4 Non-Technical)')
    console.log('   - 5 Applicant Profiles (with education, experience, skills)')
    console.log('   - 10 Demo Applications (various statuses)')
    
    console.log('\n🎯 Demo Credentials:')
    console.log('   Admin: admin@demo.com / admin123')
    console.log('   Bot Mimic: bot@demo.com / bot123')
    console.log('   Applicants: applicant@demo.com / applicant123 (and 4 more)')
    
    console.log('\n💡 Tip: You can now start the server with: npm start')
    
  } catch (error) {
    console.error('\n❌ Error loading demo data:', error)
    process.exit(1)
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close()
    console.log('\n🔌 MongoDB connection closed')
    process.exit(0)
  }
}

// Run the loading script
loadDemoData()
