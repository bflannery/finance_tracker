import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loginUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Login extends Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()

    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.loginUser(userData)
  }

  render() {
    const { errors } = this.state

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your Finance Tracker account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  name={'email'}
                  placeholder={'Email Address'}
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  type={'email'}
                />
                <TextFieldGroup
                  name={'password'}
                  placeholder={'Password'}
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                  type={'password'}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(Login)
