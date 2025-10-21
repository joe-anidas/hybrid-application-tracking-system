import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin@Demo2025!Secure',
    role: 'Admin'
  },
  {
    name: 'Bot Mimic User',
    email: 'bot@demo.com',
    password: 'BotMimic@Demo2025!Auto',
    role: 'Bot Mimic'
  },
  {
    name: 'John Doe',
    email: 'applicant@demo.com',
    password: 'Applicant@Demo2025!Job',
    role: 'Applicant'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@demo.com',
    password: 'Sarah@Wilson2025!Dev',
    role: 'Applicant'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@demo.com',
    password: 'Michael@Chen2025!Ops',
    role: 'Applicant'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@demo.com',
    password: 'Emily@Rodriguez2025!HR',
    role: 'Applicant'
  },
  {
    name: 'David Kumar',
    email: 'david.kumar@demo.com',
    password: 'David@Kumar2025!Mkt',
    role: 'Applicant'
  }
]

export const createDemoUsers = async () => {
  try {
    console.log('Creating demo users...')
    
    const createdUsers = {}
    
    for (const userData of demoUsers) {
      // Check if user already exists
      let user = await User.findOne({ email: userData.email })
      if (user) {
        console.log(`Demo user ${userData.email} already exists`)
        createdUsers[userData.email] = user
        continue
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(userData.password, salt)

      // Create user
      user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role
      })

      createdUsers[userData.email] = user
      console.log(`✅ Created demo user: ${userData.email} (${userData.role})`)
    }
    
    console.log('Demo users creation completed!')
    return createdUsers
  } catch (error) {
    console.error('Error creating demo users:', error)
    throw error
  }
}