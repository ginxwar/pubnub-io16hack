var secrets = require('./secrets')

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : secrets.PUB_KEY,
    subscribe_key : secrets.SUB_KEY
})

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()


app.use(bodyParser.json())


// var message = { "patrick" : "dirtbag" }



app.post('/', function(req, res, next) {
  
  pubnub.publish({ 
    channel   : 'fromAmazonEcho',
    message   : req.body,
    callback  : function(e) { console.log( "SUCCESS!", e ); },
    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
  })
  
  pubnub.subscribe({
    channel  : "fromMusicService",
    callback : function(message) {
        console.log('message from music service: ', message)
        res.send(message)
    }
})
  
 
//   res.send(200)
  return next()
})



app.listen(process.env.PORT || 8080)