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
const createIncome = async (req, res) => {
  const errors = {}
  // Check Validation
  if (!req.body.source) {
    errors.name = 'Income source is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  try {
    const existingIncome = await Income.findOne({ source: req.body.source })
    if (existingIncome) {
      errors.source = 'An income source already exists with that name.'
      return res.status(400).json(errors)
    }

    // Get fields
    const incomeFields = {}
    incomeFields.portfolio = req.body.portfolioId
    incomeFields.source = req.body.source
    incomeFields.amount = req.body.amount

    // Get user portfolio
    const portfolio = await Portfolio.findById(req.body.portfolioId)

    // Save new income
    const newIncome = await new Income(incomeFields)

    // Add income to portfolio
    portfolio.incomes.push(newIncome)
    // Save portfolio
    portfolio.save()
    // Return success with new income
    return res.status(200).json(newIncome)
  } catch (err) {
    res.status(404).json(err)
  }
}

const getPortfolioIncomes = async (req, res) => {
  const errors = {}
  try {
    const incomes = await Income.find({ portfolio: req.params.portfolio_id })
    if (incomes.length === 0) {
      errors.noIncomes = 'There is no incomes for this portfolio'
      return res.status(404).json(errors)
    }
    res.status(200).json(incomes)
  } catch (err) {
    res.status(404).json(err)
  }
}

const updateIncome = async (req, res) => {
  try {
    // Update income timestamp
    const reqIncome = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    }
    // Update income instance
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.income_id },
      { $set: reqIncome },
      { new: true }
    )
    // Return sucess with newly updated income
    res.status(200).json(updatedIncome)
  } catch (err) {
    res.status(404).json(err)
  }
}

const deleteIncome = async (req, res) => {
  try {
    // Delete income
    const deletedIncome = await Income.findByIdAndRemove(req.params.income_id)
    // Get Portoflio
    const portfolio = await Portfolio.findById(deletedIncome.portfolio)
    // Remove income from portoflio incomes array
    portfolio.incomes = portfolio.incomes.filter(id => id === deleteIncome._id)
    // Save portfolio
    await portfolio.save()
    // Return success with deleted income
    return res.status(200).json(deletedIncome)
  } catch (err) {
    return res.status(404).json(err)
  }
}

// @route   POST api/incomes/
// @desc    Create a new income
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  createIncome(req, res)
)

// @route   GET api/incomes/:income_id
// @desc    Get incomes by income id
// @access  Private
router.get(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => getPortfolioIncomes(req, res)
)

// @route   PUT api/incomes/:income_id
// @desc    Update an existign income
// @access  Private
router.put(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateIncome(req, res)
)

// @route   PUT api/incomes/:income_id
// @desc    Update an existing income
// @access  Private
router.delete(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteIncome(req, res)
)

module.exports = router
