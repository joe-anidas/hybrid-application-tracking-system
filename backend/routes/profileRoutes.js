import express from 'express'
import ApplicantProfile from '../models/ApplicantProfile.js'
import { authenticateToken } from '../middleware/auth.js'
import { createAuditLog, getClientIp } from '../utils/auditLogger.js'

const router = express.Router()

// Get applicant profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is applicant
    if (req.user.role !== 'Applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can access profiles'
      })
    }

    const profile = await ApplicantProfile.findOne({ user: req.user.id })
    
    if (!profile) {
      return res.json({
        success: true,
        profile: null
      })
    }

    res.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Create or update applicant profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is applicant
    if (req.user.role !== 'Applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can update profiles'
      })
    }

    const {
      fullName,
      email,
      phone,
      location,
      dateOfBirth,
      summary,
      education,
      experience,
      skills,
      linkedin,
      github,
      portfolio
    } = req.body

    // Validate required fields
    if (!fullName || !email || !phone || !location || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Find existing profile or create new one
    let profile = await ApplicantProfile.findOne({ user: req.user.id })
    let isNewProfile = !profile

    if (profile) {
      // Update existing profile
      profile.fullName = fullName
      profile.email = email
      profile.phone = phone
      profile.location = location
      profile.dateOfBirth = dateOfBirth
      profile.summary = summary
      profile.education = education || []
      profile.experience = experience || []
      profile.skills = skills || []
      profile.linkedin = linkedin
      profile.github = github
      profile.portfolio = portfolio
      
      await profile.save()
    } else {
      // Create new profile
      profile = new ApplicantProfile({
        user: req.user.id,
        fullName,
        email,
        phone,
        location,
        dateOfBirth,
        summary,
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        linkedin,
        github,
        portfolio
      })
      
      await profile.save()
    }

    // Create audit log
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: 'Applicant',
      action: isNewProfile ? 'PROFILE_CREATED' : 'PROFILE_UPDATED',
      actionDescription: isNewProfile 
        ? `${req.user.name} (Applicant) created their profile`
        : `${req.user.name} (Applicant) updated their profile`,
      targetType: 'Profile',
      targetId: profile._id,
      targetName: fullName,
      ipAddress: getClientIp(req),
      metadata: {
        fullName,
        location,
        skillsCount: skills?.length || 0,
        experienceCount: experience?.length || 0,
        educationCount: education?.length || 0
      }
    })

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router