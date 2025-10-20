import Job from '../models/Job.js'
import User from '../models/User.js'

export const createDemoJobs = async () => {
  try {
    // Check if jobs already exist
    const existingJobs = await Job.countDocuments()
    if (existingJobs > 0) {
      console.log('📋 Demo jobs already exist, skipping creation')
      return
    }

    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'Admin' })
    if (!adminUser) {
      console.log('❌ No admin user found, cannot create demo jobs')
      return
    }

    const demoJobs = [
      {
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'San Francisco, CA / Remote',
        type: 'full-time',
        jobType: 'technical',
        level: 'senior',
        description: 'We are looking for a talented Senior Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies and best practices.',
        requirements: '• 5+ years of experience in full-stack development\n• Proficiency in JavaScript, React, Node.js\n• Experience with databases (PostgreSQL, MongoDB)\n• Strong understanding of RESTful APIs\n• Experience with cloud platforms (AWS, GCP, or Azure)\n• Bachelor\'s degree in Computer Science or related field',
        responsibilities: '• Design and develop scalable web applications\n• Collaborate with cross-functional teams to define and implement features\n• Write clean, maintainable, and testable code\n• Participate in code reviews and technical discussions\n• Mentor junior developers\n• Contribute to technical architecture decisions',
        salaryMin: 120000,
        salaryMax: 160000,
        applicationDeadline: new Date('2025-11-20'),
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
        benefits: '• Competitive salary and equity package\n• Health, dental, and vision insurance\n• 401(k) with company matching\n• Flexible work arrangements\n• Professional development budget\n• Unlimited PTO\n• Modern office with free snacks and drinks',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 12
      },
      {
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Austin, TX / Remote',
        type: 'full-time',
        jobType: 'technical',
        level: 'mid',
        description: 'Join our DevOps team to help build and maintain our cloud infrastructure. You will work with cutting-edge technologies to ensure our applications are scalable, reliable, and secure.',
        requirements: '• 3+ years of experience in DevOps or Site Reliability Engineering\n• Experience with containerization (Docker, Kubernetes)\n• Proficiency with cloud platforms (AWS, Azure, GCP)\n• Knowledge of Infrastructure as Code (Terraform, CloudFormation)\n• Experience with CI/CD pipelines\n• Strong scripting skills (Python, Bash)',
        responsibilities: '• Design and maintain cloud infrastructure\n• Implement and optimize CI/CD pipelines\n• Monitor system performance and reliability\n• Automate deployment and scaling processes\n• Collaborate with development teams on infrastructure needs\n• Implement security best practices',
        salaryMin: 90000,
        salaryMax: 130000,
        applicationDeadline: new Date('2025-12-01'),
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Python', 'Jenkins'],
        benefits: '• Competitive salary\n• Health and dental insurance\n• Remote work flexibility\n• Professional development opportunities\n• Stock options\n• Generous PTO policy',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 8
      },
      {
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY / Hybrid',
        type: 'full-time',
        jobType: 'non-technical',
        level: 'mid',
        description: 'We are seeking a Product Manager to drive the vision, strategy, and roadmap for our core products. You will work closely with engineering, design, and business stakeholders.',
        requirements: '• 3+ years of product management experience\n• Experience with agile development methodologies\n• Strong analytical and problem-solving skills\n• Excellent communication and leadership abilities\n• Experience with product analytics tools\n• MBA or related degree preferred',
        responsibilities: '• Define product strategy and roadmap\n• Gather and prioritize product requirements\n• Work closely with engineering and design teams\n• Analyze market trends and customer feedback\n• Coordinate product launches and go-to-market strategies\n• Track product metrics and success KPIs',
        salaryMin: 100000,
        salaryMax: 140000,
        applicationDeadline: new Date('2025-11-15'),
        skills: ['Product Strategy', 'Agile', 'Analytics', 'Roadmap Planning', 'Stakeholder Management'],
        benefits: '• Competitive base salary\n• Performance-based bonuses\n• Health, dental, vision insurance\n• Hybrid work model\n• Professional development budget\n• Equity participation',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 15
      },
      {
        title: 'Marketing Specialist',
        department: 'Marketing',
        location: 'Los Angeles, CA',
        type: 'full-time',
        jobType: 'non-technical',
        level: 'entry',
        description: 'Join our marketing team to help execute campaigns, create content, and drive brand awareness. This is a great opportunity for someone looking to grow their marketing career.',
        requirements: '• Bachelor\'s degree in Marketing, Communications, or related field\n• 1-2 years of marketing experience\n• Experience with social media platforms\n• Basic knowledge of digital marketing tools\n• Strong written and verbal communication skills\n• Creative mindset and attention to detail',
        responsibilities: '• Execute marketing campaigns across multiple channels\n• Create and curate content for social media\n• Assist with email marketing campaigns\n• Support event planning and execution\n• Analyze campaign performance metrics\n• Collaborate with design team on marketing materials',
        salaryMin: 50000,
        salaryMax: 70000,
        applicationDeadline: new Date('2025-10-30'),
        skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Email Marketing', 'Analytics'],
        benefits: '• Competitive salary\n• Health and dental coverage\n• Professional development opportunities\n• Creative work environment\n• Flexible PTO\n• Team building events',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 22
      },
      {
        title: 'Data Scientist',
        department: 'Data & Analytics',
        location: 'Seattle, WA / Remote',
        type: 'full-time',
        jobType: 'technical',
        level: 'senior',
        description: 'We are looking for an experienced Data Scientist to join our analytics team. You will work on machine learning models, statistical analysis, and data-driven insights.',
        requirements: '• PhD or Master\'s in Data Science, Statistics, or related field\n• 4+ years of experience in data science or machine learning\n• Proficiency in Python and R\n• Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)\n• Strong statistical analysis skills\n• Experience with big data technologies',
        responsibilities: '• Develop and deploy machine learning models\n• Perform statistical analysis on large datasets\n• Create data visualizations and insights\n• Collaborate with product and engineering teams\n• Present findings to stakeholders\n• Mentor junior data scientists',
        salaryMin: 130000,
        salaryMax: 180000,
        applicationDeadline: new Date('2025-12-15'),
        skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        benefits: '• Highly competitive salary\n• Equity package\n• Premium health benefits\n• Remote work options\n• Conference and training budget\n• Research time allocation',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 6
      },
      {
        title: 'UX Designer',
        department: 'Design',
        location: 'San Francisco, CA / Remote',
        type: 'contract',
        jobType: 'non-technical',
        level: 'mid',
        description: 'We need a talented UX Designer to help improve our user experience across web and mobile platforms. You will work on user research, wireframing, and prototyping.',
        requirements: '• 3+ years of UX design experience\n• Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)\n• Experience with user research and testing\n• Strong portfolio showcasing UX work\n• Understanding of design systems\n• Excellent communication skills',
        responsibilities: '• Conduct user research and usability testing\n• Create wireframes, mockups, and prototypes\n• Design user flows and information architecture\n• Collaborate with product and engineering teams\n• Maintain and evolve design systems\n• Present design concepts to stakeholders',
        salaryMin: 80000,
        salaryMax: 110000,
        applicationDeadline: new Date('2025-11-30'),
        skills: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
        benefits: '• Competitive contract rate\n• Flexible working hours\n• Remote work capability\n• Access to design tools and resources\n• Potential for full-time conversion',
        createdBy: adminUser._id,
        status: 'active',
        applicants: 18
      }
    ]

    // Create jobs
    const createdJobs = await Job.insertMany(demoJobs)
    console.log(`✅ Created ${createdJobs.length} demo jobs`)

  } catch (error) {
    console.error('❌ Error creating demo jobs:', error)
  }
}