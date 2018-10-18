const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const privkey = Buffer.from(
  'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlDWFFJQkFBS0JnUURJSUsxVWVyaEMyOGp3Q0h4MHNTRjNVdGkrbzUxU0FwS00vaDJXQ1dpS0hjVk1kVDBkClFiZG1hRUJnTFhsR1NrYko3VnV2bDBhRUNYc2VJMUNHTHU1eTRZczExMGZaTWY0Q2JJaTllZkp5Mjg5UnhieisKUmlqL05mVXA5NGxCZy9TQWpwZkRWZ1hEN0NuWU9jU2VOWktFRmdSY3BJZWlYOUIrZDd4enJUWTlwd0lEQVFBQgpBb0dBUFlqR290NGsvL0hDWkFQSCtMMXFFOTEyWlkrN1ZMY1R4cVJ3Qm0wWUpyZW1yYTZ5dnVjdzlCMEVCazZWCkpvYTZJMmFITllObkhEd3FEZ2Mvd0RKNEFIR0dPajZJcGoyc0NpT2lPVW05d1BROEZzQ3RRNGFBV2hYYk5CM1cKSG5lSlNQYmxFblRCb05vcTUxUXl5dG9GVytLSldZOVBpcGN1T1R2RVhJTDZIeUVDUVFEc0NqbW5GNzJYTXBxRgorQyt2VnRSZkg2WXBYdGZNTkJNbmRRcU9wTlN4alFZT2xFZy9TQkxSRmdkamUxbEErbmJGT2l0R3ZOcks0SG5FCmRYdXpuNi8zQWtFQTJRMEdjWWJBcHV4aldCSXY5YUxXd090WGN3REpFUFdEQVFGTVZMUFhQNVlWWEUxTXZ4dHQKY2tnRjg1Zk9MTFNKS0FUNU1YZGRxSjVaNjE3elR1blQwUUpBU1Q4UER2UUdDRkpTc3pvR0NpSW11dklHVFJZNgpYd3JWMnN1dUgvKzBaUGgvSmEwTUVsOGFQN25YUng2eTNzQWFkUytNMkdHb2Y0WlRJd3pWK3pLVmx3SkJBSmVpCmN1THpDanBUb1IvUkxQSkZmaFN2Rlp3QmEzYk9ubVFnWFF3N3k5L2ZZVExueWZzbEZUUW12d21yLzF6YUQ0d0cKMVhUS2VJTXBoWlphOGs0cUsxRUNRUUNHOHN1RTBSdVMwbi9aS2p5WVI0TFVlWnBOYzhjcFVaQWtwcy9VS0VhKwoxQngzZXF2NE82QkRwSHA4UWJqTTU3WVpsRW5SSjdPQm1LODIrNW05SUM3bQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=',
  'base64'
).toString('ascii')

function payload () {
  let ts = parseInt(Date.now() / 1000)

  return {
    "iat": ts,
    "exp": ts + 5,
    "sub": "session",
    "iss": "barong",
    "aud": ["peatio"],
    "jti": crypto.randomBytes(8).toString("hex"),
    "uid": "ID0000000000",
    "email": "john.doe@gmail.com",
    "role": "admin",
    "level": 3,
    "state": "active"
  }
}

module.exports = () => {
  let auth = express()

  // Skip authentication for open endpoints and static files
  auth.all([
    // root path
    /^\/$/,

    // Ambassador diagnostics
    /^\/ambassador/,

    // static files
    /\.(js|css|ico|jpe?g|png|svg)$/
  ], (req, res) => res.send(200))

  auth.all('*', (req, res) => {
    // TODO: check for a "Set-Cookie" header and return default user data

    let token = jwt.sign(payload(), privkey, { algorithm: 'RS256' })
    console.log(payload(), token)

    res.set('Authorization', `Bearer ${token}`)

    res.status(200)

    res.end()
  })

  return auth
}
