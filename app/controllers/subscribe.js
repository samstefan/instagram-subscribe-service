/*
 * Module dependencies
 */

var HashTags = require('./../../lib/hash-tags')

module.exports = function (app, options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Photo = connection.model('Photo')
    , Subscription = connection.model('Subscription')
    , hashTags = new HashTags(options)

  logger.info('Getting hash tags to subscribe to')

  hashTags.get(function (error, hastags) {

  })

}