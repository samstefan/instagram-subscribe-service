module.exports = function(allowedDomains) {

  return function (req, res, next) {

    var skip = false
    allowedDomains.forEach(function (domain) {
      if (domain === '*') skip = true
    })

    if (!skip) {
      if (req.headers.origin) {
        var origin = req.headers.origin.replace(/^(https?|ftp):\/\//, '')
        if (allowedDomains.indexOf(origin) !== -1) {
          res.set(
            { 'Access-Control-Allow-Origin': req.headers.origin
            , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
            , 'Access-Control-Request-Headers': allowedDomains
            , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
            , 'Access-Control-Allow-Credentials': true
            })
        } else {
          return res.send(403)
        }
      }
    }

    if (req.method === 'OPTIONS') {
      // Preflight rarely changes so cache in proxies
      res.set('Cache-Control', 'max-age=86400')
      return res.end()
    }

    next()

  }

}