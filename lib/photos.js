/*
 * Module dependencies
 */

var request = require('request')
  , async = require('async')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Photo = connection.model('Photo')

  /*
   * Clean Up
   * Gets all photos from the database and makes request to the image, if the
   * image comes back with a 404 or 403 status then it's removed from the database
   * @pram {Callback} when cleaning is complete callback is called
   */

  function cleanUp (callback) {
    logger.info('Running photo clean up')
    // Get all photos
    Photo
    .find({})
    .exec(function (error, photos) {
      // Loop over the photos and make a request to each URL
      async.each(photos, function(photo, callback) {
        var photoUrl = photo.images.standardResolution.url
        request(
          { method: 'GET'
          , uri: photoUrl
          }
        , function (error, response, body) {
            if (error) {
              callback(error)
            } else {
              // Check status code
              if (response.statusCode === 404 || response.statusCode === 403) {
                Photo.findByIdAndRemove(photo._id, function (error) {
                  if (error) {
                    callback(error)
                  } else {
                    callback()
                    logger.warn('Removed photo: ' + photo.photoId + ' Reason: ' + response.statusCode)
                  }
                })
              } else {
                callback()
              }
            }
          }
        )
      }, function (error) {
        if (error) {
          logger.error(error)
        } else {
          logger.info('Photo clean up completed successfully')
        }
        callback()
      })
    })
  }

  return { cleanUp: cleanUp }

}