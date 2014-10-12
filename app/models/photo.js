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
    { approved:
      { type: Boolean
      , default: true
      }
    , createdTime:
      { type: Number
      , index: true
      , default: null
      }
    , user:
      { id:
        { type: String
        , default: null
        }
      , fullName:
        { type: String
        , default: null
        }
      , profilePicture:
        { type: String
        , default: null
        }
      , username:
        { type: String
        , default: null
        }
      }
    , images:
      { lowResolution:
        { url:
          { type: String
          , default: null
          }
        , width:
          { type: Number
          , default: null
          }
        , height:
          { type: Number
          , default: null
          }
        }
      , thumbnail:
        { url:
          { type: String
          , default: null
          }
        , width:
          { type: Number
          , default: null
          }
        , height:
          { type: Number
          , default: null
          }
        }
      , standardResolution:
        { url:
          { type: String
          , default: null
          }
        , width:
          { type: Number
          , default: null
          }
        , height:
          { type: Number
          , default: null
          }
        }
      }
    , videos:
      { lowResolution:
        { url:
          { type: String
          }
        , width:
          { type: Number
          }
        , height:
          { type: Number
          }
        }
      , standardResolution:
        { url:
          { type: String
          , default: null
          }
        , width:
          { type: Number
          , default: null
          }
        , height:
          { type: Number
          , default: null
          }
        }
      }
    , caption:
      { id:
        { type: String
        , default: null
        }
      , createdTime:
        { type: Number
        , default: null
        }
      , text:
        { type: String
        , default: null
        }
      , from:
        { username:
          { type: String
          , default: null
          }
        , id:
          { type: String
          , default: null
          }
        }
      }
    , type:
      { type: String
      , default: null
      }
    , location:
      { type: []
      , default: []
      }
    , hashTags:
      { type:
        [ { type: String
          , index: true
          }
        ]
      , index: true
      , default: []
      }
    , photoId:
      { type: String
      , index: true
      , default: null
      }
    , link:
      { type: String
      , default: null
      }
    }
  , { collection: 'photos' }
  )

  /*
   * Validations
   */

  // createdTime cannot be blank
  PhotoSchema.path('createdTime').validate(function (createdTime) {
    return createdTime && createdTime.length
  }, 'createdTime cannot be blank')

  // user.id cannot be blank
  PhotoSchema.path('user.id').validate(function (userId) {
    return userId && userId.length
  }, 'user.id cannot be blank')

  // user.fullName cannot be blank
  PhotoSchema.path('user.fullName').validate(function (fullName) {
    return fullName && fullName.length
  }, 'user.fullName cannot be blank')

  // user.username cannot be blank
  PhotoSchema.path('user.username').validate(function (username) {
    return username && username.length
  }, 'user.username cannot be blank')

  // images.lowResolution.url cannot be blank
  PhotoSchema.path('images.lowResolution.url').validate(function (lowResolutionUrl) {
    return lowResolutionUrl && lowResolutionUrl.length
  }, 'images.lowResolution.url cannot be blank')

  // images.lowResolution.width cannot be blank
  PhotoSchema.path('images.lowResolution.width').validate(function (lowResolutionWidth) {
    return lowResolutionWidth && lowResolutionWidth.length
  }, 'images.lowResolution.width cannot be blank')

  // images.lowResolution.height cannot be blank
  PhotoSchema.path('images.lowResolution.height').validate(function (lowResolutionHeight) {
    return lowResolutionHeight && lowResolutionHeight.length
  }, 'images.lowResolution.height cannot be blank')

  // images.thumbnail.url cannot be blank
  PhotoSchema.path('images.thumbnail.url').validate(function (thumbnailUrl) {
    return thumbnailUrl && thumbnailUrl.length
  }, 'images.thumbnail.url cannot be blank')

  // images.thumbnail.width cannot be blank
  PhotoSchema.path('images.thumbnail.width').validate(function (thumbnailWidth) {
    return thumbnailWidth && thumbnailWidth.length
  }, 'images.thumbnail.width cannot be blank')

  // images.thumbnail.height cannot be blank
  PhotoSchema.path('images.thumbnail.height').validate(function (thumbnailHeight) {
    return thumbnailHeight && thumbnailHeight.length
  }, 'images.thumbnail.height cannot be blank')

  // images.standardResolution.url cannot be blank
  PhotoSchema.path('images.standardResolution.url').validate(function (standardResolutionUrl) {
    return standardResolutionUrl && standardResolutionUrl.length
  }, 'images.standardResolution.url cannot be blank')

  // images.standardResolution.width cannot be blank
  PhotoSchema.path('images.standardResolution.width').validate(function (standardResolutionWidth) {
    return standardResolutionWidth && standardResolutionWidth.length
  }, 'images.standardResolution.width cannot be blank')

  // images.standardResolution.height cannot be blank
  PhotoSchema.path('images.standardResolution.height').validate(function (standardResolutionHeight) {
    return standardResolutionHeight && standardResolutionHeight.length
  }, 'images.standardResolution.height cannot be blank')

  // videos.standardResolution.url cannot be blank
  PhotoSchema.path('videos.standardResolution.url').validate(function (standardResolutionUrl) {
    if (this.type === 'video') {
      return standardResolutionUrl && standardResolutionUrl.length
    }
    return true
  }, 'videos.standardResolution.url cannot be blank')

  // videos.standardResolution.width cannot be blank
  PhotoSchema.path('videos.standardResolution.width').validate(function (standardResolutionWidth) {
    if (this.type === 'video') {
      return standardResolutionWidth && standardResolutionWidth.length
    }
    return true
  }, 'videos.standardResolution.width cannot be blank')

  // video.standardResolution.height cannot be blank
  PhotoSchema.path('videos.standardResolution.height').validate(function (standardResolutionHeight) {
    if (this.type === 'video') {
      return standardResolutionHeight && standardResolutionHeight.length
    }
    return true
  }, 'videos.standardResolution.height cannot be blank')

  // video.lowResolution.url cannot be blank
  PhotoSchema.path('videos.lowResolution.url').validate(function (lowResolutionUrl) {
    if (this.type === 'video') {
      return lowResolutionUrl && lowResolutionUrl.length
    }
    return true
  }, 'videos.lowResolution.url cannot be blank')

  // videos.lowResolution.width cannot be blank
  PhotoSchema.path('videos.lowResolution.width').validate(function (lowResolutionWidth) {
    if (this.type === 'video') {
      return lowResolutionWidth && lowResolutionWidth.length
    }
    return true
  }, 'videos.lowResolution.width cannot be blank')

  // videos.lowResolution.height cannot be blank
  PhotoSchema.path('videos.lowResolution.height').validate(function (lowResolutionHeight) {
    if (this.type === 'video') {
      return lowResolutionHeight && lowResolutionHeight.length
    }
    return true
  }, 'videos.lowResolution.height cannot be blank')

  // type cannot be blank
  PhotoSchema.path('type').validate(function (type) {
    return type && type.length
  }, 'type cannot be blank')

  // hashTags cannot be blank
  PhotoSchema.path('hashTags').validate(function (hashTags) {
    return hashTags && hashTags.length
  }, 'hashTags cannot be blank')

  // link cannot be blank
  PhotoSchema.path('link').validate(function (link) {
    return link && link.length
  }, 'link cannot be blank')

  // photoId cannot be blank
  PhotoSchema.path('photoId').validate(function (photoId) {
    return photoId && photoId.length
  }, 'photoId cannot be blank')

  // photoId must be unique
  PhotoSchema.path('photoId').validate(function (photoId, callback) {
    var photoToSave = this
    var Photo = connection.model('Photo')
    Photo.findOne({ photoId: photoId }, function (error, photo) {
      if (photo) {
        // Check that it's not current photo
        if (photoToSave.photoId.toString() === photo.photoId.toString()) return callback(true)
        return callback(false)
      }
      callback(true)
    })
  }, 'Photo is already saved')
  connection.model('Photo', PhotoSchema)
}