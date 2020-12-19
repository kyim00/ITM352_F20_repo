/* Kimberly Yim's Assignment 3: Server*/
/* Most are from lab 13 & lab 14 */

/* Define variables; From lab13 */
var express = require('express'); // loads express module
var app = express(); // App becomes the express module
var myParser = require("body-parser"); // loads body parser module
var data = require('./public/product_data.js'); // Data becomes the products from the product_data.js file
const queryString = require("querystring"); // Defines query string
var products = data.products; // products will be defined as the products from the product_data.js file
const nodemailer = require("nodemailer"); // Uses the node mailer module 

/* Defining variables for the user_data.json; From lab 14 */
var fs = require('fs') // loads fs modules
var user_info_file = 'user_data.json' // Sets userdata_file to user_data.json
var userdata_file = fs.readFileSync(user_info_file, 'utf-8');
userdata = JSON.parse(userdata_file); // Want to parse the json to convert the string from user_data.json into json objects

/* Defining variables for cookies and sessions; From lab 15 */
var cookieParser = require('cookie-parser'); // Uses cookie-parser; npm install cookie-parser
var session = require('express-session'); // Uses express-session; npm install express-session

app.use(cookieParser()); // cookieParser will receive requests and put it into objects
app.use(session({ // Coding reference Alyssa
    secret: "ITM352 rocks!", // Encrypts the session
    resave: true, // Saves the session
    saveUninitialized: false, // Deletes or forgets session when it is done
    httpOnly: false, // Doesnt allow access of cookies 
    secure: true, // Only uses cookies in HTTPS
    ephemeral: true // This deletes this cookie when browser is closed 
}));

// checks request methods; From lab13
app.use(myParser.urlencoded({ extended: true }));
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

/* Checking and reading the file to ensure it exists; Modified from our class's lab 14 & Rick Kazman's Lab 14 example */
if (fs.existsSync(userdata_file)) { // checks if file exists before reading
    var data = fs.readFileSync(userdata_file, 'utf-8') // Reads files
    stats = fs.statSync(userdata_file); // Retrieves data from user_data.json
    users_reg_data = JSON.parse(userdata_file); // want to parse it to convert the string from user_data.json into json objects
} else {
    console.log("Sorry, we can't find" + userdata_file); // Message if the userdata does not exist
}


/* Processes login; Modified from our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js) & Lab 15 (Ex3.js), and Rianne */
app.post("/process_login", function (request, response) {
    // First save the request and, in particular, the username and password
    POST = request.body;
    user_name_from_form = POST["username"].toLowerCase(); // makes it not case sensitive
    password_from_form = POST["password"];
    // console.log("User name from form=" + user_name_from_form);
    error = {};
    error.password = "";
    error.username = "";
    // Now check to see if the username and password match what is on file
    if (userdata[user_name_from_form] != undefined) {
        password_on_file = user_data[user_name_from_form].password;
        if (password_from_form == password_on_file) {
            // Good login
            request.session.username = user_name_from_form;
            if (typeof request.session.last_login != 'undefined') {
                var msg = `You last logged in at ${request.session.last_login}`;
                var now = new Date();
            } else {
                var msg = '';
                var now = 'first visit!';
            }
            request.session.last_login = now;
            // send the user a cookie with the username to show that they're logged in
            response.cookie('username', user_name_from_form);
            // response.cookie('email', user_data[user_name_from_form].email);
            response.redirect('./index.html');
            return;
            // REFERENCED FROM DANIEL PORT, OFFICE HOURS APPOINTMENT 12/14
        } else { // oops password doesn't match
            error.password = 'Password does not match';
        }
    } else { // oops username doesnt exist
        error.username = 'Username does not exist';
    }
    response.redirect('./login.html?' + queryString.stringify(request.query)); // Redirects back to login page if password or username is incorrect
});

/* Processes logout; Coding reference from Rianne */
app.get("/logout", function (request, response) {
    response.clearCookie('username'); // Clears cookies to enable logout
    response.redirect('./index.html'); // Sends user back to homepage
});


/* Processes registration; From our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js), Daphne and Alyssa from ITM 352; Reference for patterns w3school <https://www.w3schools.com/tags/att_input_pattern.asp> */
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
        users_reg_data[username] = {}; // Create blank object to put our info inside; An empty "bag"
        users_reg_data[username].name = request.body.name; // Add name to object
        users_reg_data[username].username = request.body.username // Add username to object
        users_reg_data[username].password = request.body.password; // Add password to object
        users_reg_data[username].email = request.body.email; // Add email to object
        fs.writeFileSync(userdata, JSON.stringify(users_reg_data)); // Gets written into user_data.json as a string
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

/* Function to generate invoice; Coding reference from Alyssa */
app.post("/generateInvoice", function (request, response) {
    cart = JSON.parse(request.query['cartData']); //this parses the cart 
    cookie = JSON.parse(request.query['cookieData']); //this parses the cookies 
    var theCookie = cookie.split(';');
    for (i in theCookie) {
        //function from stackoverflow.com
        function split(theCookie) { //split the cookie (before "=")
            var i = theCookie.indexOf("=");

            if (i > 0)
                return theCookie.slice(0, i);//takes off the string after the =
            else {
                return "";
            }
        };

        var key = split(theCookie[i]);
        //this sets the username to the variable theUsername 
        if (key == ' username') {
            var theUsername = theCookie[i].split('=').pop();
        };
        //sets the variable to email 
        if (key == ' email') {
            var email = theCookie[i].split('=').pop();
        };
    }
    console.log(email);
    console.log(theUsername);
    console.log(theCookie);

    /* Creates invoice as a string to email to the user; Modified from previous invoice.html in Assignment 2 */
    /* Start of first string */
    str =
        `
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="products-style.css">
  <link rel="stylesheet" href="tables.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<style>
  /* Make body of page white */
  body {
    background-color: white;
  }
</style>

<!--w3schools' online store webpage template-->

<!--Create jumbotron (header on top); w3schools' template-->

<body>
  <div class="jumbotron"></div>

  <!--Create navigation bar; w3schools' template-->
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li><a href="index.html">Homepage</a></li>
          <li><a href="earrings.html">Earrings</a></li>
          <li><a href="rings.html">Rings</a></li>
          <li><a href="necklaces.html">Necklaces</a></li>
          <li><a href="bracelets.html">Bracelets</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!--Message to thank user for purchase-->
  <div class="container">
    <h2>Thank you for your purchase! Your order was received! </h2>
  </div>

    <!--Creates table; From Invoice4 WOD-->
    <table class="purchases" border="2">
      <tbody>
        <tr>
          <th style="text-align: center;" width="35%">Item</th>
          <th style="text-align: center;" width="35%">Product Image</th>
          <th style="text-align: center;" width="10%">Quantity</th>
          <th style="text-align: center;" width="10%">Price</th>
          <th style="text-align: center;" width="10%">Extended price</th>
        </tr>`;
    /* End of first string */

    /* Generates the quantities selected by customer into the invoice table; Coding reference from Invoice4 WOD, Alyssa, and Prof Port's A3 examples 2 & 3 */
    subtotal = 0; // subtotal begins at $0
    for (product in products) {
        for (i = 0; i < products[product].length; i++) {
            // Product row
            qty = cart(`${product}${i}`); // sets qty variable
            if (qty > 0) { // Compute prices if quantity is greater than 0 
                // Product row
                extended_price = qty * products[product][i].price
                subtotal += extended_price;
                str += `
                <tr>
                        <td style= "text-align: left" width="35%">${products[product][i].item}</td>
                        <td style= "text-align: left" width="35%">${products[product][i].image}</td>
                        <td width="10%">${qty}</td>
                        <td width="10%">\$${products[product][i].price}</td>
                        <td  width="10%">\$${extended_price.toFixed(2)}</td>
                    </tr>
                `;
            }
        };
    }
    /* Following codes below are modified from invoice4 WOD */
    // Compute tax
    var tax_rate = 0.04712;
    var tax = tax_rate * subtotal;

    // Compute shipping
    if (subtotal <= 149.99) {
        shipping = 3;
    }
    else if (subtotal <= 399.99) {
        shipping = 5;
    }
    else {
        shipping = 0.05 * subtotal; // 5% of total
    }

    // Compute  total
    var total = subtotal + tax + shipping;

    /* Start of second string */
    str += ` 
        <!--Calculates and generates the subtotals, tax, shipping, and total into the invoice table; From Invoice4 WOD-- >
        <tr>
          <td colspan="5" width="100%">&nbsp;</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="4" width="67%">Sub-total</td>
          <td width="54%">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="4"</td> width="67%"><td width="54%">${tax.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="4" width="67%">Shipping</span></td>
          <td width="54%">${shipping.toFixed(2)}</td>
        </tr>
            <tr>
                <td style="text-align: center;" colspan="4" width="67%"><strong>Total</strong></td>
                <td width="54%"><strong><td width="54%"><strong>${total.toFixed(2)}</strong></td>
            </tr>
      </tbody>
    </table>
  </div>
</body >
     `;
    /* End of second string */

    //this code was made with help from assignment 3 example 
    var transporter = nodemailer.createTransport({ //create the transporter variable
        host: 'mail.hawaii.edu', //note on itmvm webserver have to use the mail from hawaii.edu
        port: 25,
        secure: false, //use tls
        tls: {
            //do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'kcyim@gmail.com', // Sends the invoice from my email
        to: email, // Sends the email to the cookie from the account that was logged in
        subject: 'Invoice',
        html: str // Allows string to return to html
    };
    /* Notification in console that will notify if it was able to successfully send or whether there were errors when sending the email */
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    response.send(str); // String will be displayed in browser
});

/* Processes purchase; From lab 13 */
app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data is in the body 
    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
        var validAmount = true; //make the variable validAmount true 
        var amount = false; //make the variable amount equal to false 
        for (i = 0; i < `${(products_array[`type`][i])} `.length; i++) { //for any product
            qty = POST[`quantity_textbox${i} `]; //sets the variable qty to quantity textbox 
            if (qty > 0) {
                amount = true; //if greater than 0 it is goog 
            }
            if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
                validAmount = false; // it is not a valid amount
            }
        }
        const stringified = queryString.stringify(POST); //converts data from POST to JSON string 
        if (validAmount && amount) { //if it is a quanity and greater than 0
            response.redirect("./login.html?" + stringified); // redirect the page to login page if not logged in 
            return; //stops function
        }
        else { response.redirect("./index.html?" + stringified) } //if there is invalid sends back to home page with the string 
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