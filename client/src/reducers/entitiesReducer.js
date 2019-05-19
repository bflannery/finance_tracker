import { normalize, schema } from 'normalizr'
import _ from 'lodash'
import {
  EXPENSE_POST_SUCCESS,
  INCOME_POST_SUCCESS,
  PORTFOLIO_GET_SUCCESS,
  USER_GET_SUCCESS,
  LOG_OUT
} from '../actions/types'

// Income Entity and Schema
const incomeEntity = new schema.Entity('incomes', {}, { idAttribute: '_id' })
const incomeSchema = { incomes: [incomeEntity] }

// Expense Entity and Schema
const expenseEntity = new schema.Entity('expenses', {}, { idAttribute: '_id' })
const expenseSchema = { expenses: [incomeEntity] }

// Portfolio Entity and Schema
const portfolioEntity = new schema.Entity(
  'portfolios',
  { ...incomeSchema, ...expenseSchema },
  {
    idAttribute: '_id'
  }
)
const portfolioSchema = { portfolios: [portfolioEntity] }

// User Entity
const userEntity = new schema.Entity('users', portfolioSchema, 'id')

const initialState = {
  expenses: {},
  incomes: {},
  portfolios: {},
  users: {}
}

const getMergedEntityState = (state, payload, entity) => {
  const normalizedPayload = normalize(payload, entity)
  return _.merge(state, normalizedPayload.entities)
}

export const entitiesRedcuer = (state = initialState, action) => {
  const { payload, type } = action
  let mergedEntitiesState = {}
  switch (type) {
    case USER_GET_SUCCESS:
      mergedEntitiesState = getMergedEntityState(state, payload, userEntity)
      return {
        ...state,
        ...mergedEntitiesState
      }
    case PORTFOLIO_GET_SUCCESS:
      mergedEntitiesState = getMergedEntityState(
        state,
        payload,
        portfolioEntity
      )
      return {
        ...state,
        ...mergedEntitiesState
      }
    case INCOME_POST_SUCCESS:
      mergedEntitiesState = getMergedEntityState(state, payload, incomeEntity)
      return {
        ...state,
        ...mergedEntitiesState
      }
    case EXPENSE_POST_SUCCESS:
      mergedEntitiesState = getMergedEntityState(state, payload, expenseEntity)
      return {
        ...state,
        ...mergedEntitiesState
      }
    case LOG_OUT: {
      return {}
    }
    default:
      return state
  }
}

export default entitiesRedcuer
