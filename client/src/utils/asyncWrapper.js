const asyncWrapper = promise =>
  promise
    .then(response => ({ response, error: null }))
    .catch(error => ({ error, data: null }))

export default asyncWrapper
