module.exports = function(app, db) {
var validUrl = require('valid-url');

app.route('/:url')
.get(searchAndRedirect);

app.route('/new/:url*')
.get(searchAndCreate);

app.route('/')
.get(function(req, res) {
  res.send('hello world');
});

function searchAndRedirect(req,res){
    var input = req.params.url
    // get id from input url
    var id = input
    if (validUrl.isUri(input)){
    //searchDbForId(input,db)
    var coll = db.collection('urlcoll')
    coll.find({"_id": id}).limit(1).toArray(function(error,documents){
        if (error) throw error
        if(documents.length == 1)
           res.redirect(documents.originalurl)
        else
        {
          res.send(JSON.stringify({" the url doesn't exist on our database: " : input}))
        }
    })
  }
  else {
    res.send(JSON.stringify({" Please make sure this is a valid url: " : input}))
  }
}

function searchAndCreate(req,res){
    var input = req.params.url.slice(5)
    if (validUrl.isUri(input)){
      // get id, make short-url and display
      var id = searchDbForLink(input,db)
      var shorturl = process.env.app_url+"/"+id
      res.send(JSON.stringify({"original_url: " : input , "short_url: " : shorturl}));  
    } else {
      res.send(JSON.stringify({" Please make sure this is a valid url " : input}))
    }
}

function searchDbForLink(link,db){
    var coll = db.collection('urlcoll')
    // first search if id exists in database. if yes, return it. else create Id.
    coll.find({originalurl: link}).limit(1).toArray(function(error,documents){
        if (error) throw error
        if(documents.length == 1)
           return documents._id
        else
        {
          var id = createId() + 1
          var ret = coll.insertOne({"_id" : id, "originalurl" : link})
          return ret.insertedId
        }
})
}

function createId(){
  return db.collection('urlcoll').find({},{_id : 1}).sort({_id : -1}).limit(1)
}
//module.exports = router;
}
