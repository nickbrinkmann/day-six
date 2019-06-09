// //Requires the database index
var connection = require("../db.js");

//Creates a property database model
var Property = function (property) {
    this.name = property.name;
    this.location = property.location;
    this.imgname = property.imgname;
    this.price = property.price;
    this.ownerid = property.ownerid;
};

//Insert/Create Property in Database Model (function)
Property.createProperty = function (newProperty, result) {
    connection.query("INSERT INTO property set ?", newProperty, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
        //res.insertId
    });
}

//Retrieves property by id MODEL (function)
Property.getPropertyById = function(propertyId, result) {
    connection.query("SELECT * FROM property WHERE id = ? ", [propertyId], function (
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

module.exports = Property;