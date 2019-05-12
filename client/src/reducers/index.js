import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorsReducer from './errorsReducer'
import portfoliosReducer from './portfoliosReducer'
import incomesReducer from './incomesReducer'
import entitiesReducer from './entitiesReducer'

export default combineReducers({
  auth: authReducer,
  portfolios: portfoliosReducer,
  incomes: incomesReducer,
  errors: errorsReducer,
  entities: entitiesReducer
})
