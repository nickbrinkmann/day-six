const express = require("express");
const router = express.Router();

let properties = new Array();

router.post("/", (req, res) => {
    console.log(req.body);
// Here I'm expecting a push of the form below:
//      * POST http://localhost:3000/api/properties
//      * {
//      *   "name": "House by the Sea",
//      *   "location": "53 Fake Street, Camp's Bay, Cape Town",
//      *   "imageUrl": "images.google.com/asdifhl.jpg",
//      *   "price": "$40 per day"
//      * }
//      **/

    const property = req.body;
    console.log(property);
    let bodyName = property.name;
    let bodyLocation = property.location;
    let bodyImageUrl = property.imageUrl;
    let bodyPrice = property.price;

    const newProperty = {
        id: properties.length + 1,
        name: bodyName,
        location: bodyLocation,
        imageUrl: bodyImageUrl,
        price: bodyPrice
    };
    //Pushes the new property onto the array
    properties.push(newProperty);

    return res.json(newProperty);
// Expecting a return of the form below:
//      * {
//      *   "id": 1,
//      *   "name": "House by the Sea",
//      *   "location": "53 Fake Street, Camp's Bay, Cape Town",
//      *   "imageUrl": "images.google.com/asdifhl.jpg",
//      *   "price": "$40 per day"
//      * }
//      */
});

router.get("/", (req, res) => {
    res.send(properties);
});

module.exports = router;