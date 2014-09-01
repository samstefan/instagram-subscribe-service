 /*
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

module.exports = function (logger, connection) {
  logger.info('Setting up banned user model')

  /*
   * Banned User Schema
   */

  var BannedUserSchema = new Schema(
    { userId:
      { type: String
      , default: null
      }
    }
  , { collection: 'banned-users' }
  )

  connection.model('BannedUser', BannedUserSchema)
}