import axios from 'axios'
import asyncWrapper from '../utils/asyncWrapper'

import {
  CLEAR_CURRENT_PORTFOLIO,
  INCOME_POST_SUCCESS,
  PORTFOLIO_GET_SUCCESS,
  PORTFOLIO_LOADING,
  SET_ERRORS,
  SET_CURRENT_USER,
  SET_LAST_SAVED_INCOME,
  SET_PORTFOLIO
} from './types'

export const clearCurrentPortfolio = () => ({
  type: CLEAR_CURRENT_PORTFOLIO
})

export const incomePostSucessAction = (income = {}) => ({
  type: INCOME_POST_SUCCESS,
  payload: income
})

export const portfolioGetSuccess = (portfolio = {}) => ({
  type: PORTFOLIO_GET_SUCCESS,
  payload: portfolio
})

export const setErrorsAction = error => ({
  type: SET_ERRORS,
  payload: error
})

export const setLastSavedIncome = (lastSavedIncome = {}) => ({
  type: SET_LAST_SAVED_INCOME,
  payload: { lastSavedIncome }
})

export const setPortfolioLoading = () => ({
  type: PORTFOLIO_LOADING
})

export const setCurrentPortfolio = (portfolio = {}) => ({
  type: SET_PORTFOLIO,
  payload: portfolio
})

export const setCurrentUser = (user = {}) => ({
  type: SET_CURRENT_USER,
  payload: user
})

// Get current portfolio
export const getCurrentPortfolio = portfolioId => async dispatch => {
  dispatch(setPortfolioLoading())
  const { error, response } = await asyncWrapper(
    axios.get(`/api/portfolios/${portfolioId}`)
  )
  if (!error) {
    dispatch(portfolioGetSuccess(response.data))
    return dispatch(setCurrentPortfolio(response.data))
  }
  return dispatch(setErrorsAction(error.response.data))
}

// Create portfolio
export const createPortfolio = (portfolioData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolios/', portfolioData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Account & Portfolio
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    const { error } = await asyncWrapper(axios.delete('/api/portfolio'))
    if (!error) return dispatch(setCurrentUser())
    return dispatch(setErrorsAction(error.response.data))
  }
}

// Add Income
export const addIncome = incomeData => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.post('/api/incomes', incomeData)
  )
  if (!error) {
    dispatch(incomePostSucessAction(response.data))
    return dispatch(setLastSavedIncome(response.data))
  }
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Income
export const deleteIncome = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/incomes/${id}`)
  )
  if (!error) return dispatch(setLastSavedIncome(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Expense
export const addExpense = expenseData => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.post('/api/expenses', expenseData)
  )
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Expense
export const deleteExpense = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/expenses/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Bill
export const addBill = (billData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolio/bills', billData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Bill
export const deleteBill = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/bills/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setErrorsAction(error.response.data))
}
