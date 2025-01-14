//this code I've used for development. to run, use command: node token

const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM2ODU5ODE2LCJleHAiOjE3MzY5NDYyMTZ9.1QBchQp7LUYdz3FJgwHpA86MTAxn8CxviLT6BsEEmRM";  
const decoded = jwt.decode(token);
console.log("Decoded token payload:", decoded);
