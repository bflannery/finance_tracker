const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation
// const validateProfileInput = require('../../validation/portfolio')

// Load Portfolio Model
const Portfolio = require('../../models/Portfolio')

// Load User Model
const User = require('../../models/User')

// ROUTE METHODS
const getPortfolio = async (req, res) => {
  const errors = {}
  try {
    // Get inflated portfolio
    const portfolio = await Portfolio.findOne({
      user: req.params.user_id
    }).populate('income')
    // Check if portfolio exists
    if (!portfolio) {
      errors.noPortfolio = 'There is no portfolio for this user'
      return res.status(404).json(errors)
    }
    // Return suceess with portfolio
    res.status(200).json(portfolio)
  } catch (err) {
    // Return errors
    res.status(404).json(err)
  }
}

const createPortoflio = async (req, res) => {
  const errors = {}
  // Check validation
  if (!req.body.name) {
    errors.name = 'Portfolio name is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  try {
    // Get require portfolio fields from request
    const portfolioFields = {}
    portfolioFields.user = req.params.user_id
    portfolioFields.name = req.body.name
    // Get portfolio
    const portfolio = await Portfolio.findOne({ name: req.body.name })
    // Check for existing portfolio with same name
    if (portfolio) {
      errors.handle = 'A portfolio already exists with that name.'
      return res.status(400).json(errors)
    }
    // Create new portoflio
    const newPortoflio = await new Portfolio(portfolioFields).save()
    return res.status(200).json(newPortoflio)
  } catch (err) {
    // Return errors
    return res.status(404).json(err)
  }
}

const updatePortfolio = async (req, res) => {
  const errors = {}
  try {
    const requestBody = req.body
    // Check Validation
    if (!requestBody.name) {
      errors.name = 'Portfolio name is required'
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }
    // Update portfolio timestamp
    const requestPortolio = {
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

const deletePortfolio = async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndRemove(
      req.params.portfolio_id
    )
    return res.status(200).json(deletedPortfolio)
  } catch (err) {
    res.status(404).json(err)
  }
}

// ROUTES

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/:user_id', (req, res) => getPortfolio(req, res))

// @route   POST api/portfolios/user_id
// @desc    Create a portfolio
// @access  Private
router.post(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => createPortoflio(req, res)
)

// @route   PUT api/portfolios/user_id
// @desc    Update a portfolio
// @access  Private
router.put(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updatePortfolio(req, res)
)

// @route   DELETE api/portfolio/user_id
// @desc    Delete portfolio and user account
// @access  Private
router.delete(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deletePortfolio(req, res)
)

module.exports = router
