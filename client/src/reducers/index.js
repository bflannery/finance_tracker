import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorsReducer from './errorsReducer'
import portfoliosReducer from './portfoliosReducer'

export default combineReducers({
  auth: authReducer,
  portfolios: portfoliosReducer,
  errors: errorsReducer
})
