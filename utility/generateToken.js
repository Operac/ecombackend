const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateToken(user) {
  const { firstname, lastname, email, phone, image, address, role, id } = user;

  if (!firstname) {
  console.log("Missing First Name Field!");
  }
  if (!lastname) {
console.log("Missing Last Name Field!");
  }
  if (!email) {
console.log("Missing Email Field!");
  }
  if (!phone) {
console.log("Missing Phone Field!");
  }
  if (!address) {
console.log("Missing Address Field!");
  }
  if (!image) {
console.log("Missing Image Field!");
  }
  if(!id) {
    console.log("id is missing!");
    
  }

  const payload = {
    firstname,
    lastname,
    email,
    phone,
    address,
    image,
    role,
    userid: id
  };

  const option = {
    expiresIn: "2h",
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, option);
}

module.exports =  { generateToken };