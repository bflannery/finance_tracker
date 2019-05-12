import { normalize, schema } from 'normalizr'
import { GET_PORTFOLIO_SUCCESS, GET_USER_SUCCESS } from '../actions/types'

// Income Entity and Schema
const incomeEntity = new schema.Entity('incomes', {}, { idAttribute: '_id' })
const incomeSchema = { incomes: [incomeEntity] }

// Portfolio Entity and Schema
const portfolioEntity = new schema.Entity('portfolios', incomeSchema, {
  idAttribute: '_id'
})
const portfolioSchema = { portfolios: [portfolioEntity] }

// User Entity
const userEntity = new schema.Entity('users', portfolioSchema, 'id')

const initialState = {
  incomes: {},
  portfolios: {},
  users: {}
}

export const entitiesRedcuer = (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
    case GET_USER_SUCCESS:
      const normalizedUsersPayload = normalize(payload, userEntity)
      return {
        ...state,
        ...normalizedUsersPayload.entities
      }
    case GET_PORTFOLIO_SUCCESS:
      const normalizedPorfoliosPayload = normalize(payload, portfolioEntity)
      return {
        ...state,
        ...normalizedPorfoliosPayload.entities
      }
    default:
      return state
  }
}

export default entitiesRedcuer
