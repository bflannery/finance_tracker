import axios from 'axios'
import jwt_decode from 'jwt-decode'

import setAuthToken from '../utils/setAuthToken'
import asyncWrapper from '../utils/asyncWrapper'
import { SET_ERRORS, SET_CURRENT_USER } from './types'

// Set Errors
export const setErrorsAction = error => ({
  type: SET_ERRORS,
  payload: error.response.data
})

// Set Logged In User
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
})

export const registerUser = (userData, history) => async dispatch => {
  const { error } = await asyncWrapper(
    axios.post('/api/users/register', userData)
  )
  if (!error) return history.push('/login')
  return dispatch(setErrorsAction(error))
}

export const loginUser = userData => async dispatch => {
  const { error, response } = await asyncWrapper(
    axios.post('/api/users/login', userData)
  )
  if (!error) {
    const { token } = response.data
    // Set token to localstorage
    localStorage.setItem('jwtToken', token)
    // Set token to Auth header
    setAuthToken(token)
    // Decode token to get user data
    const decoded = jwt_decode(token)
    // Set current user
    return dispatch(setCurrentUser(decoded))
  }
  return dispatch(setErrorsAction(error))
}

export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to {}
  // Doing this will also set isAuthenticated to false
  dispatch(setCurrentUser({}))
}

// Delete Account & Profile
export const deleteUser = userId => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    const { error } = await asyncWrapper(axios.delete(`/api/users/${userId}`))
    if (!error) return dispatch(setCurrentUser())
    return dispatch(setErrorsAction(error.response.data))
  }
}
