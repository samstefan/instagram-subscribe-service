var bunyan = require('bunyan')
  , async = require('async')

  // Load configurations
  , Properties = require('./../properties')
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
  , logger = bunyan.createLogger({name: 'Instagram Subscribe'})

// Once connected, start server
connection.once('open', function connectionOpen() {

  require(__dirname + '/../app/models/photo')(logger, connection)

  // Group options
  var options =
    { logger: logger
    , properties: properties
    , connection: connection
    }

  logger.info('Finding deleted photos')

  var Photos = require(__dirname + '/../lib/photos')
    , photos = new Photos(options)

  photos.cleanUp(function(){
    logger.info('Shutting down')
    process.kill()
  })

})