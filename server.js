var express = require('express');
var jsdom  = require('jsdom');
var recipes = [];

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
  if(! /^[a-z]+$/.test(ingredient)) {
    res.send('I can\'t cook with this, pick something else!');
    return;
  }
  request_recipes(ingredient, function(err, recipes) {
    var random_recipe = recipes[Math.floor(Math.random() * recipes.length)];
    let data = {
      response_type: 'in_channel',
      text: 'Check out this ' + ingredient + ' vegan recipe!',
      attachments:[
        {
          title: random_recipe.title,
          title_link: random_recipe.url,
          image_url: random_recipe.picture
        }
      ]};
    res.json(data);
  });
});

function request_recipes(ingredient, callback) {
  var url = 'https://www.bbcgoodfood.com/search/recipes?query=Vegan+' + ingredient;
  recipes = [];
  jsdom.env({
    url: url,
    scripts: ['http://code.jquery.com/jquery.js'],
    done: function (errors, window) {
      get_recipes(errors, window);
      callback(null, recipes);
    }
  });
}

function get_recipes(errors, window) {
  var $ = window.$;
  console.log("Test recipe title");
  $(".teaser-item__image").children("a").each(function() {
    var recipe = {
      "title": $(this).children("img").attr("alt"),
      "url": "https://www.bbcgoodfood.com" + $(this).attr("href"),
      "picture": "https:" + $(this).children("img").attr("src")
    };
    console.log(" -", recipe["title"]);
    console.log("url:", recipe["url"]);
    console.log("recipe_picture:", recipe["picture"]);
    recipes.push(recipe);
  });
  console.log("Recipes:", recipes);
}

