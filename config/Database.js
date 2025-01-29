const mysql = require("mysql2")

const connection = mysql.createPool({
    host:'localhost',
    user:"root",
    password:"9876543210",     
    database:"collection",
    waitForConnections:true,
    connectionLimit:100,
    queueLimit:0
});

// host:'106.51.180.3',
// user:"mnshar_sql", 
// password:"Hinzah@@@2024",
// database:"collection",
// waitForConnections:true,
// connectionLimit:100,
// queueLimit:0


connection.getConnection((err)=>{
    if (err) {
        console.error("Error Connecting to MySQL :",err.stack);
        return;
    }
    console.log("Connected to mySql")
})

module.exports = connection;