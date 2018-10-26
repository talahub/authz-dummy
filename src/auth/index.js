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
    // Skip authentication for open endpoints and static files
    this.app.all([
      // root path
      /^\/$/,

      // Ambassador diagnostics
      /^\/ambassador/,

      // static files
      /\.(js|css|ico|jpe?g|png|svg)$/
    ], (req, res) => res.send(200))

    this.app.all('*', (req, res) => {
      let token = jwt.sign(this.generatePayload(), this.config.jwtPrivateKey, { algorithm: 'RS256' })

      res.set('Authorization', `Bearer ${token}`)
      res.status(200).end()
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
