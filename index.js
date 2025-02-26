const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const port = process.env.port || 5000

// const bodyParser = require ("body-parser")
const twilio = require("twilio");
const router = require("./Route/UserRoute");

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))

const accountSid = "YOUR_ACCOUNT_SID";
const authToken = "YOUR_AUTH_TOKEN";
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = new twilio(accountSid, authToken);

app.post("/send_sms", (req, res) => {
  const { to, body } = req.body;

  client.messages
    .create({
      body: body,
      to: to,
      from: "YOUR_TWILIO_PHONE_NUMBER",
    })
    .then((message) => {
      res.status(200).json({ success: true, sid: message.sid });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// app.listen (port,()=>{
//     console.log(`Server Running On Port ${port}`)
// })
