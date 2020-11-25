/* Kimberly Yim's Assignment 2: Server*/
/* Most are from lab 13 & lab 14 */

/* Define variables; From lab13 */
var express = require('express'); // loads express module
var app = express(); // App becomes the express module
var myParser = require("body-parser"); // loads body parser module
var data = require('./public/products.js'); // Data becomes the products from the products.js file
const queryString = require("querystring"); // Defines query string
var products = data.products; // products will be defined as the product from the product.js file

/* Defining variables for the user_data.json; From lab 14 */
const fs = require('fs') // loads fs modules
const filename = 'user_data.json' // Sets filename to user_data.json

// checks request methods; From lab13
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});
app.use(myParser.urlencoded({ extended: true }));

/* Checking and reading the file to ensure it exists; Modified from our class's lab 14 & Rick Kazman's Lab 14 example */
if (fs.existsSync(filename)) { // checks if file exists before reading
    var data = fs.readFileSync(filename, 'utf-8') // Reads files
    stats = fs.statSync(filename); // Retrieves data from user_data.json
    users_reg_data = JSON.parse(data); // want to parse it to convert the string from user_data.json into json objects
} else {
    console.log("Sorry, we can't find" + filename); // Message if the filename does not exist
}


/* Processes login; Modified from our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js), Daphne from ITM 352, and stackoverflow <https://stackoverflow.com/questions/53915510/req-body-username-and-req-body-password-are-undefined> */
app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    var login_error = [];
    console.log(request.query);
    LowerCase_username = request.body.username.toLowerCase(); // Sets username to lowercase
    // if user exists, get their password
    if (typeof users_reg_data[LowerCase_username] != 'undefined') { // Checks if username is in the system
        if (users_reg_data[LowerCase_username].password == request.body.password) {
            request.query.username = LowerCase_username; // Username gets added to the query object
            console.log(users_reg_data[request.query.username].name);
            request.query.name = users_reg_data[request.query.username].name
            response.redirect('/invoice.html?' + queryString.stringify(request.query)); // Redirects to invoice if username and password is valid
        } else { // Pushes to invalid password
            login_error.push = ('Invalid Password');
            console.log(login_error)
            request.query.username = LowerCase_username;
            request.query.name = users_reg_data[LowerCase_username].name;
            request.query.login_error = login_error.join(';');
        }
    } else { // Pushes to invalid username
        login_error.push = ('Invalid Username');
        console.log(login_error)
        request.query.username = LowerCase_username;
        request.query.login_error = login_error.join(';');
    }
    response.redirect('./login.html?' + queryString.stringify(request.query)); // Redirects back to login page if password or username is incorrect
});


/* Processes registration; From our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js), and Daphne from ITM 352; Reference for patterns from Alyssa and w3school <https://www.w3schools.com/tags/att_input_pattern.asp> */
app.post("/process_registration", function (request, response) {
    var errors = [];
    console.log(request.body);
    LowerCase_username = request.body.username.toLowerCase(); // Sets username to lowercase
    /* Full name validation */
    if (/^[A-Za-z]+$/.test(request.body.name)) { // Only allows the usage of letters when inputting full name into the form
    } else {
        errors.push('Please only use letters for full name');
    } 
    if (request.body.name == "") { // Validating that it is a full name
        errors.push('Invalid full name');
    }
    if ((request.body.fullname.length > 30)) {
        errors.push('Full name is too long; Maximum is 30 characters')
    }

    /* Username validation */
    if (typeof users_reg_data[LowerCase_username] != 'undefined') { // If username is taken (already in user_data.json), notify user
        errors.push("Username is already taken");
    }
    if (/^[0-9a-zA-Z]+$/.test(request.body.LowerCase_username)) { // Only allows the usage of letters and numbers when inputting username into the form
    } else {
        errors.push('Please only use letters & numbers for username');
    }
    if ((request.body.username.length > 10)) { // Notifies user if username is too long
        errors.push('Username is too long; Maximum is 10 characters');
    }
    if ((request.body.username.length < 4)) { // Notifies user if username is too short
        errors.push('Username is too short; Minimum is 4 characters');
    }

    /* Password validation */
    if (request.body.password.length < 6) { // Notifies user if password is too short
        errors.push('Password is too short; Minimum is 6 characters')
    }
    if (request.body.password !== request.body.repeat_password) { // Notifies user if password and their repeated passwords do not match up
        errors.push('Passwords do not match');
    }

    /* Email validation */
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email)) { // only allows letters and numbers for the user address and letters for the domain name
    } else {
        errors.push('Please enter a valid email');
    }

    /* If there are no errors, save the user's registration to user_data.json */
    if (errors.length == 0) {
        console.log(errors)
        var username = request.body.username // Allows variable username to get the username data from the body
    /* The following will get inputted to the user_data.json */
        users_reg_data[username] = {};
        users_reg_data[username].name = request.body.name;
        users_reg_data[username].username = request.body.username
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); // Gets written into user_data.json as a string
        response.redirect('./invoice.html?' + queryString.stringify(request.query)); // Redirects to invoice if all is ok
    } else { 
    /* If there are errors, send the user back to the registration page */
        console.log(errors)
    /* Make login values sticky */
        request.query.name = request.body.name;
        request.query.username = request.body.username;
        request.query.password = request.body.password;
        request.query.repeat_password = request.body.repeat_password;
        request.query.email = request.body.email;
        response.redirect('/register.html?' + queryString.stringify(request.query)); // Redirect to registration page if there are errors
    }
});


/* Processes purchase; From lab 13 */
app.post("/process_purchase", function (request, response) {
    let POST = request.body;
    /* Validation; Coding reference from Alyssa */
    if (typeof POST['submit_purchase'] != 'undefined') {
        var hasValidQuantities = true; // Defines hasValidQuantities as true
        var hasQuantities = false; // Defines hasQuantities as false
        for (i = 0; i < products.length; i++) { // For loop that checks the quantity entered
            q = POST[`quantity${i}`];
            hasQuantities = hasQuantities || q > 0; // If the quantity is greater than 0 then it's valid
            hasValidQuantities = hasValidQuantities && isNonNegInt(q); // Valid if the there are valid quantities and returnErrors is false
        }
        /* If data is valid, generate invoice */
        const qString = queryString.stringify(POST); // Strings query
        if (hasValidQuantities && hasQuantities) {
            response.redirect("./login.html?" + qString); // Redirects to login if the query string is correct
        }
        else {
            response.redirect("./earrings.html?" + qString); // If customer inputs invalid quantities, will redirect back to the earrings page
        }
    }
});

/* This function returns true if q is a non-negative integer. If returnErrors=true, it will return the array of reasons it is not a non-negative integer; From Lab 13 */
function isNonNegInt(q, returnErrors = false) {
    errors = []; // Assume no errors at first
    if (q == '') q = 0; // Sets quantity to 0
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

/* From lab 13 */
app.use(express.static('./public')); // Sets static route
app.listen(8080, () => console.log(`listening on port 8080`)); // Will listen to the port 8080 and in node outputs that it's listening