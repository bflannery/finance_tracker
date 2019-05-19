const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Expense Model
const Expense = require('../../models/Expense')
// Load Portfolio Model
const Portfolio = require('../../models/Portfolio')

// ROUTE METHODS
const createExpense = async (req, res) => {
  const errors = {}
  // Check Validation
  if (!req.body.name) {
    errors.name = 'Expense name is required'
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  try {
    // Get expense fields
    const expenseFields = {}
    expenseFields.portfolio = req.body.portfolioId
    expenseFields.name = req.body.name
    expenseFields.amount = req.body.amount

    // Save new expense
    const newExpense = await new Expense(expenseFields).save()
    // Get user portfolio
    const portfolio = await Portfolio.findById(req.body.portfolioId)
    // Add income to portfolio
    portfolio.expenses.push(newExpense)
    // Save portfolio
    portfolio.save()
    // Return success with new income
    return res.status(200).json(newExpense)
  } catch (err) {
    res.status(404).json(err)
  }
}

const getExpenses = async (req, res) => {
  const errors = {}
  try {
    // Get all expenses
    const expenses = await Expense.find()
    // Check if expenses exist
    if (expenses.length === 0) {
      errors.noExepenses = 'There is no expenses'
      return res.status(404).json(errors)
    }
    // Return suceess with incomes
    res.status(200).json(incomes)
  } catch (err) {
    // Return errors
    res.status(404).json(err)
  }
}

const getExpense = async (req, res) => {
  const errors = {}
  try {
    const expense = await Expense.findById(req.params.expense_id)
    if (!expense) {
      errors.noExpense = 'Expense does not exist'
      return res.status(404).json(errors)
    }
    res.status(200).json(expense)
  } catch (err) {
    res.status(404).json(err)
  }
}

const updateExpense = async (req, res) => {
  try {
    // Update expense instance
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.expense_id,
      { $set: req.body },
      { new: true }
    )
    // Return sucess with newly updated expense
    res.status(200).json(updatedExpense)
  } catch (err) {
    res.status(404).json(err)
  }
}

const deleteExpense = async (req, res) => {
  try {
    // Delete expense
    const deletedExpense = await Expense.findByIdAndRemove(
      req.params.expense_id
    )
    // Get Portoflio
    const portfolio = await Portfolio.findById(deletedExpense.portfolio)
    // Remove expense from portoflio expenses array
    portfolio.incomes = portfolio.incomes.filter(id => id === deleteIncome._id)
    // Save portfolio
    await portfolio.save()
    // Return success with deleted expense
    return res.status(200).json(deletedExpense)
  } catch (err) {
    return res.status(404).json(err)
  }
}

// @route   POST api/expenses/
// @desc    Create a new expense
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  createExpense(req, res)
)

// @route   GET api/expenses/
// @desc    Get expenses
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  getExpenses(req, res)
)

// @route   GET api/expenses/:expense_id
// @desc    Get expense by expense id
// @access  Private
router.get(
  '/:expense_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => getExpense(req, res)
)

// @route   PUT api/expenses/:expense_id
// @desc    Update an existing expense
// @access  Private
router.put(
  '/:expense_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => updateExpense(req, res)
)

// @route   DELETE api/expenses/:expense_id
// @desc    Delete an existing expense
// @access  Private
router.delete(
  '/:expense_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => deleteExpense(req, res)
)

module.exports = router
