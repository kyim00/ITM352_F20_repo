var express = require('express');
var app = express();

app.get('/test', function (request, response, next) {
    response.send("Got a GET to /text path");
    next();
});

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.post("/process_form", function (request, response) {
    console.log("Got POST");
    let POST = request.body;
    //response.send(POST); 
    if (typeof POST['quantity_textbox'] != 'undefined') {
        qty = POST["quantity_textbox"];
        console.log(qty);
        if (isNonNegInt(qty, false)) {
            response.send(`<font color=blue>Thank <b>you</b> for ordering ${qty} things!</font>`);
            //window.stop();
        } else {
            response.send(`${qty} is not a quantity! Press the back button and try again.`);
        }
    }
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here
