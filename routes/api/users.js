const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const isEmpty = require('lodash').isEmpty

// Import User Validation
const validateUser = require('../../validation/users')

// Import User Model
const User = require('../../models/User')

// Import Portoflio Model
const Portfolio = require('../../models/Portfolio')

// @func    registerUser
// @desc    Register a user. Returns 200 response with new user
// @param   req - request
// @param   res - response
const registerUser = async (req, res) => {
  try {
    // Validate registration fields
    const { errors, isValid } = validateUser.validateRegisterRequest(req.body)
    console.log({ isValid })
    // Return errors if registration is invalid
    if (!isValid) {
      return res.status(400).json(errors)
    }
    // Get user with request email
    const user = await User.findOne({ email: req.body.email })
    // If user exists, return errors
    if (user) {
      return res.status(400).json({ email: 'Email already exists' })
    }
    // Config user avatar
    const avatar = gravatar.url(req.body.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm' // Default
    })
    // Hash and salt user password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // Create new user portfolio instance
    const newPortfolio = await new Portfolio({
      name: `${req.body.name}'s Portfolio`
    }).save()

    // Create new user instance
    const newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      portfolios: [newPortfolio],
      avatar
    }).save()

    // Return success with new user
    return res.status(200).json(newUser)
  } catch (err) {
    // Return errors
    return res.status(400).json(err)
  }
}

// @func    loginUser
// @desc    Log a user in to app. Returns 200 response with session token
// @param   req - request
// @param   res - response
const loginUser = async (req, res) => {
  try {
    // Validate login fields
    const { errors, isValid } = validateUser.validateLoginRequest(req.body)
    // Return errors if login fields are invalid
    if (!isValid) {
      return res.status(400).json(errors)
    }
    // Find user by email
    const user = await User.findOne({ email: req.body.email })
    // Check for the user
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    // Return errors if passwords don't match
    if (!isMatch) {
      errors.password = 'Password incorrect'
      return res.status(400).json(errors)
    }
    // User login payload
    const userPayload = {
      id: user.id,
      name: user.name,
      avatar: user.avatar
    }
    // Get JWT
    const token = await jwt.sign(userPayload, keys.secretKey, {
      expiresIn: 3600
    })
    // Success response payload
    responsePayload = {
      success: true,
      token: 'Bearer ' + token
    }
    // Return success with token payload
    return res.status(200).json(responsePayload)
  } catch (err) {
    return res.status(400).json(err)
  }
}

// @func    updateUser
// @desc    Update a users info. Returns 200 response with updated user
// @param   req - request
// @param   res - response
const updateUser = async (req, res) => {
  try {
    // Validate request
    const { errors, isValid } = validateUser.validateUpdateRequest(req.body)
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }
    // Update portfolio timestamp
    const requestUser = {
      ...requestBody,
      lastUpdated: new Date().toISOString()
    }
    // Find and update portfolio
    const updatedPortfolio = Portfolio.findOneAndUpdate(
      { user: req.params.user_id },
      { $set: requestPortolio },
      { new: true }
    )
    // Return success with updated portfolio
    return res.status(200).json(updatedPortfolio)
  } catch (err) {
    // Return errors
    res.status(404).json(err)
  }
}

const deleteUser = async (req, res) => {
  try {
    // Delete User
    const deletedUser = await User.findByIdAndRemove(req.params.user_id)
    // Return success response with deleted User
    return res.status(200).json(deletedUser)
  } catch (err) {
    res.status(404).json(err)
  }
}

// @route   POST api/users/register
// @desc    Register users route
// @access  Public
router.post('/register', (req, res) => registerUser(req, res))

// @route   POST api/users/login
// @desc    Login a user
// @access  Public
router.post('/login', (req, res) => loginUser(req, res))

// @route   PUT api/users/:user_id
// @desc    Update a user
// @access  Public
router.put(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateUser(req, res)
)

// @route   DELETE api/users/register
// @desc    Log users in route
// @access  Public
router.delete(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteUser(req, res)
)

module.exports = router
