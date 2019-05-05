import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentPortfolio } from '../../actions/portfolioActions'
import portfoliosReducer from '../../reducers/portfoliosReducer'
import TextFieldGroup from '../common/TextFieldGroup'

class AddNewType extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      amount: '',
      date: '',
      type: '',
      errors: {}
    }
  }
  componentDidMount() {
    const { auth, getCurrentPortfolio, portfolio } = this.props
    if (auth.user.id && !portfolio) {
      getCurrentPortfolio(auth.user.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onSubmit(e) {
    e.preventDefault()
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { errors } = this.props
    return (
      <div className="card-body p-0">
        <div className="row">
          <form onSubmit={this.onSubmit} className="col-sm-12">
            <TextFieldGroup
              className="col-sm-3"
              placeholder="* Type"
              name="type"
              value={this.state.name}
              onChange={this.onChange}
              error={errors.name}
            />
            <TextFieldGroup
              className="col-sm-3"
              placeholder="* Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              error={errors.name}
            />
            <TextFieldGroup
              className="col-sm-3"
              placeholder="* Amount"
              name="amount"
              value={this.state.amount}
              onChange={this.onChange}
              error={errors.amount}
            />
            <TextFieldGroup
              className="col-sm-3"
              placeholder="* YYYY-MM-DD"
              name="date"
              value={this.state.date}
              onChange={this.onChange}
              error={errors.date}
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-info btn-block mt-4"
            />
          </form>
        </div>
      </div>
    )
  }
}

AddNewType.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  portfolio: state.portfolios.portfolio,
  errors: state.errors
})

export default connect(
  mapStateToProps,
  {
    getCurrentPortfolio
  }
)(AddNewType)
