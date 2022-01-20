const mongoose = require('mongoose')

const userProfile = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports.UserProfileModel = mongoose.model('UserProfile', userProfile)
module.exports.UserProfileSchema = userProfile
