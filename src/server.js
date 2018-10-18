const express = require('express')
const createAuthApp = require('./auth')

module.exports = () => {
  let app = express()

  // Add Middleware to log requests
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`)
    return next()
  })

  // Mount express authorizer app
  app.use('/auth', createAuthApp())

  app.listen(8005, function () {
    console.log('Starting Peatio development authz server on localhost:8005')
  })
}
