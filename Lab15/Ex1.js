var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var cookieParser = require('cookie-parser'); // lab 15

app.use(cookieParser()); // cookieParser will receive requests and put it into objects

app.use(myParser.urlencoded({ extended: true }));

/* lab 15 begins */
/* put BELOW app.use(cookieParser), and the app.use(myParser), since we are using that, but ABOVE app.use(static) */
app.get("/set_cookie", function (request, response) {
    response.cookie('myname','Kim', {maxAge: 5*1000}); // maxAge will set it to expire after 5 seconds
    response.send('cookie sent!') // Display message "cookie sent"
});
app.get("/use_cookie", function (request, response) {
    console.log(request.cookies);
    thename = 'ANONYMOUS';
    if(typeof request.cookies['myname'] != 'undefined') {
        thename = request.cookies("myname")
    }
    response.send('Welcome to the Use Cookie page <your name>'); // What appears in the browser
});

app.get("/use_session", function (request, response) {
    if(typeof sessionStorage.id != 'undefined') {
        response.send(`welcome, your session ID is ${session.id}`)
    }
});

/* end of lab 15 */

//check if file exits before reading 
var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(`user_data.json has ${stats['size']} characters`);
    var data = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
} else {
    console.log(`ERR: ${filename} does not exits!!!`);
}

/* lab 15 ex2d */
app.get("/login", function (request, response) {
    if(typeof request.session.lastLogin != 'undefined') {
        lastLogin = request.session.lastLogin; // Is only defined after you login
    } else {
        lastLogin = 'First login!'; // If have not logged in before it will say "first login"
    }
    str = `
<body>
Last Login = ${lastLogin}
<form action="/login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    //if user exits, get their password
    //convert all to lower case when comparing 
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (request.body.password == users_reg_data[request.body.username].password) {
            response.send(`Thank you ${request.body.username} for logging in.`);
            /* lab 15 2c */
            var now = new Date(); // Defining date
            console.log(`${request.body.username} logged in on ${now.toDateString()}`);
            request.session.lastLogin = now.toString();
            getTime();
        } else {
            response.send(`Hey! ${request.body.username} does not match what we have for you!`);
        }
    } else {
        response.send(`Hey! ${request.body.username} does not exits!`);
    }
});

app.get("/register", function (request, response) {
    str = `
<body>
<form action="/register" method="POST">
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

app.post("/process_register", function (request, response) {
    // process a simple register form
    // validate the reg info

    // if all data is valid, write to the user_data_filename and send to invoice. 
      //add example new user reg info.
      username = request.body.username; //what user typed in. Then need to check that it is not taken.
      users_reg_data[username] = {};
      users_reg_data[username].name = username;
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;
      // write updated object to user_data_filename. 
      reg_info_str = JSON.stringify(users_reg_data);
      fs.writeFileSync(filename, reg_info_str);
 });

app.listen(8080, () => console.log(`listening on port 8080`));