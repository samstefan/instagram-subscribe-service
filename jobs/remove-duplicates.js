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

  var Photo = connection.model('Photo')

  logger.info('Finding duplicate images')
  Photo.find({}, function (error, photos) {
    if (error) {
      logger.error(error)
    } else {
      async.each(photos, function(photo, callback) {
        var instagramId = photo.instagramId
        Photo.find({instagramId: instagramId}, function  (error, photos) {
          if (error) {
            logger.error(error)
          } else {
            if (photos.length > 1) {
              logger.info(instagramId + ' is a duplicate, removing')
              Photo.findOneAndRemove({instagramId: instagramId}, function (error) {
                if (error) {
                  logger.error(error)
                } else {
                  logger.info(instagramId + ' removed')
                }
                callback()
              })
            } else {
              callback()
            }
          }
        })
      }, function (error) {
        process.kill()
      })
    }
  })

})