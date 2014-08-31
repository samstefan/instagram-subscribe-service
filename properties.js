var _ = require('lodash')
  , path = require('path')

  , baseProperties =
    { port: 3010
    , database: {}
    , allowedDomains:
      [ 'localhost:3010'
      , '192.168.1.12:3010'
      ]
    , hashTags:
      [ 'Bestival'
      , 'Bestival14'
      , 'DesertIslandDisco'
      , 'Bestival2014'
      ]
    }

  , properties =
    { development:
      { database:
        { user: ''
        , pass: ''
        , host: 'localhost'
        , port: '27017'
        , name: 'bestival-live'
        }
      }
    , testing: {}
  }

module.exports = function () {
  var env = process.env.NODE_ENV || 'development'
  return _.extend({ environment: env }, baseProperties, properties[env])
}