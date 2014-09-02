var newrelic = require('newrelic')
  , express = require('express')
  , bunyan = require('bunyan')

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
  , logger = bunyan.createLogger({name: 'Meal-Planner'})
  , Subscriptions = require('./lib/subscriptions')

// Once connected, start server
connection.once('open', function connectionOpen() {

  // Bootstrap models
; [ 'photo'
  , 'subscription'
  , 'banned-user'
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

    var app = express()

    // Express settings
    require('./app')(app, logger, properties, connection)

    // Bootstrap routes
    require(__dirname + '/app/controllers/subscribe')(app, options)

    logger.info('Starting instagram subscription on port ' + properties.port)
    // Start the app by listening on <port>
    app.listen(properties.port)

    // Expose server
    exports = module.exports = app
  })

})