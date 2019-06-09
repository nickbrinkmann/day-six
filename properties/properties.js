const express = require("express");
const router = express.Router();

//Requires the database index
var connection = require("../db.js");

// Imports instance of property model
let myPropertymodel = require("../models/property-model");

//Imports instance of bookings request model
let myBookingmodel = require("../models/booking-model");

//************************************PROPERTY ENDPOINTS******************************************//

//Registers a new property. This works
router.post("/register", (req, res) => {
    const property = req.body;

    //The code that follows checks if all necessary information was included in the http request.
    const bodyname = property.name;
    const bodylocation = property.location;
    const bodyimgname = property.imgname;
    const bodyprice = property.price;
    const bodyownerid = property.ownerid;

    var errors = [];
    if (!bodyname) {
        errors.push({ message: "Invalid property name" });
        // return res.status(400).json({message: "Invalid firstname"});
    }

    if (!bodylocation) {
        errors.push({ message: "Invalid location" });
        // return res.status(400).json({message: "Invalid lastname"});
    }

    if (!bodyimgname) {
        errors.push({ message: "Invalid image URL" });
        // return res.status(400).json({message: "Invalid email"});
    }

    if (!bodyprice) {
        errors.push({ message: "Invalid price" });
        // return res.status(400).json({message: "Invalid password"});
    }

    if (!bodyownerid) {
        errors.push({ message: "Invalid owner id" });
        // return res.status(400).json({message: "Invalid password"});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorMessages: errors });
    }

    //Creates property!!!
    myPropertymodel.createProperty(property, (err, result) => {
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

        //Now this works.
        console.log(result.insertId);

        //Creates an anonymous property object to return to the client
        var responseProperty = {
            //insertId is provided by the database when it returns result
            id: result.insertId,
            name: property.name,
            location: property.location,
            imgname: property.imgname,
            price: property.price,
            ownerid: property.ownerid
        };


        //Returns the newly created user to the client
        return res.status(200).json(responseProperty);
    });
});

//Finds a property by ID. This works
router.get("/:id", (req, res) => {
    const propertyId = req.params.id;
    console.log(propertyId);

    //Checks that the query parameter is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!propertyId) {
        return res.status(400).json({ message: "Please pass in a propertyId" });
    }

    console.log(propertyId);

    //Searches for property
    myPropertymodel.getPropertyById(propertyId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to select" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No property found for ID" });
        }

        const propertyResponse = {
            id: result[0].id,
            name: result[0].name,
            location: result[0].location,
            imgname: result[0].imgname,
            price: result[0].price,
            ownerid: result[0].ownerid
        };

        console.log(propertyResponse);

        //Returns the property to the client
        return res.status(200).json(propertyResponse);
    });
});

//Returns ALL properties (in an ARRAY) owned BY A CERTAIN OWNER, by ownerid. This works
router.get("/owner/:id", (req, res) => {
    const ownerId = req.params.id;

    //Checks that the query parameter is an integer
    const numberOwnerId = parseInt(ownerId);
    if (isNaN(numberOwnerId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!ownerId) {
        return res.status(400).json({ message: "Please pass in an ownerId" });
    }

    console.log(ownerId);

    connection.query("SELECT * FROM property WHERE ownerid = ? ", [ownerId], function (
        err,
        result
    ) {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json({ message: "Failed to select" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No properties found for this owner" });
        }

        //This returns an ARRAY. MAKE SURE YOUR PROVIDER APP AND CONSUMER APPS KNOW HOW TO DEAL WITH THESE ARRAYS WHEN
        //RENDERING THE CURRENT LISTINGS PAGE (PROVIDER)
        return res.status(200).json(result);
    });
});

//Returns ALL properties. This works
router.get("/", (req, res) => {
    connection.query("SELECT * FROM property", function (
        err,
        result
    ) {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json({ message: "Failed to select" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No properties found" });
        }

        //This returns an ARRAY. MAKE SURE YOUR PROVIDER APP AND CONSUMER APPS KNOW HOW TO DEAL WITH THESE ARRAYS WHEN
        //RENDERING THE CURRENT LISTINGS PAGE (PROVIDER)
        return res.status(200).json(result);
    });
});

//************************************BOOKING REQUEST ENDPOINTS******************************************//

//Creates a new booking request. This works
router.post("/:id/bookings", (req, res) => {
    var booking = {
        datefrom: req.body.datefrom,
        dateto: req.body.dateto,
        userid: req.body.userid,
        propertyid: req.params.id,
        status: "NEW"
    };
    
    //The code that follows checks if all necessary information was included in the http request.
    const bodydatefrom = booking.datefrom;
    const bodydateto = booking.dateto;
    const bodyuserid = booking.userid;
    const bodypropertyid = req.params.id;


    var errors = [];
    if (!bodydatefrom) {
        errors.push({ message: "Invalid booking date from" });
    }

    if (!bodydateto) {
        errors.push({ message: "Invalid booking date to" });
    }

    if (!bodyuserid) {
        errors.push({ message: "Please pass in a user ID" });
    }

    if (!bodypropertyid) {
        errors.push({ message: "Please pass in a property ID" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorMessages: errors });
    }

    //Creates booking request!!!
    myBookingmodel.createBooking(booking, (err, result) => {
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

        //Now this works.
        console.log(result.insertId);

        //Creates an anonymous property object to return to the client
        var responseBooking = {
            //insertId is provided by the database when it returns result
            id: result.insertId,
            datefrom: booking.datefrom,
            dateto: booking.dateto,
            userid: booking.userid,
            propertyid: booking.propertyid,
            ownerid: booking.ownerid,
            status: booking.status
        };


        //Returns the newly created booking to the client
        return res.status(200).json(responseBooking);
    });
});

//Returns all booking requests for a given property, by PROPERTY ID
router.get("/:id/bookings", (req, res) => {
    const propertyId = req.params.id;
    console.log(propertyId);

    //Checks that the query parameter (property ID) is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({ message: "I am expecting an integer" });
    }

    if (!propertyId) {
        return res.status(400).json({ message: "Please pass in a propertyId" });
    }

    //Searches for booking requests
    myBookingmodel.getBookingByPropertyId(propertyId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to select" });
        }

        //Returns the array of booking requests to the client
        return res.status(200).json(result);
    });
});


module.exports = router;