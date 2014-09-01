/*
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')

module.exports = function (logger, connection) {
  logger.info('Setting up photo model')

  /*
   * Photo Schema
   */

  var PhotoSchema = new Schema(
    { data:
      { type: Object
      , default: null
      }
    , name:
      { type: String
      , default: null
      }
    , userId:
      { type: String
      , default: null
      }
    , approved:
      { type: Boolean
      , default: true
      }
    , type:
      { type: String
      , default: null
      }
    , hashtag:
      { type: String
      , default: null
      }
    , httpChecked:
      { type: Boolean
      , default: false
      }
    , instagramId:
      { type: String
      , default: null
      }
    , dateCreated:
      { type: Date
      , default: Date.now
      }
    }
  , { collection: 'photos' }
  )

  /*
   * Validations
   */

  // instagramId must be unique
  PhotoSchema.path('instagramId').validate(function (instagramId, callback) {
    var photoToSave = this
    var Photo = connection.model('Photo')
    Photo.findOne({ instagramId: instagramId }, function (error, photo) {
      if (photo) {
        // Check that it's not current photo
        if (photoToSave._id.toString() === photo._id.toString()) return callback(true)
        return callback(false)
      }
      callback(true)
    })
  }, 'Photo is already saved')

  // User must not be banned
  PhotoSchema.path('userId').validate(function (userId, callback) {
    var BannedUser = connection.model('BannedUser')

    BannedUser.find({}, function(error, bannedUsers){
      if (error) {
        logger.error(error)
      } else {
        _.each(bannedUsers, function(bannedUser){
          if (bannedUser.userId === userId) {
            return callback(false)
          }
        })
        callback(true)
      }
    })
  }, 'User is banned, photo not saved')

  connection.model('Photo', PhotoSchema)
}