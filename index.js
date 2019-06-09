//This is the same as importing express in ionic. Express comes from the node modules.
const express = require("express");

//Creates an instance of express
const app = express();

//Allows http requests coming from different ports
const cors = require("cors");
app.use(cors());

//Requires the database index
var mysqlConn = require("./db.js");

// Imports instance of user model
let myUsermodel = require("./models/user-model");

// Imports instance of user model
let myPropertymodel = require("./models/property-model");

//Imports instance of booking model
let myBookingmodel = require("./models/booking-model");

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