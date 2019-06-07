const express = require("express");
const router = express.Router();

//Requires the database index
var connection = require("../db.js");

// Imports instance of user model
let myUsermodel = require("../models/user-model");

//Includes the file system ting for writing and reading
var fs = require("fs");

// //Registers a new user
router.post("/register", (req, res) => {
    const user = req.body;

    //The code that follows checks if all necessary information was included in the http request.
    const bodyFirstname = user.firstname;
    const bodyLastname = user.lastname;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    var errors = [];
    if (!bodyFirstname) {
        errors.push({ message: "Invalid firstname" });
        // return res.status(400).json({message: "Invalid firstname"});
    }

    if (!bodyLastname) {
        errors.push({ message: "Invalid lastname" });
        // return res.status(400).json({message: "Invalid lastname"});
    }

    if (!bodyEmail) {
        errors.push({ message: "Invalid email" });
        // return res.status(400).json({message: "Invalid email"});
    }

    if (!bodyPassword) {
        errors.push({ message: "Invalid password" });
        // return res.status(400).json({message: "Invalid password"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorMessages: errors });
    }

    //Creates user!!!
    myUsermodel.createUser(user, (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY') {
                //Status code 400 means client error (bad request)
                return res.status(400).json({ message: err.sqlMessage });
            } else {
                //Status code 500 means internal server error (client can't do anything).
                return res.status(500).json({ message: "Failed to insert. Please try again" });
            }
        }

        //Creates an anonymous user object to return to the client
        var responseUser = {
            //insertId is provided by the database when it returns result
            id: result.insertId,
            firstname: user.firstname,
            lastname: user.email,
            password: user.password
        };

        //Returns the newly created user to the client
        return res.status(200).json(responseUser);
    });
});

//Finds a user by ID
router.get("/:id", (req, res) => {
    const userId = req.params.id;

    //Checks that the query parameter is an integer
    const numberUserId = parseInt(userId);
    if (isNaN(numberUserId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!userId) {
        return res.status(400).json({ message: "Please pass in a userId" });
    }

    console.log(userId);

    //Searches for user
    myUsermodel.getUserById(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to select" });
        }
        if (result.length === 0) {
            return res.status(404).json({ messaage: "No user found for ID" });
        }

        const userResponse = {
            id: result[0].id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: result[0].email
            //Hides password...
        };

        //Returns the user to the client
        return res.status(200).json(userResponse);
    });
});


//Logs a user in
router.post("/login", (req, res) => {
    const authReq = req.body;

    connection.query("SELECT * FROM user WHERE email = ? AND password = ?",
        [
            authReq.email,
            authReq.password
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Failed to login" });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const responseUser = {
                id: result[0].id,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                email: result[0].email
            };

            res.json(responseUser);
        }
    );
});

// //Allows a user to update their information
// router.post("/update", (req, res) => {
//     const user = req.body;
//     fs.readFile("./data/userdata.json", function (err, data) {
//         if (err) {
//             throw err;
//         } else {
//             if (data.length > 0) {
//                 var parseData = JSON.parse(data);
//                 parseData.users = parseData.users.filter(existingUser => {
//                     return existingUser.email !== user.email;
//                 });

//                 const updateUser = {
//                     name: user.firstname,
//                     lastname: user.lastname,
//                     email: user.email,
//                     password: user.password,
//                     cellPhone: user.cellPhone,
//                     role: user.role
//                 };

//                 parseData.users.push(updateUser);
//                 fs.writeFile("./data/userdata.json", JSON.stringify(parseData), function (err) {
//                     if (err) {
//                         throw err;
//                     }
//                     res.json(updateUser);
//                     console.log("User updated successfully");
//                 });
//             } else {
//                 throw new Error("No users exist");
//             }
//         }
//     });
// });



// ------------TRYING TO GET THE POSTMAN FUNCTIONS TO WORK WITH MYSQL-------------------

// //Registers a new user
// router.post("/register", (req, res) => {
//     const user = req.body;

//     //The code that follows checks if all necessary information was included in the http request.
//     const bodyFirstname = user.firstname;
//     const bodyLastname = user.lastname;
//     const bodyEmail = user.email;
//     const bodyPassword = user.password;

//     var errors = [];
//     if (!bodyFirstname) {
//         errors.push({ message: "Invalid firstname" });
//         // return res.status(400).json({message: "Invalid firstname"});
//     }

//     if (!bodyLastname) {
//         errors.push({ message: "Invalid lastname" });
//         // return res.status(400).json({message: "Invalid lastname"});
//     }

//     if (!bodyEmail) {
//         errors.push({ message: "Invalid email" });
//         // return res.status(400).json({message: "Invalid email"});
//     }

//     if (!bodyPassword) {
//         errors.push({ message: "Invalid password" });
//         // return res.status(400).json({message: "Invalid password"});
//     }

//     if (errors.length > 0) {
//         return res.status(400).json({ errorMessages: errors });
//     }

//     //Checks user against existing user database, and if no errors, adds user to the database.
//     fs.readFile("./data/userdata.json", function (err, data) {
//         if (err) {
//             throw err;
//         } else {
//             let newID = 0;

//             //Checks email against database.
//             if (data.length > 0) {
//                 var parseData = JSON.parse(data);
//                 parseData.users.forEach(existingUser => {
//                     if (existingUser.email == user.email) {
//                         return res.json({ message: "Email exists already!" });
//                     } else {
//                         newID++;
//                     }
//                 });
//             }
//             //Initializes user to database
//             const newUser = {
//                 id: (newID + 1).toString(),
//                 firstname: user.firstname,
//                 lastname: user.lastname,
//                 email: user.email,
//                 password: user.password,
//                 cellphone: user.cellPhone,
//                 role: user.role
//             };
//             parseData.users.push(newUser);
//             res.json(newUser);
//             fs.writeFile("./data/userdata.json", JSON.stringify(parseData), function (err) {
//                 if (err) {
//                     throw err;
//                 }
//                 console.log("Registration successful");
//                 return parseData.users;
//             });
//         }
//     });
// });

module.exports = router;