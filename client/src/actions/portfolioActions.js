import axios from 'axios'
import asyncWrapper from '../utils/asyncWrapper'

import {
  CLEAR_CURRENT_PORTFOLIO,
  SET_PORTFOLIO,
  SET_PORTFOLIOS,
  PORTFOLIO_LOADING,
  SET_ERRORS,
  SET_CURRENT_USER
} from './types'

export const setCurrentUser = (user = {}) => ({
  type: SET_CURRENT_USER,
  payload: user
})

export const setPortfolioLoading = () => ({
  type: PORTFOLIO_LOADING
})

export const setCurrentPortfolio = (portfolio = {}) => ({
  type: SET_PORTFOLIO,
  payload: portfolio
})

export const clearCurrentPortfolio = () => ({
  type: CLEAR_CURRENT_PORTFOLIO
})

export const setErrorsAction = error => ({
  type: SET_ERRORS,
  payload: error
})

// Get current portfolio
export const getCurrentPortfolio = () => async dispatch => {
  dispatch(setPortfolioLoading())
  const { error, response } = await asyncWrapper(axios.get('/api/portfolio'))
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setCurrentPortfolio())
}

// Create portfolio
export const createPortfolio = (portfolioData, history) => async dispatch => {
  const { error } = await asyncWrpper(axios.post('/api/portfolio', portfolioData))
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
export const addIncome = (incomeData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolio/incomes', incomeData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Income
export const deleteIncome = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/incomes/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Expense
export const addExpense = (expenseData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolio/expenses', incomeData)
  )
  if (!error) return history.push('/dashboard')
  return dispatch(setErrorsAction(error.response.data))
}

// Delete Expense
export const deleteIncome = id => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.delete(`/api/portfolio/expenses/${id}`)
  )
  if (!error) return dispatch(setCurrentPortfolio(response.data))
  return dispatch(setErrorsAction(error.response.data))
}

// Add Bill
export const addBill = (billData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/portfolio/bills', incomeData)
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

