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
    , database:
      { user: ''
      , pass: ''
      , host: ''
      , port: ''
      , name: ''
      }
    , allowedDomains:
      [ 'localhost:3010'
      ]
    }

  , properties =
    { development: {}
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