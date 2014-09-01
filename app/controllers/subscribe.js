/*
 * Module dependencies
 */

var HashTags = require('./../../lib/hash-tags')
  , _ = require('underscore')

module.exports = function (app, options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , hashTags = new HashTags(options)

  logger.info('Getting hash tags to subscribe to')

  hashTags.get(function (error, hashtags) {
    hashTags.subscribe(hashtags)
  })

}