import mongoose from 'mongoose'

const botMimicSettingsSchema = new mongoose.Schema({
  // Single document to store global bot settings
  autoProcessEnabled: {
    type: Boolean,
    default: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedByName: {
    type: String
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  processingInterval: {
    type: Number,
    default: 30000 // 30 seconds in milliseconds
  }
}, {
  timestamps: true
})

// Ensure only one settings document exists
botMimicSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

botMimicSettingsSchema.statics.updateSettings = async function(updates, modifiedBy) {
  const settings = await this.getSettings()
  Object.assign(settings, updates)
  if (modifiedBy) {
    settings.lastModifiedBy = modifiedBy.userId
    settings.lastModifiedByName = modifiedBy.userName
  }
  settings.lastModifiedAt = new Date()
  await settings.save()
  return settings
}

export default mongoose.model('BotMimicSettings', botMimicSettingsSchema)
