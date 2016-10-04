var express = require('express');
var path = require('path')
var app = express();
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var MongoClient = mongodb.MongoClient;
var mongourl = process.env.mongolab_url
var input = ''
var api = require("/app/api-url.js")
var hosturl = 'https://apidevelopmentprojects-anknits.c9users.io'

// function getMaxId(db){
//   var id = db.collection('urlcoll').find({},{_id : 1}).sort({_id : -1}).limit(1)
//   return id[0]
// }

//function dbOperations(redirect){
MongoClient.connect(mongourl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
    console.log('Connection established to', mongourl);
    var coll = db.collection('urlcoll')
    // if (redirect !=1)
    // {
    //     coll.find({originalurl: input}).limit(1).toArray(function(error,documents){
    //     if (error) throw error
    //     if(documents.length == 1)
    //       return documents[0]._id
    //     else
    //     {
    //       var ret = coll.insertOne({_id : getMaxId(db)+1,originalurl : input})
    //       return ret.insertedId
    //     }
    // })
    // }
    // else{
    //   var doc = coll.findAndModify({ query: {_id : input}, update: { $inc: { hits: 1 } }, fields: {originalurl : 1}})
    //   return doc[0].originalurl
    // }
    api(app,db)
    db.close();
  }
});
//}

// app.get('/new/:url*', function (req, res) {
//     input = req.params.url
//     if (validUrl.isUri(input)){
//       // get id from input url
//       var id = dbOperations(0)
//       var shorturl = hosturl+"/"+id
//       res.send(JSON.stringify({"original_url: " : input , "short_url: " : shorturl}));  
//     } else {
//         res.send(JSON.stringify({" the url doesn't exist on our database: " : input}))
//     }
    
// });

// app.get('/:url', function(req,res){
//   input = req.params.url
//   if (validUrl.isUri(input)){
//     var originalurl = dbOperations(1)
//     res.redirect(originalurl)
//   }
//   else {
//     res.send(JSON.stringify({" the url you passed seems invalid: " : input}))
//     }
// })

// app.get('/', function(req, res) {
//   res.send('hello world');
// });


app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port', process.env.PORT);
});
