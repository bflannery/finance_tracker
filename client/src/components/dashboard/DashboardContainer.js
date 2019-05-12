import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { connect } from 'react-redux'
import {
  getCurrentPortfolio,
  addExpense,
  addIncome
} from '../../actions/portfolioActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      type: 'income',
      name: '',
      amount: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentDidMount() {
    const { user, getCurrentPortfolio } = this.props
    if (user.portfolios && user.portfolios.length !== 0) {
      getCurrentPortfolio(user.portfolios[0])
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    const { addExpense, addIncome, portfolio } = this.props
    const action = this.state.type === 'expense' ? addExpense : addIncome
    const ommitedState = omit(this.state, ['type', 'errors'])
    const payload = {
      ...ommitedState,
      portfolioId: portfolio._id
    }
    return action(payload)
  }

  render() {
    const { errors } = this.props
    return (
      <div className="add-income">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="card card-faded">
                <div className="card-header col-md-12">
                  <h1 className="card-title text-center">Overview</h1>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item col-md-12">
                      <div className="row">
                        <div className="col-md-10">
                          <span>Cras justo odio</span>
                        </div>
                        <div className="col-md-2">
                          <span>$3000</span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-md-10">
                          <span>Cras justo odio</span>
                        </div>
                        <div className="col-md-2">
                          <span>$6000</span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-md-10">
                          <span>Cras justo odio</span>
                        </div>
                        <div className="col-md-2">
                          <span>$9000</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-faded">
                <div className="card-header col-xs-12">
                  <h1 className="card-title text-center">
                    Add New Income/Expense
                  </h1>
                  <small className="d-block pb-3">* = required fields</small>
                </div>
                <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="type-selector">Example select</label>
                      <select
                        className="form-control"
                        id="type-selector"
                        onChange={this.onChange}
                        name="type"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                    <TextFieldGroup
                      placeholder="* Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChange}
                      error={errors.name}
                    />
                    <TextFieldGroup
                      placeholder="* Amount"
                      name="amount"
                      value={this.state.amount}
                      onChange={this.onChange}
                      error={errors.amount}
                    />
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-info btn-block mt-4"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.auth.user,
  portfolio: state.portfolios.portfolio,
  errors: state.errors
})

export default connect(
  mapStateToProps,
  {
    addExpense,
    addIncome,
    getCurrentPortfolio
  }
)(Dashboard)
