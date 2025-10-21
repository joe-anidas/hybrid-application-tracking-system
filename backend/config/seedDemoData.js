import Job from '../models/Job.js'
import Application from '../models/Application.js'
import ApplicantProfile from '../models/ApplicantProfile.js'
import User from '../models/User.js'

// Demo jobs data
const demoJobs = [
  // Technical Jobs (for Bot Mimic automated processing)
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'full-time',
    jobType: 'technical',
    level: 'senior',
    description: 'We are seeking an experienced Full Stack Developer to join our growing engineering team. You will be responsible for developing scalable web applications using modern technologies.',
    requirements: '5+ years of experience in full-stack development. Expert knowledge of React.js and Node.js. Strong understanding of MongoDB and PostgreSQL. Experience with AWS or Azure cloud platforms. Bachelor\'s degree in Computer Science or related field.',
    responsibilities: 'Design and develop scalable web applications. Collaborate with cross-functional teams. Code reviews and mentoring junior developers. Implement best practices and coding standards. Optimize application performance.',
    salaryMin: 1200000,
    salaryMax: 1800000,
    skills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'Docker'],
    benefits: 'Health Insurance, Remote Work, Learning Budget, Stock Options',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: 'Frontend React Developer',
    company: 'Digital Innovations Inc',
    department: 'Product Development',
    location: 'Chennai, India',
    type: 'full-time',
    jobType: 'technical',
    level: 'mid',
    description: 'Join our product team to build cutting-edge user interfaces with React.js. We value clean code, responsive design, and excellent user experience.',
    requirements: '3+ years of experience with React.js. Strong JavaScript/TypeScript skills. Experience with state management (Redux, Context API). Knowledge of responsive design and CSS frameworks. Bachelor\'s degree in Computer Science or equivalent experience.',
    responsibilities: 'Develop and maintain React applications. Implement responsive UI components. Optimize application performance. Collaborate with UX/UI designers. Write unit and integration tests.',
    salaryMin: 800000,
    salaryMax: 1200000,
    skills: ['React.js', 'TypeScript', 'Redux', 'CSS3', 'Jest', 'Git'],
    benefits: 'Health Insurance, Flexible Hours, Professional Development, Team Outings',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    department: 'Infrastructure',
    location: 'Kolkata, India',
    type: 'full-time',
    jobType: 'technical',
    level: 'mid',
    description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with cutting-edge tools and technologies.',
    requirements: '3+ years of DevOps experience. Strong knowledge of AWS/Azure services. Experience with Kubernetes and Docker. Proficiency in scripting (Python, Bash). CI/CD pipeline management experience.',
    responsibilities: 'Manage cloud infrastructure and deployments. Build and maintain CI/CD pipelines. Monitor system performance and security. Automate infrastructure provisioning. Troubleshoot production issues.',
    salaryMin: 1000000,
    salaryMax: 1500000,
    skills: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Python', 'Terraform'],
    benefits: 'Health Insurance, Remote Work, Certifications Budget, Performance Bonus',
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Python Backend Developer',
    company: 'DataTech Solutions',
    department: 'Engineering',
    location: 'Chennai, India',
    type: 'full-time',
    jobType: 'technical',
    level: 'entry',
    description: 'Join our backend team to build robust APIs and microservices using Python. Great opportunity for early-career developers to grow.',
    requirements: '1-2 years of Python development experience. Knowledge of Django or Flask framework. Understanding of RESTful APIs. Basic knowledge of databases (PostgreSQL, MongoDB). Bachelor\'s degree in Computer Science.',
    responsibilities: 'Develop and maintain backend APIs. Write clean and maintainable code. Collaborate with frontend developers. Participate in code reviews. Debug and fix issues.',
    salaryMin: 600000,
    salaryMax: 900000,
    skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API', 'Git'],
    benefits: 'Health Insurance, Training Programs, Mentorship, Work-Life Balance',
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  },
  
  // Non-Technical Jobs (for Admin manual management)
  {
    title: 'HR Manager',
    company: 'PeopleFirst Corp',
    department: 'Human Resources',
    location: 'Mumbai, India',
    type: 'full-time',
    jobType: 'non-technical',
    level: 'mid',
    description: 'Seeking an experienced HR Manager to lead our talent acquisition and employee engagement initiatives. You will play a key role in shaping our company culture.',
    requirements: '5+ years of HR management experience. Strong knowledge of recruitment processes. Experience with HRIS systems. Excellent communication and interpersonal skills. MBA in HR or related field preferred.',
    responsibilities: 'Manage end-to-end recruitment processes. Develop and implement HR policies. Handle employee relations and engagement. Conduct performance reviews. Ensure compliance with labor laws.',
    salaryMin: 1000000,
    salaryMax: 1500000,
    skills: ['Recruitment', 'Employee Relations', 'HRIS', 'Performance Management', 'Labor Law'],
    benefits: 'Health Insurance, Professional Development, Work-Life Balance, Bonus',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Marketing Manager',
    company: 'BrandBoost Media',
    department: 'Marketing',
    location: 'Delhi, India',
    type: 'full-time',
    jobType: 'non-technical',
    level: 'mid',
    description: 'Looking for a creative Marketing Manager to develop and execute marketing strategies that drive brand awareness and customer engagement.',
    requirements: '5+ years of marketing experience. Strong understanding of digital marketing. Experience with marketing automation tools. Excellent analytical and creative skills. Bachelor\'s degree in Marketing or Business.',
    responsibilities: 'Develop and execute marketing campaigns. Manage social media and content strategy. Analyze campaign performance metrics. Collaborate with sales and product teams. Manage marketing budget.',
    salaryMin: 900000,
    salaryMax: 1400000,
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Analytics', 'Campaign Management'],
    benefits: 'Health Insurance, Flexible Hours, Creative Freedom, Performance Bonus',
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Business Analyst',
    company: 'ConsultPro Solutions',
    department: 'Operations',
    location: 'Bangalore, India',
    type: 'full-time',
    jobType: 'non-technical',
    level: 'mid',
    description: 'Join our operations team as a Business Analyst to bridge the gap between business needs and technology solutions.',
    requirements: '3-5 years of business analysis experience. Strong analytical and problem-solving skills. Experience with requirements gathering. Knowledge of Agile methodologies. Bachelor\'s degree in Business or related field.',
    responsibilities: 'Gather and document business requirements. Analyze business processes and workflows. Create functional specifications. Collaborate with stakeholders. Support UAT and implementation.',
    salaryMin: 700000,
    salaryMax: 1100000,
    skills: ['Requirements Analysis', 'Process Modeling', 'Agile', 'SQL', 'Documentation'],
    benefits: 'Health Insurance, Professional Certification, Flexible Work, Learning Budget',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Content Writer',
    company: 'WordCraft Media',
    department: 'Content',
    location: 'Remote',
    type: 'full-time',
    jobType: 'non-technical',
    level: 'entry',
    description: 'Looking for a creative Content Writer to produce engaging content for our digital platforms. Perfect for someone passionate about writing.',
    requirements: '1-2 years of content writing experience. Excellent writing and editing skills. Knowledge of SEO best practices. Ability to research and write on diverse topics. Bachelor\'s degree in English, Journalism, or related field.',
    responsibilities: 'Create engaging blog posts and articles. Write social media content. Optimize content for SEO. Collaborate with marketing team. Proofread and edit content.',
    salaryMin: 400000,
    salaryMax: 700000,
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Research', 'Editing'],
    benefits: 'Health Insurance, Remote Work, Flexible Hours, Creative Freedom',
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
  }
]

// Demo applicant profiles
const demoProfiles = {
  'applicant@demo.com': {
    fullName: 'John Doe',
    email: 'applicant@demo.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka, India',
    summary: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Looking for challenging opportunities to grow.',
    education: [
      {
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'Indian Institute of Technology, Bangalore',
        startDate: '2015-07',
        endDate: '2019-05',
        grade: '8.5 CGPA'
      }
    ],
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Corp',
        startDate: '2021-06',
        current: true,
        description: 'Lead development of enterprise web applications using React and Node.js. Mentored junior developers and improved code quality.'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartUp Inc',
        startDate: '2019-07',
        endDate: '2021-05',
        description: 'Developed RESTful APIs and responsive frontend interfaces. Implemented CI/CD pipelines and optimized application performance.'
      }
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'JavaScript', 'Python', 'Git'],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2022-03'
      }
    ],
    portfolio: 'https://johndoe-portfolio.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  },
  'sarah.wilson@demo.com': {
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@demo.com',
    phone: '+91 98765 43211',
    location: 'Chennai, Tamil Nadu, India',
    summary: 'Creative Frontend Developer specializing in React and modern JavaScript. 4 years of experience building beautiful, responsive user interfaces.',
    education: [
      {
        degree: 'Bachelor of Engineering in Information Technology',
        institution: 'BITS Pilani',
        startDate: '2016-08',
        endDate: '2020-05',
        grade: '8.2 CGPA'
      }
    ],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'Digital Agency',
        startDate: '2020-07',
        current: true,
        description: 'Developed responsive web applications using React. Implemented state management with Redux and improved page load times.'
      }
    ],
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Webpack', 'TypeScript'],
    certifications: [],
    portfolio: 'https://sarahwilson.dev',
    linkedin: 'https://linkedin.com/in/sarahwilson',
    github: 'https://github.com/sarahwilson'
  },
  'michael.chen@demo.com': {
    fullName: 'Michael Chen',
    email: 'michael.chen@demo.com',
    phone: '+91 98765 43212',
    location: 'Kolkata, West Bengal, India',
    summary: 'Experienced DevOps Engineer with expertise in cloud infrastructure and automation. Passionate about improving deployment pipelines and system reliability.',
    education: [
      {
        degree: 'Master of Computer Applications',
        institution: 'Jadavpur University',
        startDate: '2017-07',
        endDate: '2020-06',
        grade: '8.7 CGPA'
      }
    ],
    experience: [
      {
        title: 'DevOps Engineer',
        company: 'Cloud Solutions',
        startDate: '2020-08',
        current: true,
        description: 'Managed AWS infrastructure, implemented CI/CD pipelines, and automated deployment processes using Docker and Kubernetes.'
      }
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Python', 'Linux', 'Terraform'],
    certifications: [
      {
        name: 'AWS Certified DevOps Engineer',
        issuer: 'Amazon Web Services',
        issueDate: '2021-09'
      }
    ],
    linkedin: 'https://linkedin.com/in/michaelchen',
    github: 'https://github.com/michaelchen'
  },
  'emily.rodriguez@demo.com': {
    fullName: 'Emily Rodriguez',
    email: 'emily.rodriguez@demo.com',
    phone: '+91 98765 43213',
    location: 'Mumbai, Maharashtra, India',
    summary: 'Strategic HR professional with 8+ years of experience in talent acquisition, employee relations, and HR operations. MBA in Human Resources.',
    education: [
      {
        degree: 'MBA in Human Resource Management',
        institution: 'Mumbai University',
        startDate: '2013-07',
        endDate: '2015-05',
        grade: '8.9 CGPA'
      },
      {
        degree: 'Bachelor of Arts in Psychology',
        institution: 'St. Xavier\'s College',
        startDate: '2010-07',
        endDate: '2013-05',
        grade: '8.5 CGPA'
      }
    ],
    experience: [
      {
        title: 'Senior HR Manager',
        company: 'Global Tech Ltd',
        startDate: '2019-01',
        current: true,
        description: 'Led recruitment for technical and non-technical roles. Managed employee relations and implemented HR policies.'
      },
      {
        title: 'HR Specialist',
        company: 'Business Corp',
        startDate: '2015-07',
        endDate: '2018-12',
        description: 'Handled recruitment, onboarding, and performance management for 200+ employees.'
      }
    ],
    skills: ['Recruitment', 'Employee Relations', 'HR Policy', 'Compliance', 'Performance Management'],
    certifications: [
      {
        name: 'SHRM Certified Professional',
        issuer: 'Society for Human Resource Management',
        issueDate: '2018-06'
      }
    ],
    linkedin: 'https://linkedin.com/in/emilyrodriguez'
  },
  'david.kumar@demo.com': {
    fullName: 'David Kumar',
    email: 'david.kumar@demo.com',
    phone: '+91 98765 43214',
    location: 'Bangalore, Karnataka, India',
    summary: 'Results-driven Marketing professional with 6 years of experience in digital marketing and brand management. Proven track record of successful campaigns.',
    education: [
      {
        degree: 'MBA in Marketing',
        institution: 'IIM Bangalore',
        startDate: '2016-07',
        endDate: '2018-05',
        grade: '9.0 CGPA'
      }
    ],
    experience: [
      {
        title: 'Marketing Manager',
        company: 'E-commerce Giant',
        startDate: '2021-03',
        current: true,
        description: 'Led digital marketing campaigns, managed brand strategy, and increased customer acquisition by 40%.'
      },
      {
        title: 'Marketing Executive',
        company: 'Retail Brand',
        startDate: '2018-07',
        endDate: '2021-02',
        description: 'Executed marketing campaigns across digital channels and analyzed campaign performance.'
      }
    ],
    skills: ['Digital Marketing', 'Content Strategy', 'SEO/SEM', 'Google Analytics', 'Brand Management'],
    certifications: [
      {
        name: 'Google Analytics Certification',
        issuer: 'Google',
        issueDate: '2020-11'
      }
    ],
    linkedin: 'https://linkedin.com/in/davidkumar'
  }
}

export const createDemoJobs = async () => {
  try {
    console.log('Creating demo jobs...')
    
    // Get admin user to set as creator
    const adminUser = await User.findOne({ email: 'admin@demo.com' })
    if (!adminUser) {
      throw new Error('Admin user not found. Please run seedDemoUsers first.')
    }
    
    const createdJobs = []
    
    for (const jobData of demoJobs) {
      // Check if job already exists
      const existingJob = await Job.findOne({ 
        title: jobData.title,
        company: jobData.company 
      })
      
      if (existingJob) {
        console.log(`Demo job "${jobData.title}" already exists`)
        createdJobs.push(existingJob)
        continue
      }

      // Create job with createdBy field
      const job = await Job.create({
        ...jobData,
        createdBy: adminUser._id
      })
      createdJobs.push(job)
      console.log(`✅ Created demo job: ${job.title} (${job.jobType})`)
    }
    
    console.log(`Demo jobs creation completed! Created ${createdJobs.length} jobs`)
    return createdJobs
  } catch (error) {
    console.error('Error creating demo jobs:', error)
    throw error
  }
}

export const createDemoProfiles = async () => {
  try {
    console.log('Creating demo applicant profiles...')
    
    const createdProfiles = {}
    
    for (const [email, profileData] of Object.entries(demoProfiles)) {
      const user = await User.findOne({ email })
      if (!user) {
        console.log(`User ${email} not found, skipping profile`)
        continue
      }

      // Check if profile already exists
      const existingProfile = await ApplicantProfile.findOne({ user: user._id })
      if (existingProfile) {
        console.log(`Profile for ${email} already exists`)
        createdProfiles[email] = existingProfile
        continue
      }

      // Create profile
      const profile = await ApplicantProfile.create({
        ...profileData,
        user: user._id
      })
      
      createdProfiles[email] = profile
      console.log(`✅ Created profile for: ${email}`)
    }
    
    console.log('Demo profiles creation completed!')
    return createdProfiles
  } catch (error) {
    console.error('Error creating demo profiles:', error)
    throw error
  }
}

export const createDemoApplications = async () => {
  try {
    console.log('Creating demo applications...')
    
    const users = await User.find({ role: 'Applicant' })
    const jobs = await Job.find({ status: 'active' })
    const profiles = await ApplicantProfile.find()
    
    if (users.length === 0 || jobs.length === 0) {
      console.log('No users or jobs found. Please create demo users and jobs first.')
      return []
    }

    const createdApplications = []
    
    // Application templates
    const applicationTemplates = [
      {
        coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in this position. With my extensive background and proven track record, I am confident I would be a valuable addition to your team.\n\nThroughout my career, I have developed expertise in this field and consistently delivered high-quality results. I am particularly drawn to this opportunity because it aligns perfectly with my career goals and passion for innovation.\n\nI am excited about the possibility of contributing to your team's success and would welcome the opportunity to discuss how my skills can benefit your organization.\n\nThank you for considering my application.\n\nBest regards`,
        whyInterested: `I am particularly excited about this role because it offers the opportunity to work with cutting-edge technologies and contribute to meaningful projects. Your company's commitment to innovation and excellence aligns perfectly with my professional values. I am eager to bring my expertise and collaborative mindset to your team, and I believe this position would provide excellent opportunities for both professional growth and making significant contributions to your organization's success.`,
        availableStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]

    // Create applications for each applicant
    const applicationsToCreate = [
      // John Doe - Technical roles (will be processed by Bot Mimic)
      { userEmail: 'applicant@demo.com', jobTitle: 'Senior Full Stack Developer', status: 'submitted' },
      { userEmail: 'applicant@demo.com', jobTitle: 'DevOps Engineer', status: 'submitted' },
      
      // Sarah Wilson - Technical roles
      { userEmail: 'sarah.wilson@demo.com', jobTitle: 'Frontend React Developer', status: 'submitted' },
      { userEmail: 'sarah.wilson@demo.com', jobTitle: 'Senior Full Stack Developer', status: 'submitted' },
      
      // Michael Chen - Technical roles
      { userEmail: 'michael.chen@demo.com', jobTitle: 'DevOps Engineer', status: 'submitted' },
      { userEmail: 'michael.chen@demo.com', jobTitle: 'Python Backend Developer', status: 'submitted' },
      
      // Emily Rodriguez - Non-technical roles (will be managed by Admin)
      { userEmail: 'emily.rodriguez@demo.com', jobTitle: 'HR Manager', status: 'submitted' },
      { userEmail: 'emily.rodriguez@demo.com', jobTitle: 'Business Analyst', status: 'submitted' },
      
      // David Kumar - Non-technical roles
      { userEmail: 'david.kumar@demo.com', jobTitle: 'Marketing Manager', status: 'submitted' },
      { userEmail: 'david.kumar@demo.com', jobTitle: 'Business Analyst', status: 'submitted' }
    ]

    for (const appData of applicationsToCreate) {
      const user = users.find(u => u.email === appData.userEmail)
      const job = jobs.find(j => j.title === appData.jobTitle)
      
      if (!user || !job) {
        console.log(`Skipping application: User or Job not found`)
        continue
      }

      // Check if application already exists
      const existingApp = await Application.findOne({
        applicant: user._id,
        job: job._id
      })

      if (existingApp) {
        console.log(`Application for ${user.name} to ${job.title} already exists`)
        createdApplications.push(existingApp)
        continue
      }

      const profile = profiles.find(p => p.user.toString() === user._id.toString())
      const template = applicationTemplates[0]

      // Create relevant experience based on user's profile
      let relevantExperience = 'Relevant Experience:\n\n'
      if (profile && profile.experience && profile.experience.length > 0) {
        profile.experience.forEach((exp) => {
          relevantExperience += `${exp.title} at ${exp.company}\n`
          if (exp.startDate) {
            relevantExperience += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
          }
          if (exp.description) {
            relevantExperience += `${exp.description}\n\n`
          }
        })
      }

      // Calculate salary expectation based on job range
      const salaryExpectation = job.salaryRange?.max 
        ? (job.salaryRange.max / 100000).toFixed(1) 
        : '10.0'

      const application = await Application.create({
        job: job._id,
        applicant: user._id,
        profile: profile?._id,
        coverLetter: template.coverLetter,
        whyInterested: template.whyInterested,
        relevantExperience: relevantExperience.trim(),
        availableStartDate: template.availableStartDate,
        salaryExpectation: salaryExpectation,
        resumeUrl: `/uploads/resumes/demo-resume-${user._id}.pdf`,
        status: appData.status,
        appliedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) // Random date within last 10 days
      })

      createdApplications.push(application)
      console.log(`✅ Created application: ${user.name} → ${job.title} (${appData.status})`)
    }
    
    console.log(`Demo applications creation completed! Created ${createdApplications.length} applications`)
    return createdApplications
  } catch (error) {
    console.error('Error creating demo applications:', error)
    throw error
  }
}

// Main seed function
export const seedAllDemoData = async () => {
  try {
    console.log('\n🌱 Starting demo data seeding...\n')
    
    // Import User model to create users first
    const { createDemoUsers } = await import('./seedDemoUsers.js')
    
    // 1. Create users
    console.log('Step 1: Creating users...')
    await createDemoUsers()
    
    // 2. Create jobs
    console.log('\nStep 2: Creating jobs...')
    await createDemoJobs()
    
    // 3. Create profiles
    console.log('\nStep 3: Creating profiles...')
    await createDemoProfiles()
    
    // 4. Create applications
    console.log('\nStep 4: Creating applications...')
    await createDemoApplications()
    
    console.log('\n✅ All demo data seeding completed successfully!\n')
  } catch (error) {
    console.error('\n❌ Error seeding demo data:', error)
    throw error
  }
}
