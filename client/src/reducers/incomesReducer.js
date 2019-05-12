import { SET_PORTFOLIO, SET_LAST_SAVED_INCOME } from '../actions/types'

const initialState = {
  lastSavedIncome: {},
  incomes: []
}

export const incomesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAST_SAVED_INCOME:
      return {
        ...state,
        lastSavedIncome: action.payload,
        incomes: state.incomes.concat([action.payload])
      }
    case SET_PORTFOLIO:
      return {
        ...state,
        incomes: action.payload.incomes
      }
    default:
      return state
  }
}

export default incomesReducer
