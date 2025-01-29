// require('dotenv').config();

const express = require("express");
const app = express();
const https = require("https");
const http = require("http");

const port = process.env.PORT || 14925;

console.log(process.env.DATABASE_URL); // Access your DATABASE_URL
console.log(process.env.API_KEY); // Access your API_KEY
console.log(process.env.PORT); // Access your PORT

const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// app.use(cors({
//   origin: (origin, callback) => {
//     if (origin === 'http://192.168.0.2:5173') {
//       callback(null, true);  // Allow the origin
//     } else {
//       callback(new Error('Not allowed by CORS'));  // Reject the origin
//     }
//   }
// }));

const CollectionRoute = require("./Route/CollectionRoute");
app.use(CollectionRoute);

const UserRoute = require("./Route/UserRoute");
app.use(UserRoute);

app.get("/hi", (req, res) => {
  res.send("would");
});

app.get("/signin", (req, res) => {
  const username = req.query["username"];
  const password = req.query["password"];
  if (username === "admin" && password === "80121") {
    res.send("Login Sucess");
  }
  res.send("login failed");
  // console.log(username +" "+password)
  // res.send("Data Recived")
});

app.get("/htmls", (req, res) => {
  const htmls = `
      <div>
        <h2>Login</h2>
        <form action="/login" method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required /><br />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required /><br />
          <button type="submit">Submit</button>
        </form>
      </div>
    `;
  res.send(htmls);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match any in the "database"
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.send(`<h1>Welcome, ${user.username}!</h1>`);
  } else {
    res.send("<h1>Invalid username or password</h1>");
  }
});

app.get("/employee_account_created", (req, res) => {
  const employee_insert = `
    <div class="modal">
      <div class="modal-header">
        <h5 class="modal-title">Add New Employee</h5>
      </div>
      <div class="modal-body">
        <form action="/signup" method="POST">
          <div class="txt_field">
            <input type="text" name="username" required />
            <label>Employee Name</label>
          </div>
          <div class="txt_field">
            <input type="text" name="phone_number" required />
            <label>Employee Contact Number</label>
          </div>
          <div class="txt_field">
            <input type="text" name="city" required />
            <label>City</label>
          </div>
          <div class="txt_field">
            <select name="role" required>
              <option value="">Employee Role</option>
              <option value="Admin">Admin</option>
              <option value="Collection Manager">Collection Manager</option>
              <option value="Collection Agent">Collection Agent</option>
            </select>
          </div>
           <div class="txt_field">
 <input type="file" name="photo" />
</div>   
          <div class="txt_field">
            <input type="email" name="email" required />
            <label>Enter The Email</label>
          </div>
          <div class="txt_field">
            <input type="password" name="password" required />
            <label>Enter the Password</label>
          </div>
          <div class="txt_field">
            <input type="password" name="confirmpassword" required />
            <label>Confirm the Password</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary">Close</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
  res.send(employee_insert);
});

app.get("/employee_account_login", (req, res) => {
  const employee_login = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Employee Login</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container mt-5">
          <h1>Login</h1>
          
          <!-- Error message section (optional) -->
          <div id="error-message" style="text-align: center; color: red;"></div>
  
          <form action="/login" method="POST">
            <div class="txt_field">
              <input type="email" name="email" required placeholder="Enter your email" />
              <label>Email</label>
            </div>
            
            <div class="txt_field">
              <input type="password" name="password" required placeholder="Enter your password" />
              <label>Password</label>
            </div>
            
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </body>
      </html>
    `;
  res.send(employee_login);
});

//   app.post('/')

//Client Account Created
app.get("/client_account_created", (req, res) => {
  const account_insert = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Add New Client</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container mt-5">
          <div class="modal-header">
            <h5 class="modal-title">Add New Client</h5>
          </div>
          <div class="modal-body">
            <form action="/acc_insertarrays" method="POST">
              <div class="txt_field">
                <input type="text" name="client_name" required />
                <label>Client Name</label>
              </div>
  
              <div class="txt_field">
                <input type="text" name="client_contact" required />
                <label>Client Contact Number</label>
              </div>
  
              <div class="txt_field">
                <input type="text" name="client_city" required />
                <label>City</label>
              </div>
  
              <div class="txt_field">
                <input type="number" name="amount" required />
                <label>Amount</label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary">Close</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;

  res.send(account_insert);
});

//   app.post('/acc_insertarrays',(req,res)=>{
//     const { client_name, client_contact, client_city, amount} = req.body;
//   res.send('Client data received and processed');
// });

// Provide the paths to your SSL certificate and private key
// const options = {
//   key: fs.readFileSync('path_to_your_private_key.pem'),
//   cert: fs.readFileSync('path_to_your_certificate.pem')
// };

// Create an HTTPS server and pass the options (certificate and key) to it
// https.createServer(options, app).listen(443, () => {
//   console.log('HTTPS server running on https://localhost:443');
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// const server = http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World');
// });

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// # Generate private key
// openssl genpkey -algorithm RSA -out private_key.pem

// # Generate self-signed certificate
// openssl req -new -x509 -key private_key.pem -out certificate.pem -days 365
