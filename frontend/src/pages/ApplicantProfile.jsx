import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, User, Briefcase, GraduationCap, Award, MapPin, Phone, Mail, CheckCircle, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, updateProfile } from '../services/profile'

export default function ApplicantProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  const [profile, setProfile] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    
    // Professional Summary
    summary: '',
    
    // Education
    education: [{
      degree: '',
      institution: '',
      year: '',
      field: ''
    }],
    
    // Experience
    experience: [{
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    
    // Skills
    skills: [],
    
    // Social Links
    linkedin: '',
    github: '',
    portfolio: ''
  })
  
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await getProfile()
      if (response.success && response.profile) {
        setProfile({
          ...profile,
          ...response.profile,
          fullName: response.profile.fullName || user?.name || '',
          email: response.profile.email || user?.email || ''
        })
      } else {
        // Set default values from user
        setProfile(prev => ({
          ...prev,
          fullName: user?.name || '',
          email: user?.email || ''
        }))
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      // Set default values from user even on error
      setProfile(prev => ({
        ...prev,
        fullName: user?.name || '',
        email: user?.email || ''
      }))
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletionPercentage = () => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.summary,
      profile.education[0]?.degree,
      profile.experience[0]?.title,
      profile.skills.length > 0
    ]
    
    const completed = fields.filter(field => field).length
    return Math.round((completed / fields.length) * 100)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...profile.education]
    newEducation[index][field] = value
    setProfile(prev => ({
      ...prev,
      education: newEducation
    }))
  }

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', field: '' }]
    }))
  }

  const removeEducation = (index) => {
    if (profile.education.length > 1) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }))
    }
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...profile.experience]
    newExperience[index][field] = value
    setProfile(prev => ({
      ...prev,
      experience: newExperience
    }))
  }

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { 
        title: '', 
        company: '', 
        startDate: '', 
        endDate: '', 
        current: false, 
        description: '' 
      }]
    }))
  }

  const removeExperience = (index) => {
    if (profile.experience.length > 1) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await updateProfile(profile)
      if (response.success) {
        setSuccess('Profile updated successfully!')
        setShowSuccessPopup(true)
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false)
        }, 3000)
        
        // Clear success message after fade out
        setTimeout(() => {
          setSuccess('')
        }, 3500)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const fillDemoData = () => {
    setProfile({
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      dateOfBirth: '1995-05-15',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable web applications and solving complex problems. Strong background in JavaScript, React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions in fast-paced environments.',
      education: [{
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2017',
        field: 'Computer Science'
      }, {
        degree: 'Master of Science in Software Engineering',
        institution: 'Stanford University',
        year: '2019',
        field: 'Software Engineering'
      }],
      experience: [{
        title: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        startDate: '2021-06',
        endDate: '',
        current: true,
        description: 'Leading development of microservices architecture. Mentoring junior developers and conducting code reviews. Implementing CI/CD pipelines and improving system performance.'
      }, {
        title: 'Software Engineer',
        company: 'StartUp Solutions',
        startDate: '2019-01',
        endDate: '2021-05',
        current: false,
        description: 'Developed and maintained full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver features on time.'
      }],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
      linkedin: 'https://linkedin.com/in/johnsmith',
      github: 'https://github.com/johnsmith',
      portfolio: 'https://johnsmith.dev'
    })
    setSuccess('Demo data loaded! You can now edit or save.')
  }

  const skipSection = (section) => {
    // User can skip optional sections, profile will still be valid with required fields
    setSuccess(`${section} section skipped. You can add it later.`)
    setTimeout(() => setSuccess(''), 2000)
  }

  const completionPercentage = calculateCompletionPercentage()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Success Popup Notification */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white rounded-lg shadow-2xl border border-green-200 overflow-hidden max-w-md">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Success!</h3>
                    <p className="text-green-50 text-sm">Profile saved successfully</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-green-50">
              <p className="text-sm text-green-800">
                Your profile information has been updated and saved.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <button
            type="button"
            onClick={fillDemoData}
            className="px-4 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            Fill Demo Data
          </button>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
            <span className="text-2xl font-bold text-indigo-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          {completionPercentage < 100 && (
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to apply for jobs. Fill in all required fields to reach 100%.
            </p>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-green-700 text-sm font-medium">{success}</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-700 text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={profile.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={profile.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City, State/Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About You *
              </label>
              <textarea
                name="summary"
                required
                rows={4}
                value={profile.summary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a brief summary about your professional background and career objectives..."
              />
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Education
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                      </label>
                      <input
                        type="text"
                        required
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="University/College name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2023"
                      />
                    </div>
                  </div>
                  {profile.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      />
                      <label className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">Currently working here</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                  {profile.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            </div>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a skill (e.g., React, Python, Project Management)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-indigo-600 hover:text-indigo-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Social Links (Optional)</h3>
              <button
                type="button"
                onClick={() => skipSection('Social Links')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip this section
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={profile.github}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={profile.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}