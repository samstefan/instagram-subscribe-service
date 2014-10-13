/*
 * Module dependencies
 */

var _ = require('underscore')
  , async = require('async')
  , request = require('request')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Photo = connection.model('Photo')

  /*
   * Subscribe
   * Starts a request loop for each hash tag in the array
   * @pram: {Array} of hash tags to subscribe to
   */

  function subscribe (hashtags) {
    var rateLimit = (3600 / (5000 / hashtags.length)) * 1000

    // start Timer
    timer()

    function timer() {
      setTimeout(function () {
        logger.info('Getting recently tagged images for: ' + hashtags)
        async.each(hashtags, function(hashtag, callback) {
          requestPhotosForTag(hashtag, function (error) {
            callback()
          })
        }, function () {
          logger.info('Finished processing all hash tags')
          timer()
        })
      }, rateLimit)
    }

  }

  /*
   * Request Photos For Tag
   * Requests the latest photos for hash tag passed in from the Instagram API and
   * save them if they don't already exist
   * @pram: {String} the hash tag you want to get posts for
   */

  function requestPhotosForTag(hashtag, callback) {
    var token = properties.token
      , apiUrl = 'https://api.instagram.com/v1/'
      , uri = apiUrl + 'tags/' + hashtag + '/media/recent?access_token=' + token

    request(
      { method: 'GET'
      , uri: uri
      }
    , function (error, response, body) {
        if (error) {
          return callback(error)
        }

        try {
          body = JSON.parse(body)
        } catch (error) {
          return callback(error)
        }

        if (body.code) {
          return callback(body.code)
        }

        if (body.meta.code !== 200) {
          return callback(body.meta['error_message'])
        }

        if (body.data) {
          var posts = body.data.reverse()

          async.each(posts, function(post, callback) {
            var photo = {}

            photo.createdTime = post['created_time']
            photo.type = post.type
            photo.hashTags = post.tags
            photo.photoId = post.id
            photo.link = post.link

            // User
            photo.user =
              { username: post.user.username
              , profilePicture: post.user['profile_picture']
              , id: post.user.id
              }

            // Images
            photo.images =
              { lowResolution: post.images['low_resolution']
              , thumbnail: post.images['thumbnail']
              , standardResolution: post.images['standard_resolution']
              }

            if (post.type === 'video') {
              photo.videos =
                { lowResolution: post.videos['low_resolution']
                , standardResolution: post.videos['standard_resolution']
                }
            }

            // Caption
            if (post.caption) {
              photo.caption =
                { id: post.caption.id
                , createdTime: post.caption['created_time']
                , text: post.caption.text
                , from: post.caption.from
                }
            }

            // Location
            if (post.location) {
              photo.location = []
              photo.location[0] = post.location.latitude
              photo.location[1] = post.location.longitude
            }

            // Upsert document (upsert instead of save, because using save causes race conditions)
            Photo.update({ photoId: photo.photoId }, photo, { upsert: true }, function (error) {
              if (error) {
                return callback(error)
              }
              callback()
            })
          }, function (error) {
            if (error) {
              return callback(error)
            }
            callback()
          })
        } else {
          callback('No body data')
        }
      }
    )
  }

  return { subscribe: subscribe }

}