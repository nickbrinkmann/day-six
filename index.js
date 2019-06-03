const express = require("express");

const app = express();

var properties = new Array();
// This makes the properties variable usable between functions/requests to the server. As opposed to the commented out section below

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    console.log(req.headers);
    res.send("<p>Hello der</p>");
});

app.get("/properties", (req, res) => {
    // var properties = new Array();
    // properties.push({
    //     id: 1,
    //     name: "One",
    //     location: "Litbon"
    // });
    
    res.json(properties);
});

app.post("/properties", (req, res) => {
    const property = req.body;
    properties.push(property);
    res.json(property);
    //This takes an HTTP request, pushes it onto the properties array, and returns the same request to the caller of the server
});

app.listen(3000, (err) => {
    if (err) {
        console.log("OOPSIES!");
        return;
    }

    console.log("Server listening port 3000");
});

console.log("This app runs lol");
// This runs before the 'Server listening ...'