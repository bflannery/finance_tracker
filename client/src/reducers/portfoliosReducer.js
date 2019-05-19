import {
  SET_PORTFOLIO,
  PORTFOLIO_LOADING,
  CLEAR_SELECTED_PORTFOLIO
} from '../actions/types'

const initialState = {
  selectedPortfolio: {},
  loading: false
}

export const portfoliosReducer = (state = initialState, action) => {
  switch (action.type) {
    case PORTFOLIO_LOADING:
      return {
        ...state,
        loading: true
      }
    case SET_PORTFOLIO:
      return {
        ...state,
        selectedPortfolio: action.payload,
        loading: false
      }
    case CLEAR_SELECTED_PORTFOLIO:
      return {
        ...state,
        selectedPortfolio: null
      }
    default:
      return state
  }
}

export default portfoliosReducer
