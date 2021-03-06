import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { Provider } from 'react-redux'

import './App.css'

import store from './store'
import setAuthToken from './utils/setAuthToken.js'
import { setCurrentUser, logoutUser } from './actions/authActions'

import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import DashboardContainer from './components/dashboard/DashboardContainer'
import NotFound from './components/not-found/NotFound'
import IncomeContainer from './components/income/IncomeContainer'

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken)
  // Decode token for user info
  const decoded = jwt_decode(localStorage.jwtToken)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  // Check for expired token
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // Logout User
    store.dispatch(logoutUser())
    // Redirect to login
    window.location.href = '/login'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Login} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />

              <Switch>
                <PrivateRoute
                  exact
                  path="/dashboard"
                  component={DashboardContainer}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/income"
                  component={IncomeContainer}
                />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
