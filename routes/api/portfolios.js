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

// @route   GET api/portfolio/test
// @desc    Tests portfolio route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'portfolio Works' }))

// @route   GET api/portfolio
// @desc    Get current users portfolio
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {}

    Portfolio.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(portfolio => {
        if (!portfolio) {
          errors.noprofile = 'There is no portfolio for this user'
          return res.status(404).json(errors)
        }
        res.json(portfolio)
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   GET api/portfolio/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {}

  Portfolio.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        return res.status(404).json(errors)
      }

      res.json(profiles)
    })
    .catch(err => res.status(404).json({ portfolio: 'There are no profiles' }))
})

// @route   GET api/portfolio/handle/:handle
// @desc    Get portfolio by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {}

  Portfolio.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(portfolio => {
      if (!portfolio) {
        errors.noprofile = 'There is no portfolio for this user'
        return res.status(404).json(errors)
      }

      res.json(portfolio)
    })
    .catch(err => res.status(404).json(err))
})

// @route   GET api/portfolio/user/:user_id
// @desc    Get portfolio by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Portfolio.findById(req.params.user_id)
    .populate('user', { model: User })
    .then(portfolio => {
      if (!portfolio) {
        errors.noprofile = 'There is no portfolio for this user'
        return res.status(404).json(errors)
      }

      res.json(portfolio)
    })
    .catch(err =>
      res.status(404).json({ portfolio: 'There is no portfolio for this user' })
    )
})

// @route   POST api/portfolio
// @desc    Create or edit user portfolio
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log({
      userId: req.user.id,
      reqBody: req.body
    })

    // Check Validation
    // if (!isValid) {
    //   // Return any errors with 400 status
    //   return res.status(400).json(errors)
    // }

    // Get fields
    const portfolioFields = {}
    portfolioFields.user = req.user.id
    // if (req.body.handle) profileFields.handle = req.body.handle

    // Skills - Spilt into array
    // if (typeof req.body.skills !== 'undefined') {
    //   profileFields.skills = req.body.skills.split(',')
    // }

    Portfolio.findOne({ user: req.user.id })
      .then(portfolio => {
        if (portfolio) {
          Portfolio.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then(portfolio => res.json(portfolio))
            .catch(err => res.status(404).json(err))
        } else {
          new Portfolio(portfolioFields)
            .save()
            .then(profile => res.json(portfolio))
            .catch(err => res.status(404).json(err))
        }
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   POST api/portfolio/experience
// @desc    Add experience to portfolio
// @access  Private
router.post(
  '/experience',
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

// @route   POST api/portfolio/education
// @desc    Add education to portfolio
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    Portfolio.findOne({ user: req.user.id })
      .then(portfolio => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        // Add to exp array
        portfolio.education.unshift(newEdu)

        portfolio.save().then(portfolio => res.json(portfolio))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   DELETE api/portfolio/experience/:exp_id
// @desc    Delete experience from portfolio
// @access  Private
router.delete(
  '/experience/:exp_id',
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

// @route   DELETE api/portfolio/education/:edu_id
// @desc    Delete education from portfolio
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Portfolio.findOne({ user: req.user.id })
      .then(portfolio => {
        // Get remove index
        const removeIndex = portfolio.education
          .map(item => item.id)
          .indexOf(req.params.edu_id)

        // Splice out of array
        portfolio.education.splice(removeIndex, 1)

        // Save
        portfolio.save().then(portfolio => res.json(portfolio))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route   DELETE api/portfolio
// @desc    Delete user and portfolio
// @access  Private
router.delete(
  '/',
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
