import { isEmpty } from 'lodash'
import { LOG_OUT, SET_CURRENT_USER } from '../actions/types'

const initialState = {
  isAuthenticated: false,
  user: {}
}

const authReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        isAuthenticated: !isEmpty(payload),
        user: payload
      }
    }
    case LOG_OUT: {
      return {}
    }
    default:
      return state
  }
}

export default authReducer
