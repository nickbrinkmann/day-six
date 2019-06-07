//Imports MySQL
const mysql = require("mysql");

//Creates a connection with MySQL
const mysqlconfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "fs_bnb"
};
var connection = mysql.createConnection(mysqlconfig);
connection.connect();

module.exports = connection;
//Exports MySQL connection