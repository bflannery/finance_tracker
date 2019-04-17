import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentPortfolio } from '../../actions/portfolioActions'

class Dashboard extends Component {

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
          <h1 className="display-4"> Dashboard</h1>
          <div className="row">
            <div className="order-xs-1 order-sm-1 order-md-2 col-md-9">
              <div className="card border-secondary my-2">
                <div className="card-header text-center">
                  <h5 className="card-title m-0"> Overview </h5>
                </div>
                <div className="card-body p-0">
                  <h1> CHART </h1>
                </div>
              </div>
            </div>
            <div className="order-xs-2 order-sm-2 order-md-1 col-md-3">
              <div className="card border-secondary my-2">
                <div className="card-header text-center">
                  <h5 className="card-title m-0"> Income </h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="#">Cras justo odio</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#"> Dapibus ac facilisis in</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#">Vestibulum at eros</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card border-secondary my-2">
                <div className="card-header text-center">
                  <h5 className="card-title m-0"> Expenses </h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="#">Cras justo odio</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#"> Dapibus ac facilisis in</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#">Vestibulum at eros</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card border-secondary my-2">
                <div className="card-header text-center">
                  <h5 className="card-title m-0"> Bills </h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="#">Cras justo odio</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#"> Dapibus ac facilisis in</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="#">Vestibulum at eros</Link>
                    </li>
                  </ul>
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
