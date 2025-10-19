import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'Admin'
  },
  {
    name: 'Bot Mimic User',
    email: 'bot@demo.com',
    password: 'bot123',
    role: 'Bot Mimic'
  },
  {
    name: 'Applicant User',
    email: 'applicant@demo.com',
    password: 'applicant123',
    role: 'Applicant'
  }
]

export const createDemoUsers = async () => {
  try {
    console.log('Creating demo users...')
    
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        console.log(`Demo user ${userData.email} already exists`)
        continue
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(userData.password, salt)

      // Create user
      await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role
      })

      console.log(`✅ Created demo user: ${userData.email} (${userData.role})`)
    }
    
    console.log('Demo users creation completed!')
  } catch (error) {
    console.error('Error creating demo users:', error)
  }
}