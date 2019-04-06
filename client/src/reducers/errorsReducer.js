import { SET_ERRORS, CLEAR_ERRORS } from '../actions/types'

const initialState = {}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return action.payload
    case CLEAR_ERRORS:
      return initialState
    default:
      return state
  }
}

export default authReducer
