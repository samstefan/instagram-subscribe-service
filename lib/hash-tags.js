/**
 * Module dependencies.
 */

var _ = require('underscore')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Subscription = connection.model('Subscription')

  /*
   * Get
   * Retrieves hash tags from database
   * @pram {callback}
   */

  function get (callback) {
    Subscription.find({}, function (error, subscriptions) {
      if (error) {
        logger.error(error)
      } else {
        var hastags = []

        // Push tags into array
        _.each(subscriptions, function (subscription) {
          hastags.push(subscription.hashtag)
        })

        callback(null, hastags)
        logger.info('Retrieved hash tags: ' + hastags)
      }
    })
  }

  return { get: get }

}