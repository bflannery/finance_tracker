const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// Load Income Model
const Income = require('../../models/Income')
// Load Portoflio Model
const Portfolio = require('../../models/Portfolio')

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
    // Get fields
    const incomeFields = {}
    incomeFields.portfolio = req.body.portfolioId
    incomeFields.source = req.body.source
    incomeFields.amount = req.body.amount
    // Save new income
    const newIncome = await new Income(incomeFields)
    // Get user portfolio
    const portfolio = await Portfolio.findById(req.body.portfolioId)
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

const getIncomes = async (req, res) => {
  const errors = {}
  try {
    // Get all incomes
    const incomes = await Income.find()
    // Check if incomes exist
    if (incomes.length === 0) {
      errors.noIncomes = 'There is no incomes'
      return res.status(404).json(errors)
    }
    // Return suceess with incomes
    res.status(200).json(incomes)
  } catch (err) {
    // Return errors
    res.status(404).json(err)
  }
}

const getIncome = async (req, res) => {
  const errors = {}
  try {
    const income = await Income.findById(req.params.income_id)
    if (!income) {
      errors.noIncome = 'Income does not exist'
      return res.status(404).json(errors)
    }
    res.status(200).json(income)
  } catch (err) {
    res.status(404).json(err)
  }
}

const updateIncome = async (req, res) => {
  try {
    // Update income instance
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.income_id,
      { $set: req.body },
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
    portfolio.incomes = portfolio.incomes.id(deleteIncome._id).remove()
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

// @route   GET api/incomes/
// @desc    Get incomes
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  getIncomes(req, res)
)

// @route   GET api/incomes/:income_id
// @desc    Get income by income id
// @access  Private
router.get(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => getIncome(req, res)
)

// @route   PUT api/incomes/:income_id
// @desc    Update an existing income
// @access  Private
router.put(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateIncome(req, res)
)

// @route   DELETE api/incomes/:income_id
// @desc    Delete an existing income
// @access  Private
router.delete(
  '/:income_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteIncome(req, res)
)

module.exports = router
