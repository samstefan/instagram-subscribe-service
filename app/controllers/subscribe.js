/*
 * Module dependencies
 */

var HashTags = require('./../../lib/hash-tags')
  , Photos = require('./../../lib/photos')
  , _ = require('underscore')

module.exports = function (app, options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , hashTags = new HashTags(options)
    , photos = new Photos(options)

  logger.info('Getting hash tags to subscribe to')

  // Get hash tags from db
  hashTags.get(function (error, hashtags) {
    // Subscribe to hash tags
    hashTags.subscribe(hashtags)
  })

  // Start the clean up timer
  cleanUpTimer()

  function cleanUpTimer() {
    setTimeout(function () {
      photos.cleanUp(function () {
        cleanUpTimer()
      })
    }, 60000 * 3)
  }

}