module.exports = function(app, db) {

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
    var id = Number(input)
    if (validateURL(process.env.app_url+input)){
    if (input != 'favicon.ico'){
    //searchDbForId(input,db)
    var coll = db.collection('urlcoll')
    coll.findOne({"_id": id}, function(error,documents){
        if (error) throw error
        if(documents)
           res.redirect(documents.originalurl)
        else
        {
          res.send(JSON.stringify({" the url doesn't exist on our database " : input}))
        }
    })
    }
  }
  else {
    res.send(JSON.stringify({" Please make sure this is a valid url " : input}))
  }
}

function searchAndCreate(req,res){
    var input = req.url.slice(5)
    if (validateURL(input)){
      // get id, make short-url and display
      searchDbForLink(input,db,res)
    } else {
      res.send(JSON.stringify({" Please make sure this is a valid url " : input}))
    }
}

function searchDbForLink(link,db,res){
    var coll = db.collection('urlcoll')
    // first search if id exists in database. if yes, return it. else create Id.
    coll.find({"originalurl": link}, {"_id" : 1}).toArray(function(err,data){
    if (err) throw err
    if(data.length){
      var shorturl = process.env.app_url + data[0]._id.toString()
      res.send(JSON.stringify({"original_url: " : link , "short_url: " : shorturl}));  
    }
    else{
      createId(link,db,res)
    }
  })
}

function createId(link,db,res){
  var coll = db.collection('urlcoll')
  coll.find().sort({"_id" : -1}).limit(1).toArray(function (err,data){
    if (err) throw err
    insert(data[0]._id,link,db,res)
  })
}

function insert(id, link,db,res){
  var coll = db.collection('urlcoll')
  coll.insertOne({"_id" : id + 1, "originalurl" : link})
  var shorturl = process.env.app_url + (id+1).toString()
  res.send(JSON.stringify({"original_url: " : link , "short_url: " : shorturl}));
}

function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

}
