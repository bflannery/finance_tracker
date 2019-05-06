const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Income Model
const Income = require('../../models/Income')
const Portfolio = require('../../models/Portfolio')

// Load User Model
const User = require('../../models/User')

// ROUTE METHODS

const getIncome = (req, res) => {
  const errors = {}
  Income.findById(req.params.income_id)
    .then(income => {
      if (!income) {
        errors.noIncomes = 'Income does not exist'
        return res.status(404).json(incomes)
      }
      res.json(income)
    })
    .catch(err => {
      errors.noIncomes = 'Income does not exist'
      res.status(404).json(errors)
    })
}

const getPortfolioIncomes = (req, res) => {
  const errors = {}
  Income.find({ portfolio: req.params.portfolio_id })
    .then(incomes => {
      if (incomes.length === 0) {
        errors.noIncomes = 'There is no incomes for this portfolio'
        return res.status(404).json(errors)
      }
      res.json(incomes)
    })
    .catch(err => {
      errors.noIncomes = 'There is no incomes for this portfolio'
      res.status(404).json(errors)
    })
}

const createPortfolioIncome = (req, res) => {
  const errors = {}
  // Check Validation
  if (!req.body.source) {
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

const updateIncome = (req, res) => {
  const errors = {}
  const reqIncome = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  }
  Income.findOneAndUpdate(
    { _id: req.params.income_id },
    { $set: reqIncome },
    { new: true }
  )
    .then(updatedIncome => res.status(200).json(updatedIncome))
    .catch(err => res.status(404).json(err))
}

const deleteIncome = (req, res) => {
  Income.findByIdAndRemove(req.params.income_id)
    .then(deletedIncome => {
      Portfolio.findById(deletedIncome.portfolio)
        .then(portfolio => {
          const newIncomes = portfolio.incomes.filter(
            income => income === deleteIncome._id
          )
          portfolio.incomes = newIncomes
          portfolio.save()
        })
        .catch(err => res.json(err))
      res.status(200).json(deletedIncome)
    })
    .catch(err => res.status(404).json(err))
}

// @route   GET api/incomes/portfolio_id
// @desc    Get incomes by portoflio id
// @access  Private
router.get(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => getPortfolioIncomes(req, res)
)

// @route   POST api/incomes/portfolio_id
// @desc    Create a new income source and amount
// @access  Private
router.post(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => createPortfolioIncome(req, res)
)

// @route   PUT api/incomes/portfolio_id
// @desc    Update a new income source and amount
// @access  Private
router.put(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateIncome(req, res)
)

// @route   PUT api/incomes/portfolio_id
// @desc    Update a new income source and amount
// @access  Private
router.delete(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteIncome(req, res)
)

module.exports = router
