import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentPortfolio } from '../../actions/portfolioActions'

class Dashboard extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { auth, getCurrentPortfolio } = this.props
    if (auth.user.id) {
      getCurrentPortfolio(auth.user.id)
    }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4"> Dashboard</h1>
              <div className="col">
                <div className="card my-2">
                  <div className="card-body">
                    <h5 className="card-title">Income</h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                </div>
                <div className="card my-2">
                  <div className="card-body">
                    <h5 className="card-title">Expenses</h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                </div>
                <div className="card my-2">
                  <div className="card-body">
                    <h5 className="card-title">Bills</h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card my-2">
                  <div className="card-body">
                    <h5 className="card-title">Overview</h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
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
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  {
    getCurrentPortfolio
  }
)(Dashboard)
