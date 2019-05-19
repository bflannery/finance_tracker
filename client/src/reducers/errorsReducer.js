import { SET_ERRORS, CLEAR_ERRORS, LOG_OUT } from '../actions/types'

const initialState = {}

const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return action.payload
    case CLEAR_ERRORS:
      return initialState
    case LOG_OUT: {
      return {}
    }
    default:
      return state
  }
}

export default errorsReducer
