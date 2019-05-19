import { SET_LAST_SAVED_EXPENSE, LOG_OUT } from '../actions/types'

const initialState = {
  lastSavedExpense: {}
}

export const expensesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAST_SAVED_EXPENSE:
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

export default expensesReducer
