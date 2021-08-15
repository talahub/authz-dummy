const fs = require('fs')

if (process.env.TIKI_USER_ID)
  tikiUserId = process.env.TIKI_USER_ID
else
  throw new Error('User is missing, set TIKI_USER_ID env variable')

const config = {
  // JWT payload defaults
  // payloadTemplate: {
  //   iss:   'barong',
  //   sub: 'session',
  //   aud: ['peatio'],
  //   email: 'admin@barong.io',
  //   uid:   'U123456789',
  //   role:  'superadmin',
  //   state: 'active',
  //   level: 3,
  // },

  payloadTemplate: {
    sub: tikiUserId
  },

  load: function () {
    let cfg = {}

    // private key for JWT sign
    cfg.jwtPrivateKey = this.loadPrivateKey()

    // seconds before JWT expire
    cfg.jwtTTL = 31104000 // 1 year

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
