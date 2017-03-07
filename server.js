var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', (req, res) => {
  let text = req.body.text;
  let data = { 
    text: 'https://www.bbcgoodfood.com/search/recipes?query=Vegan+broccoli',
  };
  res.json(data);
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

