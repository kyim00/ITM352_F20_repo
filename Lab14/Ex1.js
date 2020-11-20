var express = require('express');
var app = express();
var myParser = require("body-parser");

const fs = require('fs')
const user_data_filename = 'user_data.json'

// checks if file exists before reading
if(fs.existsSync(filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`);
} 

var data = fs.readFileSync(user_data_filename, 'utf-8') // Reads files

users_reg_data = JSON.parse(data); // want to parse it to convert the string from user_data.json into json objects

/* Add an example new user reg info */
username = 'newuser';
users_reg_data[username] = {}; // Create blank object to put our info inside; An empty "bag"
reg_data[username].password = request.body.password; // Add the new password to "bag"
reg_data[username].email = request.body.email; // Add the new email to "bag"

/* Write updated object to user_data_filename */ 
reg_info_str = JSON.stringify(users_reg_data) // users_reg_data is converted to a string because we can only write strings to the writeFileSync; has old & new data; Each new user gets overwrited
fs.writeFileSync(user_data_filename, reg_info_str) // writeFileSync can only read strings

console.log(users_reg_data, typeof users_reg_data) // users_reg_data will appear as objects



/* Server */

app.use(myParser.urlencoded({ extended: true }));
 

/* Generates registration page */
app.get("/register", function (request, response) {
    // Give a simple register form; The blank form action will psot to "/register"
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

 app.post("/register", function (request, response) {
    // process a simple register form
/* Validate the reg info */
 });

 // REPLACE THE BODY W/ YOUR LOGIN.HTML
app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });
// Access to this login is process_login

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

// console.log(users_reg_data['itm352']['password']=='grader')

app.listen(8080, () => console.log(`listening on port 8080`));
