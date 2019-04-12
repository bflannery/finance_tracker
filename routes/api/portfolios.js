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

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/:user_id', (req, res) => {
  const errors = {}
  console.log({
    userId: req.params.user_id
  })
  Portfolio.findOne({ user: req.params.user_id })
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
})

// @route   POST api/portfolios/user_id
// @desc    Create a portfolio
// @access  Private
router.post(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log({
      userId: req.user.id,
      paramsId: req.params.user_id,
      reqBody: req.body
    })

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
)

// @route   PUT api/portfolios/user_id
// @desc    Update a portfolio
// @access  Private
router.put(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
    if (req.body.name) portfolioFields.name = req.body.name

    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { $set: portfolioFields },
      { new: true }
    )
      .then(portfolio => res.json(portfolio))
      .catch(err => res.status(404).json(err))
  }
)

// @route   POST api/portfolio/user_id/income
// @desc    Add experience to portfolio
// @access  Private
router.post(
  '/:user_id/income',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    Portfolio.findOne({ user: req.user.id })
      .then(portfolio => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        // Add to exp array
        portfolio.experience.unshift(newExp)

        portfolio
          .save()
          .then(portfolio => res.json(portfolio))
          .catch(err => res.status(404).json(err))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   DELETE api/portfolio/user_id/income
// @desc    Delete experience from portfolio
// @access  Private
router.delete(
  '/:user_id/income',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Portfolio.findOne({ user: req.user.id })
      .then(portfolio => {
        // Get remove index
        const removeIndex = portfolio.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id)

        // Splice out of array
        portfolio.experience.splice(removeIndex, 1)

        // Save
        portfolio.save().then(portfolio => res.json(portfolio))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   DELETE api/portfolio/user_id
// @desc    Delete portfolio and user account
// @access  Private
router.delete(
  '/:user_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Portfolio.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      )
    })
  }
)

module.exports = router
