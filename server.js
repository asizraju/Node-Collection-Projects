// require('dotenv').config();

const express = require("express");
const app = express();
const https = require("https");
const http = require("http");

const port = process.env.PORT || 14930;

console.log(process.env.DATABASE_URL); // Access your DATABASE_URL
console.log(process.env.API_KEY); // Access your API_KEY
console.log(process.env.PORT); // Access your PORT

const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const CollectionRoute = require("./Route/CollectionRoute");
app.use(CollectionRoute);

const UserRoute = require("./Route/UserRoute");
app.use(UserRoute);

app.get("/hi", (req, res) => {
  res.send("Welcome To Collection-Project");
});


// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   // Check if the username and password match any in the "database"
//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );

//   if (user) {
//     res.send(`<h1>Welcome, ${user.username}!</h1>`);
//   } else {
//     res.send("<h1>Invalid username or password</h1>");
//   }
// });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
