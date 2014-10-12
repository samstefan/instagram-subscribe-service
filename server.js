var bunyan = require('bunyan')

  // Load configurations
  , Properties = require('./properties')
  , properties = new Properties()

  // Bootstrap database connection
  , mongoose = require('mongoose')
  , connection = mongoose.createConnection(
      'mongodb://' + properties.database.user + ':' +
      properties.database.pass + '@' +
      properties.database.host + ':' +
      properties.database.port + '/' +
      properties.database.name
    )

  // Configure logger
  , logger = bunyan.createLogger({name: 'Bestival-Live'})
  , Subscriptions = require('./lib/subscriptions')

// Once connected, start server
connection.once('open', function connectionOpen() {

  // Bootstrap models
; [ 'photo'
  , 'subscription'
  ].forEach(function (model) {
    require(__dirname + '/app/models/' + model)(logger, connection)
  })

  // Group options
  var options =
    { logger: logger
    , properties: properties
    , connection: connection
    }

  // Bootstrap subscriptions
  var subscriptions = new Subscriptions(options)
  subscriptions.load(function (error) {
    // Bootstrap routes
    require(__dirname + '/app/controllers/subscribe')(options)

    logger.info('Starting instagram subscription')
  })

})