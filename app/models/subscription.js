 /*
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

module.exports = function (logger, connection) {
  logger.info('Setting up subscription model')

  /*
   * Subscription Schema
   */

  var SubscriptionSchema = new Schema(
    { name:
      { type: String
      , default: null
      }
    , hashtag:
      { type: String
      , default: null
      }
    , dateCreated:
      { type: Date
      , default: Date.now
      }
    }
  , { collection: 'subscriptions' }
  )

  connection.model('Subscription', SubscriptionSchema)
}