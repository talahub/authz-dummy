const fs = require('fs')

const config = {
  // JWT payload defaults
  payloadTemplate: {
    iss:   'barong',
    sub: 'session',
    aud: ['peatio'],
    email: 'john.doe@gmail.com',
    uid:   'ID0000000000',
    role:  'member',
    state: 'active',
    level: 3,
  },

  load: function () {
    let cfg = {}

    // private key for JWT sign
    cfg.jwtPrivateKey = this.loadPrivateKey()

    // seconds before JWT expire
    cfg.jwtTTL = parseInt(process.env.DUMMY_JWT_TTL) || 5

    // merge default payload with configs from env
    cfg.payloadTemplate = Object.assign(
      {},
      this.payloadTemplate,
      this.compactObject({
        iss:   process.env.DUMMY_CONFIG_ISSUER,
        email: process.env.DUMMY_USER_EMAIL,
        uid:   process.env.DUMMY_USER_UID,
        role:  process.env.DUMMY_USER_ROLE,
        level: process.env.DUMMY_USER_LEVEL,
        state: process.env.DUMMY_USER_STATE
      })
    )

    return cfg
  },

  // read private key from file
  loadPrivateKey: () => {
    if (process.env.DUMMY_JWT_PRIVKEY_FILE)
      return fs.readFileSync(process.env.DUMMY_JWT_PRIVKEY_FILE).toString()
    else
      throw new Error('private key path is missing, set DUMMY_JWT_PRIVKEY_FILE env variable')
  },

  // remove all keys with `undefined` values
  compactObject: obj => JSON.parse(JSON.stringify(obj))
}

module.exports = config
