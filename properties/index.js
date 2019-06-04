const express = require("express");
const router = express.Router();

//Eventually we want this array to be replaced with data.json. That's already been done
//for register and login.
let properties = new Array();

var fs = require("fs");

//Creates a new property listing
router.post("/", (req, res) => {
    const property = req.body;

    //The code that follows checks if all necessary information was included in the http request.
    const bodyName = property.name;
    const bodyLocation = property.location;
    const bodyImageUrl = property.imgName;
    const bodyPrice = property.price;

    var errors = [];
    if (!bodyName) {
        errors.push({ message: "Invalid name" });
        // return res.status(400).json({message: "Invalid firstname"});
    }

    if (!bodyLocation) {
        errors.push({ message: "Invalid location" });
        // return res.status(400).json({message: "Invalid lastname"});
    }

    if (!bodyImageUrl) {
        errors.push({ message: "Invalid image url" });
        // return res.status(400).json({message: "Invalid email"});
    }

    if (!bodyPrice) {
        errors.push({ message: "Invalid price" });
        // return res.status(400).json({message: "Invalid password"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorMessages: errors });
    }

    //Checks property against existing property database, and if no errors, adds property to the database.
    fs.readFile("./data/propertydata.json", function (err, data) {
        if (err) {
            throw err;
        } else {
            let newID = 0;

            //Checks property against database. This doesn't really have any functionality besides getting the ID# right
            if (data.length > 0) {
                var parseData = JSON.parse(data);
                 parseData.properties.forEach(existingProperty => {
                    //  if (existingProperty.email == user.email) {
                    //      return res.json({ message: "Email exists already!" });
                    //  } else {
                    //      newID++;
                    //  }
                    newID++;
                });
             }

            //Initializes user to database
            const newProperty = {
                id: (newID + 1).toString(),
                // id: (properties.length + 1),
                name: property.name,
                location: property.location,
                imgName: property.imgName,
                price: property.price,
                // cellphone: user.cellPhone,
                // role: user.role
            };
            parseData.properties.push(newProperty);
            res.json(newProperty);
            fs.writeFile("./data/propertydata.json", JSON.stringify(parseData), function (err) {
                if (err) {
                    throw err;
                }
                console.log("Property listed successfully");
                return parseData.properties;
            });
        }
    });
});

// //Logs a user in
// router.post("/login", (req, res) => {
//     const user = req.body;
//     fs.readFile("./data/userdata.json", function (err, data) {
//         if (err) {
//             throw err;
//         } else {
//             if (data.length > 0) {
//                 let parseData = JSON.parse(data);

//                 //Checks if the request's email & password match an existing user's email and password.
//                 parseData.users.forEach(existingUser => {
//                     if (existingUser.email == user.email && existingUser.password == user.password) {
//                         console.log("Login Successful!");
//                         res.json();
//                         return;
//                     }
//                 });
//             } else {
//                 throw new Error("No information given");
//             }
//         }
//     });
// });

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

// //Finds a user by ID
// router.get("/:id", (req, res) => {
//     const userId = req.params.id;
//     var user;

//     //Checks that the query parameter is an integer
//     const numberUserId = parseInt(userId);
//     if (isNaN(numberUserId)) {
//         return res.status(400).json({message: "I am expecting an integer"});
//     }

//     if (!userId) {
//         return res.status(400).json({ message: "Please pass in a userId" });
//     }

//     console.log(userId);

//     //Checks ID against existing user database, and returns the user.
//     fs.readFile("./data/userdata.json", function (err, data) {
//         if (err) {
//             throw err;
//         } else {
            
//             //Checks ID against database
//             if (data.length > 0) {
//                 var parseData = JSON.parse(data);
//                 let foundUser = null;
//                 parseData.users.forEach(existingUser => {
//                     if (existingUser.id == userId) {
//                         foundUser = true;
//                         user = existingUser;
//                     } 
//                 });

//                 //There's a bug here, try fix. At the moment it won't return an error message if the user id is invalid.
//                 // //Returns the user if found, otherwise returns error.
//                 if (foundUser) {
//                     return res.json({ user });
//                 } else {
//                     return res.status(400).json({message: "There is no user with this ID"});
//                 }

//             }
//         }
//     });
// });

// //Old code, but it was supposed to return the array of users
// router.get("/", (req, res) => {
//     res.send(users);
// });

module.exports = router;