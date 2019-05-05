const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Income Model
const Income = require('../../models/Income')
const Portfolio = require('../../models/Portfolio')

// Load User Model
const User = require('../../models/User')

// @route   POST api/incomes/portfolio_id
// @desc    Create a new income source and amount
// @access  Private
router.post(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log({
      portfolioId: req.params.portfolio_id,
      reqBody: req.body
    })
    // Check Validation
    if (!req.body.source) {
      const errors = {}
      errors.name = 'Income source is required'
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    // Get fields
    const incomeFields = {}
    incomeFields.portfolio = req.params.portfolio_id
    incomeFields.source = req.body.source
    incomeFields.amount = req.body.amount

    Income.findOne({ source: req.body.source })
      .then(income => {
        if (income) {
          errors.source = 'An income source already exists with that name.'
          return res.status(400).json(errors)
        }

        // Save new income
        new Income(incomeFields)
          .save()
          .then(income => {
            Portfolio.findById(req.params.portfolio_id)
              .then(portfolio => {
                portfolio.income.push(income)
                portfolio.save()
              })
              .catch(err => res.json(err))
            return res.status(200).json(income)
          })
          .catch(err => res.status(404).json(err))
      })
      .catch(err => res.status(404).json(err))
  }
)

module.exports = router
