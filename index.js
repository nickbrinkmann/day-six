const express = require("express");

//Initialises express
const app = express();

let properties = new Array();
// This makes the properties variable usable between functions/requests to the server. As opposed to the commented out section below

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Requires the users index
const usersRouter = require("./users/index");
app.use("/api/users", usersRouter);



//Requires the properties index
const propertiesRouter = require("./properties/index");
app.use("/api/properties", propertiesRouter);

//Dummy return, as far as I can see
app.get("/", (req, res) => {
    console.log(req.headers);
    res.send("<p>Hello</p>");
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