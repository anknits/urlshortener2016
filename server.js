var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongourl = process.env.mongolab_url
var api = require("./app/api-url.js")
//var hosturl = 'https://apidevelopmentprojects-anknits.c9users.io'

MongoClient.connect(mongourl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
    console.log('Connection established to database');
    //var coll = db.collection('urlcoll')
    api(app,db)
  }
});

var port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port', port);
});
