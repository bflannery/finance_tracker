const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

// Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load User Model
const User = require('../../models/User')

const registerUser = async (req, res) => {
  try {
    // Validate registration fields
    const { errors, isValid } = validateRegisterInput(req.body)
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
    // Create new user instance
    const newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar
    }).save()
    // Return success with new user
    return res.status(200).json(newUser)
  } catch (err) {
    // Return errors
    return res.status(400).json(err)
  }
}

const loginUser = async (req, res) => {
  try {
    // Validate login fields
    const { errors, isValid } = validateLoginInput(req.body)
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

// @route   POST api/users/register
// @desc    Register users route
// @access  Public
router.post('/register', (req, res) => registerUser(req, res))

// @route   POST api/users/register
// @desc    Log users in route
// @access  Public
router.post('/login', (req, res) => loginUser(req, res))

module.exports = router
