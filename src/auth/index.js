const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const auth = {
  // Create express middleware instance
  app: express(),

  // load configs on mount
  init: function () {
    this.app.on('mount', (root) => {
      this.config = root.locals.config
      this.drawRoutes()
    })
  },

  // Initialize auth middleware routes
  drawRoutes: function() {
    this.app.all('*', (req, res) => {
      let token = jwt.sign(this.generatePayload(), this.config.jwtPrivateKey, { algorithm: 'RS256' })
      console.log(token)
      res.set('Authorization', `Bearer ${token}`)
      res.status(200).send(token).end()
    })
  },

  // Generates new payload with default uid and email
  generatePayload: function () {
    let ts = parseInt(Date.now() / 1000)

    return Object.assign({}, this.config.payloadTemplate, {
      iat: ts,
      exp: ts + this.config.jwtTTL,
      jti: crypto.randomBytes(8).toString('hex'),
    })
  },
}

module.exports = auth
