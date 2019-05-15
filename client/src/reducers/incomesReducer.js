import { SET_LAST_SAVED_INCOME, LOG_OUT } from '../actions/types'

const initialState = {
  lastSavedIncome: {}
}

export const incomesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAST_SAVED_INCOME:
      return {
        ...state,
        ...action.payload
      }
    case LOG_OUT: {
      return {}
    }
    default:
      return state
  }
}

export default incomesReducer
