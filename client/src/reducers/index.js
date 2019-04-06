import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorsReducer from './errorsReducer'
// import profilesReducer from './profilesReducer'

export default combineReducers({
  auth: authReducer,
  // profiles: profilesReducer,
  errors: errorsReducer
})
