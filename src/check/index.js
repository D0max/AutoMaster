const {validationResult} = require('express-validator')
const authorizationValid = require('./authorizationValid')

const errorsValidFunction = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
}

module.exports = {
  authorizationValid,
  validationResult,
  errorsValidFunction
}
