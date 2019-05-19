import axios from 'axios'
import asyncWrapper from '../utils/asyncWrapper'

import {
  CLEAR_SELECTED_PORTFOLIO,
  EXPENSE_POST_SUCCESS,
  INCOME_POST_SUCCESS,
  PORTFOLIO_GET_SUCCESS,
  PORTFOLIO_LOADING,
  SET_ERRORS,
  SET_CURRENT_USER,
  SET_LAST_SAVED_INCOME,
  SET_LAST_SAVED_EXPENSE,
  SET_PORTFOLIO
} from './types'

export const clearCurrentPortfolio = () => ({
  type: CLEAR_SELECTED_PORTFOLIO
})

export const incomePostSucessAction = (income = {}) => ({
  type: INCOME_POST_SUCCESS,
  payload: income
})

export const expensePostSucessAction = (expense = {}) => ({
  type: EXPENSE_POST_SUCCESS,
  payload: expense
})

export const portfolioGetSuccessAction = (portfolio = {}) => ({
  type: PORTFOLIO_GET_SUCCESS,
  payload: portfolio
})

export const setErrorsAction = error => ({
  type: SET_ERRORS,
  payload: error
})

export const setLastSavedIncomeAction = (lastSavedIncome = {}) => ({
  type: SET_LAST_SAVED_INCOME,
  payload: { lastSavedIncome }
})

export const setLastSavedExpenseAction = (lastSavedExpense = {}) => ({
  type: SET_LAST_SAVED_EXPENSE,
  payload: { lastSavedExpense }
})

export const setPortfolioLoadingAction = () => ({
  type: PORTFOLIO_LOADING
})

export const setCurrentPortfolioAction = (portfolio = {}) => ({
  type: SET_PORTFOLIO,
  payload: portfolio
})

export const setCurrentUserAction = (user = {}) => ({
  type: SET_CURRENT_USER,
  payload: user
})

// Get current portfolio
export const getCurrentPortfolioAction = portfolioId => async dispatch => {
  dispatch(setPortfolioLoadingAction())
  const { error, response } = await asyncWrapper(
    axios.get(`/api/portfolios/${portfolioId}`)
  )
  if (!error) {
    dispatch(portfolioGetSuccessAction(response.data))
    return dispatch(setCurrentPortfolioAction(response.data))
  }
  return dispatch(setErrorsAction(error.response.data))
}

// Create portfolio
export const createPortfolioAction = (
  portfolioData,
  history
) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolios/', portfolioData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Account & Portfolio
export const deleteAccountAction = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    const { error } = await asyncWrapper(axios.delete('/api/portfolio'))
    if (!error) return dispatch(setCurrentUserAction())
    return dispatch(setErrorsAction(error.response.data))
  }
}

// Add Income
export const addIncomeAction = incomeData => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.post('/api/incomes', incomeData)
  )
  if (!error) {
    dispatch(incomePostSucessAction(response.data))
    return dispatch(setLastSavedIncomeAction(response.data))
  }
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Income
export const deleteIncomeAction = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/incomes/${id}`)
  )
  if (!error) return dispatch(setLastSavedIncomeAction(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Expense
export const addExpenseAction = expenseData => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.post('/api/expenses', expenseData)
  )
  if (!error) {
    dispatch(expensePostSucessAction(response.data))
    return dispatch(setLastSavedExpenseAction(response.data))
  }
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Expense
export const deleteExpenseAction = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/expenses/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolioAction(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Bill
export const addBillAction = (billData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolio/bills', billData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Bill
export const deleteBillAction = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/bills/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolioAction(response.data))
  return dispatch(setErrorsAction(error.response.data))
}
