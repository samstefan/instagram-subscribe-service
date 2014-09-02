var _ = require('lodash')
  , path = require('path')

  , baseProperties =
    { port: 3010
    , database:
      { user: ''
      , pass: ''
      , host: 'localhost'
      , port: '27017'
      , name: 'bestival-live'
      }
    , clientId: 'f9ffe04efa6347c8b97cabafd8896e93'
    , clientSecret: '5bb80ce1fb184b54a168baab4ea8c3ce'
    , hashTags:
      [ 'bestival'
      , 'bestival14'
      , 'desertislanddisco'
      , 'bestival2014'
      ]
    , allowedDomains: ['localhost:2004']
    }

  , properties =
    { development: {}
    , testing: {}
    , production: {}
  }

module.exports = function () {
  var env = process.env.NODE_ENV || 'development'
  return _.extend({ environment: env }, baseProperties, properties[env])
}