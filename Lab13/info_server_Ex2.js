var express = require('express');
var app = express();
var myParser = require("body-parser"); 

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   if(isNonNegInt(POST["quantity_textbox"])) {
       response.send('Thank you for ordering ${POST["quantity_textbox"])
   }
});

app.get('/test', function (request, response, next) {
    response.send("Got a GET to /text path");
    next();
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here
