import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentPortfolio } from '../../actions/portfolioActions'
import TextFieldGroup from '../common/TextFieldGroup'

class SourceContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      amount: '',
      date: '',
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

    // const profileData = _.omit(this.state, ['displaySocialInputs', 'errors'])
    // console.log({ profileData })
    // this.props.createProfile(profileData, this.props.history)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
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
                    <TextFieldGroup
                      placeholder="* Type"
                      name="source"
                      value={this.state.name}
                      onChange={this.onChange}
                      error={errors.name}
                    />
                    <TextFieldGroup
                      placeholder="* Name"
                      name="source"
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
                    <TextFieldGroup
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SourceContainer.propTypes = {
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
)(SourceContainer)
