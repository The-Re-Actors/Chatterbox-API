// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for profiles
const { UserProfileModel } = require('../models/userProfile')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existent document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /profiles
router.get('/profile', requireToken, (req, res, next) => {
  UserProfileModel.find()
    // respond with status 200 and JSON of the profiles
    .then(profile => res.status(200).json({ profile }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /profiles/5a7db6c74d55bc51bdf39793
router.get('/profile/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  UserProfileModel.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "profile" JSON
    .then(userProfile => res.status(200).json({ userProfile: userProfile.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /profile
router.post('/profile/create', requireToken, (req, res, next) => {
  // set owner of new profile to be current user
  //   req.body.userProfile.owner = req.user.id
  //   let profile
  req.body.userProfile.owner = req.user.id
  let profile
  console.log(req.body)
  UserProfileModel.create(req.body.userProfile)
    .then(handle404)
    .then((userProfile) => {
      profile = userProfile
      res.status(201).json({ userProfile })
    })
    .then(() => User.findById(req.user.id))
    .then(handle404)
    .then((user) => {
      user.userProfile.push(profile)
      return user.save()
    })
  // if an error occurs, pass it off to our error handler
  // the error handler needs the error message and the `res` object so that it
  // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /profiles/5a7db6c74d55bc51bdf39793
router.patch('/profile/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair

  delete req.body.userProfile.owner

  User.findById(req.body.userId)
    .then(handle404)
    .then(user => {
      const profileUpdate = user.userProfile.id(req.params.id)
      profileUpdate.set(req.body.userProfile)
      return user.save()
    })
    .then(user => res.status(201).json({ user }))
    .catch(next)

  // UserProfileModel.findById(req.params.id)
  //   .then(handle404)
  //   .then(profile => {
  //     // pass the `req` object and the Mongoose record to `requireOwnership`
  //     // it will throw an error if the current user isn't the owner
  //     requireOwnership(req, profile)

  //     // pass the result of Mongoose's `.update` to the next `.then`
  //     profile.updateOne(req.body.userProfile)
  //     return profile.save()
  //   })
  //   .then(() => UserProfileModel.findById(req.params.id))
    // if that succeeded, return 204 and no JSON
    // .then((userProfile) => res.status(201).json({ userProfile }))
    // // if an error occurs, pass it to the handler
    // .catch(next)
})

// DESTROY
// DELETE /profiles/5a7db6c74d55bc51bdf39793
router.delete('/profile/:id', requireToken, (req, res, next) => {
  UserProfileModel.findById(req.params.id)
    .then(handle404)
    .then(profile => {
      const userId = profile.owner
      console.log('profile ', profile)
      // throw an error if current user doesn't own `profile`
      requireOwnership(req, profile)
      // delete the profile ONLY IF the above didn't throw
      profile.deleteOne()
      return userId
    })
    .then((userId) => User.findById(userId))
    .then(user => {
      console.log('user ', user)
      user.userProfile.pull(req.params.id)
      return user.save()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})


module.exports = router
