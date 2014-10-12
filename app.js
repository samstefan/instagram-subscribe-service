var express = require('express')
  , bodyParser = require('body-parser')
  , path = require('path')
  , methodOverride = require('method-override')
  , compress = require('compression')
  , morgan = require('morgan')

module.exports = function(app, logger, properties, connection) {

  if (properties.env === 'development') {
    // Prettify HTML during development
    app.locals.pretty = true
  }

  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'))
    }
  , level: 9
  }))

  app.use(morgan('combined'))

  app.enable('jsonp callback')

  app.use(methodOverride())

  app.use(bodyParser.json())
}