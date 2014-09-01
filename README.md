# Instagram Subscribe
---

This repository contains Instagram Subscribe service

Dependency:
  - [node.js](http://nodejs.org) `>= 0.8.0`

## Getting started
---

First clone the project then install the dependencies via:

`npm install`

### properties.js

Before starting the project you'll need to create a `properties.js` file, this file isn't committed to the project because it contains sensitive information regarding session secret and database connections. Copy the template below into a new `properties.js` file and save it into the root directory.

```
var _ = require('lodash')
  , path = require('path')

  , baseProperties =
    { port: 3010
    , database: {}
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
    { development:
      { callbackUrl: 'http://samstefan.x64.me:3010/callback/'
      , database:
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
```

## Release History
---

<!-- * v0.0.1 -  -->
