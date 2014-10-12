/*
 * Module dependencies
 */

var HashTags = require('./../../lib/hash-tags')
  , Photos = require('./../../lib/photos')
  , _ = require('underscore')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , hashTags = new HashTags(options)
    , photos = new Photos(options)

  // Subscribe to hash tags
  hashTags.subscribe(properties.hashTags)
}