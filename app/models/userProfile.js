const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
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

module.exports = mongoose.model('UserProfile', userProfileSchema)
