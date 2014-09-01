/*
 * Module dependencies
 */

var _ = require('underscore')
  , request = require('request')

module.exports = function (options) {
  var logger = options.logger
    , properties = options.properties
    , connection = options.connection
    , Subscription = connection.model('Subscription')
    , Photo = connection.model('Photo')

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
        var hashtags = []

        // Push tags into array
        _.each(subscriptions, function (subscription) {
          hashtags.push(subscription.hashtag)
        })

        callback(null, hashtags)
        logger.info('Retrieved hash tags: ' + hashtags)
      }
    })
  }

  /*
   * Subscribe
   * Starts a request loop for each hash tag in the array
   */

  function subscribe (hashtags) {
    var rateLimit = (3600 / (5000 / hashtags.length)) * 1000

    setInterval(function() {
      _.each(hashtags, function(hashtag){
        requestPhotosForTag(hashtag)
      })
    },rateLimit)
  }

  function requestPhotosForTag(hashtag) {
    var token = '248737336.f9ffe04.1c456f32096a48cfad14647eecc1190d'
      , apiUrl = 'https://api.instagram.com/v1/'
      , uri = apiUrl + 'tags/' + hashtag + '/media/recent?access_token=' + token

    logger.info('Getting recently tagged images for: #' + hashtag)

    request(
      { method: 'GET'
      , uri: uri
      }
    , function (error, response, body) {
        if (error) {
          logger.error(error)
        } else {

          try {
            body = JSON.parse(body)
          } catch (error) {
            logger.error(error)
          }

          if (body.data.length > 0) {
            var posts = body.data.reverse()

            _.each(posts, function(post){

              var photoData =
                { data: cullFields(post)
                , name: hashtag
                , userId: post.user.id
                , type: post.type
                , hashtag: hashtag
                , instagramId: post.id
                }

                photoData.data.created_time = new Date(post.created_time * 1000).getTime()

                var photo = new Photo(photoData)

                photo.save(function(error, savedPost) {
                  if (error) {
                    for (field in error.errors) {
                      if (error.errors[field].type === 'Photo is already saved') {
                        logger.warn('Photo ' + photoData.instagramId + ' is already saved')
                      } else if (error.errors[field].type === 'User is banned, photo not saved') {
                        logger.warn('User ' + photoData.userId + ' is banned, photo not saved')
                      }
                    }
                  } else {
                    logger.info('Photo ' + savedPost.instagramId + ' saved to database')
                  }
                })
            })
          }
        }
      }
    )
  }

  function cullFields(data) {
    var fields =
        [ 'comments'
        , 'users_in_photo'
        , 'likes'
        , 'link'
        , 'tags'
        , 'filter'
        , 'attribution'
        ]

    fields.forEach(function (field) {
      if (data[field]) {
        delete data[field]
      }
    })

    delete data.user.bio
    delete data.user.website
    delete data.images.thumbnail
    delete data.images.low_resolution

    return data
  }

  return { get: get, subscribe: subscribe }

}