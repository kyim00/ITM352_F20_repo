/* Kimberly Yim's Assignment 3: Server*/
/* Most are from lab 13, lab 14, lab 15, and Alyssa */

/* Define variables; From lab13 */
var express = require('express'); // loads express module
var app = express(); // App becomes the express module
var myParser = require("body-parser"); // loads body parser module
var data = require('./public/product_data.js'); // Data becomes the products from the product_data.js file
const queryString = require("querystring"); // Defines query string
var products = data.products; // products will be defined as the products from the product_data.js file
var nodemailer = require("nodemailer"); // Uses the node mailer module 
var path = require('path');

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

/* Processes login; Modified from our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js) & Lab 15 (Ex3.js), and Alyssa */
app.post("/check_login", function (request, response) {
    errs = {}; // Assume there are no errors at first
    var login_username = request.body["username"]; // Set var login_username to the username 
    var user_info = userdata[login_username]; // Sets user_info to username
    var login_password = request.body["password"]; // Sets login_password to password

    if (typeof userdata[login_username] == 'undefined' || userdata[login_username] == '') { // If the username is defined
        errs.username = '<font color="red">Incorrect Username</font>'; // If invalid usersername cannot be found, will send message that it's an incorrect username
        errs.password = '<font color="red">Incorrect Password</font>'; // If invalid usersername cannot be found, password cannot be found either, will send message that it's an incorrect password
    } else if (user_info['password'] != login_password) { // If their password that they entered is not defined
        errs.username = ''; // First, remove error
        errs.password = '<font color="red">Incorrect Password</font>'; // Notify them that their password is still icnorrect
    } else { // Clear errors
        delete errs.username; // Remove error
        delete errs.password; // Remove error
    };

    if (Object.keys(errs).length == 0) { // If there are no errors
        session.username = login_username; // Add logged in username to session
        var theDate = Date.now(); // Set time variable
        session.last_login_time = theDate; // Save time of login to session
        var login_name = user_info['name'];
        var user_email = user_info['email']; //sets a variable
        response.cookie('username', login_username) // Adds username to a cookie
        response.cookie('name', login_name) // Adds name to a cookie
        response.cookie('email', user_email); /// Adds email to a cookie
        response.json({}); // Parses into a json object 
    } else {
        response.json(errs); //if login is unsuccessful/invalid, shows errors 
    };
});

/* Processes login */
app.get("/login", function (request, response) {
        var login_username = request.body["username"]; // Set var login_username to the username 
        if (typeof userdata[login_username] == 'undefined' || userdata[login_username] == '') { // If the username is defined
        response.redirect('./login.html'); // Sends user back to homepage
        }
        });

/* Processes logout; Coding reference from Rianne */
app.get("/logout", function (request, response) {
    response.clearCookie('username'); // Clears cookie
    request.session.destroy(); // Destroys session
    response.redirect('./index.html'); // Sends user back to homepage
});


/* Processes registration; Ensures security since invoice is inaccessible from the URL and is sent directly to buyer's email; From our class's lab 14, Rick Kazman's Lab 14 example (ProcessLogin.js), Alyssa from ITM 352; Reference for patterns w3school <https://www.w3schools.com/tags/att_input_pattern.asp> */
app.post("/register_user", function (request, response) {
    errs = {}; // Assume no errors at first
    var registered_username = request.body["username"]; // Set registered_username to username entered in registration form
    var registered_name = request.body["name"]; // Set registered_name to name entered in registration form

    /* Username validation */
    if (registered_username == '') { // Must enter a username
        errs.username = '<font color="red">Please Enter A Username</font>'; // Error message there's no username
    } else if (registered_username.length < 4 || registered_username.length > 10) { // Username must be in between 4 to 10 characters
        errs.username = '<font color="red">Username Must Be Between 4 - 10 Characters</font>'; // Error message if it does not follow this
    } else if (isAlphaNumeric(registered_username) == false) { // Username must only contain numbers and letters
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; // Error message if it does not follow this
    } else if (typeof userdata[registered_username] != "undefined") { // Will check is username is taken or not
        errs.username = '<font color="red">Username Taken</font>'; // Error message if username is already taken
    } else {
        errs.username = null;
    }

    /* Name validation */
    if (registered_name.length > 30) { // Name must be less than 30 characters
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>'; // Error message if it does not follow this
    } else {
        errs.name = null;
    }

    /* Password validation */
    if (request.body.password.length == 0) { // User must make a password
        errs.password = '<font color="red">Please Enter A Password</font>'; // Error message there's no password
    } else if (request.body.password.length <= 6) { //Password must contain at least 6 characters 
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>'; // Error message if it does not follow this
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {// Checks if the repeated password is the same
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; // Error message if password do not match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    /* Email validation */
    if (request.body.email == '') { // User must include a email address
        errs.email = '<font color="red">Please Enter An Email Address</font>'; // Error message there's no email
    } else if (ValidateEmail(request.body.email) == false) {  // Emails must be a valid email address
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>'; // Error message if email is invalid
    } else {
        errs.email = null;
    }

    let result = !Object.values(errs).every(o => o === null);
    console.log(result);

    if (result == false) { // When all inputs are valid and there are no errors, below will get inputed into the user_data.json
        userdata[registered_username] = {}; // Creates blank object to put userdata inside
        userdata[registered_username].name = request.body.name;  // Add name to userdata
        userdata[registered_username].password = request.body.password; // Add password to userdata
        userdata[registered_username].email = request.body.email; // Add email to userdata
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2)); // Convert userdata to a string since writeFileSync can only read strings
        // Below gets saved as coookies
        response.cookie("username", registered_username);
        response.cookie("name", registered_name);
        response.cookie("email", request.body.email);
        response.json({});
    } else {
        response.json(errs);
    }
});

/* Function for username letters & number validation; Coding reference from Alyssa & w3resource - https://www.w3resource.com/javascript/form/letters-numbers-field.php */
function isAlphaNumeric(input) {
    var letterNumber = /^[0-9a-zA-Z]+$/; // Pattern that only allows letters and numbers in the username
    if (input.match(letterNumber)) { // Input must match the above requirements to be considered valid
        return true; // Returns true if matches
    }
    else {
        return false; // Returns false if invalid
    }
}

/* Function for email validation; Coding reference from Alyssa & w3resource - https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php */
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Pattern that only allows emails to be consideered as valid if they contain letter, numbers, "_", or "." 
    if (inputText.match(mailformat)) { // Input must match the above requirements to be considered valid
        return true; // Returns true if matches
    }
    else {
        return false; // Returns false if invalid
    }
}

/* Function to generate invoice; Coding reference from Alyssa & Rianne */
app.post("/generateInvoice", function (request, response) {
    var user_email = userdata[request.cookies.username].email; // setting variables
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
    <h2>Thank you for your purchase, <font color="#0033cc">${request.cookies.username}</font>! Your order was received! </h2> 
    <br>
    <h2><a href='./logout'>Please logout</a></h2>
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
            qty = cart[`${product}${i}`] // sets qty variable
            if (qty > 0) { // Compute prices if quantity is greater than 0 
                // Product row
                extended_price = qty * products[product][i].price
                subtotal += extended_price;
                str += `
                <tr>
                        <td style= "text-align: left" width="35%">${products[product][i].name}</td>
                        <td style= "text-align: left" width="35%"><img src=${products[product][i].image} style="width:50%"></td>
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
    var tax_rate = 0.0471;
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

    // From Prof Port's Assignment 3 examples - example 3
    var transporter = nodemailer.createTransport({ // Create the transporter variable
        host: 'mail.hawaii.edu', // On itmvm webserver, only works w hawaii.edu emails
        port: 25,
        secure: false, //use tls
        tls: {
            //do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'kcyim@gmail.com', // Sends the invoice from my email
        to: user_email, // Sends the email to the cookie from the account that was logged in
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

/* Processes purchase; From lab 13 & Alyssa */
app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data is in the body 
    if (typeof POST['addProducts${i}'] != 'undefined') { // If the POST request is defined
        var validAmount = true; // Defines validAmount as true
        var amount = false; // Defines amount as false
        for (i = 0; i < `${(products_array[`type`][i])} `.length; i++) { // For loop that checks the quantity entered
            qty = POST[`quantity_textbox${i} `]; // Sets the variable qty to quantity textbox 
            if (qty > 0) { // Quantity entered is valid if it's an integer greater than 0
                amount = true;
            }
            if (isNonNegInt(qty) == false) { // If isNonNegInt is false then the quantity entered was invalid
                validAmount = false;
            }
        }
        const stringified = queryString.stringify(POST); //Converts data from POST to JSON string 
        if (validAmount && amount) { //if it is a quanity and greater than 0
            response.redirect("./login.html?" + stringified); // Redirects to login if the query string is correct and they are not logged in yet
            return; // Stops function
        }
        else { response.redirect("./index.html?" + stringified) } // If customer inputs invalid quantities, will redirect back to the homepage
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