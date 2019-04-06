import {
  SET_PORTFOLIOS,
  SET_PORTFOLIO,
  PORTFOLIO_LOADING,
  CLEAR_CURRENT_PORTFOLIO
} from '../actions/types'

const initialState = {
  portfolio: null,
  portfolios: null,
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
        portfolio: action.payload,
        loading: false
      }
    case CLEAR_CURRENT_PORTFOLIO:
      return {
        ...state,
        portfolio: null
      }
    case SET_PORTFOLIOS:
      return {
        ...state,
        portfolios: action.payload,
        loading: false
      }
    default:
      return state
  }
}

export default portfoliosReducer
