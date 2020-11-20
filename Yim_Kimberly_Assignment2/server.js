/* Kimberly Yim's Assignment 2: Server*/
/* From lab 13 & lab 14*/

// Define variables; From lab13
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/products.js');
const queryString = require("querystring");
var products = data.products;
const fs = require('fs')
const user_data_filename = 'user_data.json' // Sets user_data_filename to user_data.json

// checks request methods; From lab13
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

/* Processing the login; From lab 14 */
if(fs.existsSync(filename)) { // checks if file exists before reading
    stats = fs.statSync(user_data_filename); // Retrieves data from user_data.json
    console.log(`user_data.json has ${stats['size']} characters`);
} 

var data = fs.readFileSync(user_data_filename, 'utf-8') // Reads files

users_reg_data = JSON.parse(data); // want to parse it to convert the string from user_data.json into json objects

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // if user exists, get their password
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (request.body.password == users_reg_data[request.body.username].password) {
            response.send(`Thank you ${request.body.username} for logging in.`);
        } else {
            response.send(`Hey! ${request.body.password} does not match what we have for you!`);
        }
    } else {
        response.send(`Hey! ${request.body.username} does not exist!`);
    }
});

// From Rick Kazman's Lab 14 example
app.post("/process_registration", function (request, response) {
    // process a simple register form
    POST = request.body;
    console.log("Got register POST");
    if (POST["username"] != undefined && POST['password'] != undefined) {          // Validate user input
        username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.send("User " + username + " logged in");
    }
});
 
/* Processes purchase; From lab 13 */
app.post("/process_purchase", function (request, response) {
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