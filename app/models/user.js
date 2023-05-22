// Importing required dependencies and modules
const mongoose = require('mongoose')
const { UserProfileSchema } = require('./userProfile.js')

// Defining the user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    userProfile: [UserProfileSchema], // Embedding the UserProfileSchema as an array of user profiles
    token: String
  },
  {
    timestamps: true,
    toObject: {
      // Configuring the transformation of the user object when calling `.toObject`
      transform: (_doc, user) => {
        delete user.hashedPassword // Removing the `hashedPassword` field from the transformed user object
        return user
      }
    }
  }
)

// Exporting the user model
module.exports = mongoose.model('User', userSchema)
