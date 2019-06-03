const express = require("express");
const router = express.Router();

let users = new Array();

var fs = require("fs");

router.post("/register", (req, res) => {
    const user = req.body;
    fs.readFile("./data/data.json", function(err, data) {
        if (err) {
            throw err;
        } else {
            let newID = 0;
            if (data.length > 0) {
                var parseData = JSON.parse(data);
                parseData.users.forEach(existingUser => {
                    if (existingUser.email == user.email) {
                        throw new Error("Email exists already!");
                    } else {
                        newID++;
                    }
                });
            }
            const newUser = {
                id: (newID + 1).toString(),
                firstname: user.firstname,
                lastname: user.lastname,
                cellphone: user.cellPhone,
                email: user.email,
                password: user.password,
                role: user.role
            };
            parseData.users.push(newUser);
            res.json(user);
            fs.writeFile("./data/data.json", JSON.stringify(parseData), function(err) {
                if (err) {
                    throw err;
                }
                console.log("Registration successful");
                return parseData.users;
            });
        }
    });
});

router.post("/login", (req, res) => {
    const user = req.body;
    fs.readFile("./data/data.json", function(err, data) {
        if (err) {
            throw err;
        } else {
            if (data.length > 0) {
                let parseData = JSON.parse(data);
                parseData.users.forEach(existingUser => {
                    if (existingUser.email == user.email && existingUser.password == user.password) {
                        console.log("Login Successful!");
                        res.json();
                        return;
                    }
                });
            } else {
                throw new Error("No information given");
            }
        }
    });
});

router.post("/", (req, res) => {
    console.log(req.body);
// Here I'm expecting a push of the form below:
//      * POST http://localhost:3000/api/users
//      * {
//      *   "firstname": "Miki",
//      *   "lastname": "von Ketelhodt",
//      *   "email": "miki@ixperience.co.za",
//      *   "password": "qwerty"
//      * }
//      **/

    const user = req.body;
    console.log(user);
    let bodyFirstname = user.firstname;
    let bodyLastname = user.lastname;
    let bodyEmail = user.email;
    let bodyPassword = user.password;

    const newUser = {
        id: users.length + 1,
        firstname: bodyFirstname,
        lastname: bodyLastname,
        email: bodyEmail,
        password: bodyPassword
    };
    //Pushes the new user onto the array
    users.push(newUser);

    return res.json(newUser);
// Expecting a return of the form below:
//      * {
//      *   "id": 1,
//      *   "firstname": "Miki",
//      *   "lastname": "von Ketelhodt",
//      *   "email": "miki@ixperience.co.za",
//      *   "password": "qwerty"
//      * }
//      */
});

router.get("/", (req, res) => {
    res.send(users);
});

module.exports = router;