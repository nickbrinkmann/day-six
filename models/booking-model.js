// //Requires the database index
var connection = require("../db.js");

//Creates a booking request database model
var Booking = function (booking) {
    this.id = booking.id;
    this.datefrom = booking.datefrom;
    this.dateto = booking.dateto;
    this.propertyid = booking.propertyid;
    this.status = booking.status;
    this.userid = booking.userid;
    this.propownerid = booking.propownerid;
};

//Insert/Create Booking Request in Database Model (function)
Booking.createBooking = function (newBooking, result) {
    connection.query("INSERT INTO booking set ?", newBooking, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

//I'm not fully sure about the function below. Try to test it out at points
//Retrieves Booking Requests by PROPERTY id MODEL (function)
Booking.getBookingByPropertyId = function(propertyId, result) {
    connection.query("SELECT * FROM booking WHERE propertyid = ? ", [propertyId], function (
        err,
        res
    ) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

module.exports = Booking;