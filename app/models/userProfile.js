// Importing required dependencies and modules
const mongoose = require('mongoose')

// Defining the user profile schema
const userProfile = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

// Exporting the user profile model and schema
module.exports.UserProfileModel = mongoose.model('UserProfile', userProfile) // Exporting the user profile model
module.exports.UserProfileSchema = userProfile // Exporting the user profile schema
