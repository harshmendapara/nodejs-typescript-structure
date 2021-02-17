const User = require('../models/User')

function authenticate(req, res, next) {

  let token = null;
  if (typeof req.headers.authorization !== 'undefined') {
    token = req.headers['authorization']
  }

  if (User.isValidToken(token)) {
    next()
  } else {
    next()
    res.status(401).json({
      msg: 'Not Authorized'
    })
  }
}

module.exports = authenticate