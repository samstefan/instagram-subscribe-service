/*
 * Module dependencies
 */

var async = require('async')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Subscription = connection.model('Subscription')

  /*
   * Load
   * Gets hash tags from properties and checks the database for subscriptions
   * of those tags, if not defined it creates a new subscription.
   * @pram: {callback} when all subscriptions have been checked.
   */

  function load(callback) {
    var hashtags = properties.hashTags
    logger.info('Checking subscriptions exist in database')

    async.each(hashtags, function(hashtag, callback) {
      Subscription.find({ hashtag: hashtag }, function (error, subscription) {
        if (error) {
          callback(error)
        } else if (subscription.length === 0) {
          logger.info('Subscription for ' + hashtag + ' doesn\`t exist')

          var subscriptionData =
            { hashtag: hashtag
            , name: hashtag
            }
            , subscription = new Subscription(subscriptionData)

          logger.info('Creating subscription for: ' + hashtag)
          subscription.save(function (error, savedSubscription) {
            if (error) {
              callback(error)
            } else {
              callback()
            }
          })
        } else {
          logger.info('Subscription for ' + hashtag + ' already exist, skipping')
          callback()
        }
      })
    }, function (error) {
      if (error) {
        callback(error)
      } else {
        callback(null)
      }
    })

  }

  return { load: load }

}