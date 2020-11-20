/* Kimberly Yim's Assignment 1: Server*/
/* From lab 13 */

// Define variables; From lab13
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/products.js');
const queryString = require("querystring");
var products = data.products;

// checks request methods; From lab13
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
        let POST = request.body;
    /* validation */
    if (typeof POST['submit_purchase'] != 'undefined') {
        var hasValidQuantities=true; // Defines hasValidQuantities as true
        var hasQuantities=false; // Defines hasQuantities as false
        for (i = 0; i < products.length; i++) { // For loop that checks the quantity entered
                 q=POST[`quantity${i}`];
                hasQuantities=hasQuantities || q>0;
                hasValidQuantities=hasValidQuantities && isNonNegInt(q);
         }
    /* If data is valid, generate invoice */
        const qString = queryString.stringify(POST); // Strings query
        if (hasValidQuantities && hasQuantities) { 
            response.redirect("./invoice.html?" + qString); // Redirects to invoice if the query string is correct
        }
        else { 
            response.redirect("./earrings.html?" + qString); // If customer inputs invalid quantities, will redirect back to the earrings page
        }
     }
    });

// This function returns true if q is a non-negative integer. If returnErrors=true, it will return the array of reasons it is not a non-negative integer; Lab 13
function isNonNegInt(q, returnErrors = false) {
    errors = []; // Assume no errors at first
    if (q == '') q = 0; // Sets quantity to 0
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // Sets static route
app.listen(8080, () => console.log(`listening on port 8080`)); // Will listen to the port 8080 and in node outputs that it's listening