/* Kimberly Yim's Assignment 1: Server*/
/* Used Assignment1 examples & lab 13 as reference*/

// Define variables
var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;

// checks request methods
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) { // will post to process_form
    let POST = request.body;
    process_quantity_form(POST, response)
});

// This function returns true if q is a non-negative integer. If returnErrors=true, it will return the array of reasons it is not a non-negative integer
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

// Process multiple quantities
function process_quantity_form (POST, response) {
    if (typeof POST['submit_purchase'] != 'undefined') {
        var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
        receipt = '';
        for (i in products) {
            let q = POST[`quantity_textbox${i}`];
            let model = products[i]['name'];
            let model_price = products[i]['price'];
            if (isNonNegInt(q)) {
                receipt += eval('`' + contents + '`'); // render template string
            } else {
                receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
            }
        }
        response.send(receipt);
        response.end();
    }
}
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); //Will listen to the port 8080 and in node outputs that it's listening