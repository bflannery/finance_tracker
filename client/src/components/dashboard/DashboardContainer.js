import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Dashboard extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}

  render() {
    return <h4 className> Dashboard </h4>
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
  {}
)(Dashboard)
