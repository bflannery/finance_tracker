import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorsReducer from './errorsReducer'
import portfoliosReducer from './portfoliosReducer'
import incomesReducer from './incomesReducer'
import entitiesReducer from './entitiesReducer'
import expensesReducer from './expensesReducer'

// Root Reducer
export default combineReducers({
  auth: authReducer,
  expenses: expensesReducer,
  incomes: incomesReducer,
  portfolios: portfoliosReducer,
  errors: errorsReducer,
  entities: entitiesReducer
})

// Auth State Selectors
export const getAuthSelector = state => state.auth
export const getCurrentUserSelector = state => getAuthSelector(state).user

// Portfolio State Selectors
export const getPortofliosSelector = state => state.portfolios
export const getSelectedPortfolioSelector = state =>
  getPortofliosSelector(state).selectedPortfolio

// Income State Selectors
export const getIncomesSelector = state => state.incomes

// Errors State Selectors
export const getErrorsSelector = state => state.errors

// Entities State Selectors
export const getEntitiesSelector = state => state.entities
export const getIncomeEntitiesSelector = state =>
  getEntitiesSelector(state).incomes
export const getPortolioEntitiesSelector = state =>
  getEntitiesSelector(state).portoflios
export const getExpensesEntitiesSelector = state =>
  getEntitiesSelector(state).expenses
export const getUserEntitiesSelector = state => getEntitiesSelector(state).users
