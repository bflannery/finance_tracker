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
const getPortfolio = (req, res) => {
  const errors = {}
  Portfolio.findOne({ user: req.params.user_id })
    .populate('income')
    .then(portfolio => {
      if (!portfolio) {
        errors.noPortfolio = 'There is no portfolio for this user'
        return res.status(404).json(errors)
      }
      res.json(portfolio)
    })
    .catch(err => {
      errors.noPortfolio = 'There is no portfolio for this user'
      res.status(404).json(errors)
    })
}

const createPortoflio = (req, res) => {
  // Check Validation
  if (!req.body.name) {
    const errors = {}
    errors.name = 'Portfolio name is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  // Get fields
  const portfolioFields = {}
  portfolioFields.user = req.params.user_id
  portfolioFields.name = req.body.name

  // Check for existing portfolio
  Portfolio.findOne({ name: req.body.name })
    .then(portfolio => {
      if (portfolio) {
        errors.handle = 'A portfolio already exists with that name.'
        return res.status(400).json(errors)
      }
      // Save new portfolio
      new Portfolio(portfolioFields)
        .save()
        .then(portfolio => res.json(portfolio))
        .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err))
}

const updatePortfolio = (req, res) => {
  const requestBody = req.body
  // Check Validation
  if (!requestBody.name) {
    const errors = {}
    errors.name = 'Portfolio name is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  // Get fields
  const requestPortolio = {
    ...requestBody,
    lastUpdated: new Date().toISOString()
  }

  Portfolio.findOneAndUpdate(
    { user: req.params.user_id },
    { $set: requestPortolio },
    { new: true }
  )
    .then(portfolio => res.json(portfolio))
    .catch(err => res.status(404).json(err))
}

const deletePortfolio = (req, res) => {
  Portfolio.findByIdAndRemove(req.params.portfolio_id)
    .then(deletedPortfolio => res.status(200).json(deletedPortfolio))
    .catch(err => res.status(404).json(err))
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
