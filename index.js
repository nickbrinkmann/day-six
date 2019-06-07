//This is the same as importing express in ionic. Express comes from the node modules.
const express = require("express");

//Requires the database index
var mysqlConn = require("./db.js");

// Imports instance of user model
let myUsermodel = require("./models/user-model");





// let test = {
//     firstname: "Johnny",
//     lastname: "Doe",
//     email: "email@email.com",
//     password: "sillypassword",
//     role: "consumer"
// };

// myUsermodel.createUser(test, (err, res) => {
//     if (err) {
//         console.log("error: ", err);
//         // result(err, null);
//     } else {
//         console.log(res.insertId);
//         // result(null, res.insertId);
//     }
// });

// //TEST2 It works!
// mysqlConn.query("INSERT INTO user SET ?", test, function(err) {
//     if(err) {
//         console.log("error: ", err);
//     } else {
//         console.log(test.id);
//         console.log("success");
//     }
// });

// //Insert/Create User in Database Model (function)
// User.createUser = function(newUser, result) {
//     connection.query("INSERT INTO user set ?", newUser, function(err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         } else {
//             console.log(res.insertId);
//             result(null, res.insertId);
//         }
//     });
// }

//CREATE A USER FILE AND UNCOMMENT
const User = require("./models/user-model");

//Creates an instance of express
const app = express();

//Allows http requests coming from different ports
const cors = require("cors");
app.use(cors());

//This tells Express that we want to use JSON in our HTTP requests and responses.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Requires the users index
const usersRouter = require("./users/users");
app.use("/api/users", usersRouter);

//Requires the properties index
const propertiesRouter = require("./properties/properties");
app.use("/api/properties", propertiesRouter);


//Dummy return, as far as I can see
app.get("/", (req, res) => {
    console.log(req.headers);
    res.send("GET default page");
});

//Listen on port 3000
const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.log("OOPSIES!");
        return;
    }

    console.log("Server running on port 3000");
});