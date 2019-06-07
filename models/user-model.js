// //Requires the database index
var connection = require("../db.js");

//Creates a user database model
var User = function (user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.cellphone = user.cellphone;
};

//Insert/Create User in Database Model (function)
User.createUser = function (newUser, result) {
    connection.query("INSERT INTO user set ?", newUser, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
}

// //Retrieves the table of all users from the database MODEL (function)
// User.getAllUsers = function(result) {
//     connection.query("SELECT * FROM user", function(err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         } else {
//             console.log("Users: ", res);
//             result(null, res);
//         }
//     });
// }

//Retrieves user by id MODEL (function)
User.getUserById = function(userId, result) {
    connection.query("SELECT * FROM user WHERE id = ? ", [userId], function (
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

// //Updates user by id MODEL (function)
// User.updateUserById = function(userId, user, result) {
//     connection.query(
//         "UPDATE user SET user = ? WHERE id = ?",
//         [user, userId],
//         function(err, res) {
//             if (err) {
//                 console.log("error: ", err);
//                 result(null, err);
//             } else {
//                 result(null, res);
//             }
//         }
//     );
// };

// User.removeUser = function(userId, result) {
//     connection.query("DELETE FROM user WHERE id = ?", userId, function(err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//         } else {
//             result(null, res);
//         }
//     });
// };

// //ABOVE IS YOUR OWN WORK AND WILL LIKELY HAVE BUGS


module.exports = User;