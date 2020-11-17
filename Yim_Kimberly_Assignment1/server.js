/* Kimberly Yim's Assignment 1: Server*/
/* From lab 13 */

// Define variables; From lab13
var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var querystring = require('querystring')
var products = data.products;

// checks request methods; From lab13
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) { // will post to process_form
    let POST = request.body;
});

// This function returns true if q is a non-negative integer. If returnErrors=true, it will return the array of reasons it is not a non-negative integer; Lab 13
function isNonNegInt(q, returnErrors = false) {
    errs = []; // assume no errors at first
    if (Number(q) != q) errs.push('Not a number!'); // Check if string is a number value
    if (q < 0) errs.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errs.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errs : (errs.length == 0);
}

// Process multiple quantities; Lab 13
    if (typeof POST['submit_purchase'] != 'undefined') {
        var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
        receipt = '';
        for (i in products) {
            let q = POST[`quantity_textbox${i}`];
            let name = products[i]['name'];
            let name_price = products[i]['price'];
            if (isNonNegInt(q)) {
                receipt += eval('`' + contents + '`'); // Render template string
            } else {
                receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
            }
        }
        response.send(receipt);
        response.end();
    }

// Strings query; From lab 13
qString = querystring.stringify(POST);
   if (hasValidQuantities == true && hasPurchases == true) { 
       response.redirect("./invoice.html?" + qString); // Redirects to invoice if the query string is correct
   }
   else { 
       response.redirect("./earrings.html?" + qString); // If customer inputs invalid quantities, will redirect back to the earrings page
   }

app.use(express.static('./public')); // Sets static route
app.listen(8080, () => console.log(`listening on port 8080`)); // Will listen to the port 8080 and in node outputs that it's listening