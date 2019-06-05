const express = require("express");
const router = express.Router();

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

//Finds a property by ID
router.get("/:id", (req, res) => {
    const propertyId = req.params.id;
    var property;

    //Checks that the query parameter is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!propertyId) {
        return res.status(400).json({ message: "Please pass in a propertyId" });
    }

    console.log(propertyId);

    //Checks ID against existing property database, and returns the property.
    fs.readFile("./data/propertydata.json", function (err, data) {
        if (err) {
            throw err;
        } else {

            //Checks ID against database
            if (data.length > 0) {
                var parseData = JSON.parse(data);
                let foundProperty = null;
                parseData.properties.forEach(existingProperty => {
                    if (existingProperty.id == propertyId) {
                        foundProperty = true;
                        property = existingProperty;
                    }
                });

                // //Returns the user if found, otherwise returns error.
                if (foundProperty) {
                    return res.json({ property });
                } else {
                    return res.status(400).json({ message: "There is no property with this ID" });
                }

            }
        }
    });
});

//Deletes a property by its ID
router.delete("/:id", (req, res) => {
    fs.readFile("./data/propertydata.json", function (err, data) {
        if (err) {
            throw err;
        } else {
            if (data.length > 0) {
                var parseData = JSON.parse(data);

                // Checks if id parameter is given/indicated and is a number.
                if (!req.params.id || isNaN(req.params.id)) {
                    return res.status(400).json({ message: "Please pass in a valid userID" });
                }

                // Filters out element with param.id from users.
                const len = parseData.properties.length;
                parseData.properties = parseData.properties.filter(property => !(property.id === req.params.id));

                // Checks if user existed by checking if number of users changed.
                if (len == parseData.properties.length) {
                    return res.status(400).json({ message: "Property with given ID not found" });
                }

                fs.writeFile("./data/propertydata.json", JSON.stringify(parseData), function (err) {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({ status: "Property deleted" });
                    console.log("Property deleted");
                });
            } else {
                throw new Error("No properties exist");
            }
        }
    });
});

//Creates a new booking request given the property id
router.post("/:id/bookings", (req, res) => {
    const booking = req.body;

    //The code that follows checks if all necessary information was included in the http request.
    const bodyDateFrom = booking.dateFrom;
    const bodyDateTo = booking.dateTo;
    const bodyUserId = booking.userId;

    var errors = [];
    if (!bodyDateFrom) {
        errors.push({ message: "Invalid date from" });
        // return res.status(400).json({message: "Invalid firstname"});
    }

    if (!bodyDateTo) {
        errors.push({ message: "Invalid date to" });
        // return res.status(400).json({message: "Invalid lastname"});
    }

    if (!bodyUserId) {
        errors.push({ message: "Invalid user id" });
        // return res.status(400).json({message: "Invalid email"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorMessages: errors });
    }

    //Checks booking request against existing user database, and if no errors, adds user to the database.
    fs.readFile("./data/bookingdata.json", function (err, data) {
        if (err) {
            throw err;
        } else {
            let newID = 0;

            //Increments the ID number by 1 for each booking already made.
            if (data.length > 0) {
                var parseData = JSON.parse(data);
                parseData.bookings.forEach(existingBooking => {
                    newID++;
                });
            }
            //Initializes booking to database
            const newBooking = {
                id: (newID + 1).toString(),
                dateFrom: bodyDateFrom,
                dateTo: bodyDateTo,
                userId: bodyUserId,
                propertyId: req.params.id,
                status: "NEW"
            };
            parseData.bookings.push(newBooking);
            res.json(newBooking);
            fs.writeFile("./data/bookingdata.json", JSON.stringify(parseData), function (err) {
                if (err) {
                    throw err;
                }
                console.log("Booking request successful");
                return parseData.bookings;
            });
        }
    });
});

//Finds all booking requests under a property Id
router.get("/:id/bookings", (req, res) => {
    const propertyId = req.params.id;
    var allbookings = [];

    //Checks that the query parameter is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!propertyId) {
        return res.status(400).json({ message: "Please pass in a propertyId" });
    }

    console.log(propertyId);

    //Checks property id with existing bookings database, and returns all bookings (in an array).
    fs.readFile("./data/bookingdata.json", function (err, data) {
        if (err) {
            throw err;
        } else {

            //Checks ID against database
            if (data.length > 0) {
                var parseData = JSON.parse(data);
                foundBooking = null;
                parseData.bookings.forEach(existingBooking => {
                    if (existingBooking.propertyId == propertyId) {
                        foundBooking = true;
                        allbookings.push(existingBooking);
                    }
                });

                // //Returns all bookings if found, otherwise returns error.
                if (foundBooking) {
                    return res.json({ allbookings });
                } else {
                    return res.status(400).json({ message: "There are no booking requests under this property Id" });
                }

            }
        }
    });
});


// //Old code, but it was supposed to return the array of users
// router.get("/", (req, res) => {
//     res.send(users);
// });

module.exports = router;