var mongoose = require('mongoose')
  , Schema = mongoose.Schema

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
  )

  connection.model('Photo', PhotoSchema)
}