const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Income Model
const Expense = require('../../models/Expense')
const Portfolio = require('../../models/Portfolio')

// Load User Model
const User = require('../../models/User')

// ROUTE METHODS
const getPortfolioExpenses = async (req, res) => {
  const errors = {}
  try {
    const expenses = await Expense.find({ portfolio: req.params.portfolio_id })
    if (expenses.length === 0) {
      errors.noExpenses = 'There is no expenses for this portfolio'
      return res.status(404).json(errors)
    }
    res.status(200).json(expenses)
  } catch (err) {
    res.status(404).json(err)
  }
}

const createPortfolioExpense = async (req, res) => {
  const errors = {}
  // Check Validation
  if (!req.body.source) {
    errors.name = 'Expense source name is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  try {
    // Get fields
    const expenseFields = {}
    expenseFields.portfolio = req.params.portfolio_id
    expenseFields.source = req.body.source
    expenseFields.amount = req.body.amount

    const existingExpense = await Expense.findOne({ source: req.body.source })
    if (existingExpense) {
      errors.source = 'An Expense source already exists with that name.'
      return res.status(400).json(errors)
    }
    // Save new expense
    const newExpense = await new Expense(expenseFields).save()
    // Get user portfolio
    const portfolio = await Portfolio.findById(req.params.portfolio_id)
    // Add expense to portfolio
    portfolio.expenses.push(newExpense)
    // Save portfolio
    portfolio.save()
    // Return success with new income
    return res.status(200).json(newExpense)
  } catch (err) {
    res.status(404).json(err)
  }
}

const updateExpense = async (req, res) => {
  try {
    // Update expense timestamp
    const reqExpense = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    }
    // Update expense instance
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.expense_id },
      { $set: reqExpense },
      { new: true }
    )
    // Return sucess with newly updated income
    res.status(200).json(updatedExpense)
  } catch (err) {
    res.status(404).json(err)
  }
}

const deleteIncome = async (req, res) => {
  try {
    // Delete expense
    const deletedExpense = await Expense.findByIdAndRemove(
      req.params.expense_id
    )
    // Get Portoflio
    const portfolio = await Portfolio.findById(deletedExpense.portfolio)
    // Remove expense from portoflio expenses array
    portfolio.expenses = portfolio.expenses.filter(
      id => id === deletedExpense._id
    )
    // Save portfolio
    await portfolio.save()
    // Return success with deleted expense
    return res.status(200).json(deletedExpense)
  } catch (err) {
    return res.status(404).json(err)
  }
}

// @route   GET api/expenses/portfolio_id
// @desc    Get expenses by portoflio id
// @access  Private
router.get(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => getPortfolioExpenses(req, res)
)

// @route   POST api/expenses/portfolio_id
// @desc    Create a new expense and add it to user portfolio
// @access  Private
router.post(
  '/:portfolio_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => createPortfolioExpense(req, res)
)

// @route   PUT api/expenses/portfolio_id
// @desc    Update an existing expense
// @access  Private
router.put(
  '/:expense_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateExpense(req, res)
)

// @route   DELETE api/expenses/portfolio_id
// @desc    delete an expense and remove it from user portfolio
// @access  Private
router.delete(
  '/:expenses_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteExpense(req, res)
)

module.exports = router
