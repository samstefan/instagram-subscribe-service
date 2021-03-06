# Instagram Subscribe
---

This repository contains the Instagram subscribe service. A lightweight node.js service that collects hash tagged images in a mongodb database from the Instagram API.

Dependency:
  - [node.js](http://nodejs.org) `>= 0.8.0`
  - [mongodb](http://www.mongodb.org/) `>= 2.6.0`

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
      , host: 'localhost'
      , port: '27017'
      , name: 'instagram-subscribe'
      }
    , clientId: ''
    , clientSecret: ''
    , token: ''
    , hashTags:
      [ 'cats' ]
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
```

### Instergram API Applcation

Before you can run the applcation you need to fill out the Instergram `clientId`, `clientSecret` and `token`. To do this you need create a applcation with Instergram, then request a auth token. You can find out how to do that [here](http://dmolsen.com/2013/04/05/generating-access-tokens-for-instagram/).

### Jobs

The `jobs` folder contains standalone node app's for running maintenance tasks.

* `jobs/remove-duplicates.js` Finds any duplcate images based on the `photoId` and removes them.
* `jobs/remove-deleted.js` Makes a http request to each image if the status code comes back as `404` or `403` then the photo is removed.

## Release History
---

* v1.0.1 Refactored code, removed express framework, added a more explicit photo model and added remove delete photo job
* v0.0.1 Initial release.
