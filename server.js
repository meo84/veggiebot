var express = require('express');
var jsdom  = require('jsdom');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});


app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', (req, res) => {
  let ingredient = req.body.text;
  console.log(req.body);
  console.log(req);
  if(! /^[a-z]+$/.test(ingredient)) {
    res.send('I can\'t cook with this, pick something else!');
    return;
  }
  let data = { 
    text: get_recipes(ingredient)
  };
  res.json(data);
});

function get_recipes(ingredient) {
  var url = 'https://www.bbcgoodfood.com/search/recipes?query=Vegan+' + ingredient;

  jsdom.env({
    url: url,
    scripts: ['http://code.jquery.com/jquery.js'],
    done: function (err, window) {
      var $ = window.$;
      console.log("Test recipe title");
      $(".teaser-item__image").children("a").each(function() {
        console.log(" -", $(this).children("img").attr("alt"));
        console.log("url:", "https://www.bbcgoodfood.com" + $(this).attr("href"));
        console.log("recipe_picture:", "https:" + $(this).children("img").attr("src"));
      });
    }
  });
  return url;
}

