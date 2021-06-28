const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = function(req, res, next) {
  // console.log("Inside ad auth");
  try{
    // console.log("Inside first try block");
    const token = req.cookies.token;
    if (!token) return res.redirect("./login");
    try {
      // console.log("I am in admin auth try 2")
      const decoded = jwt.verify(token, "nanuadmin");
      req.admin = decoded.admin;
      // console.log("Mundakk hogtini anstide");
      next();
    } catch (e) {
      // console.log("Inside ad auth catch");
      console.error(e);
      res.redirect("./login");
    }
  }catch(e){
    console.log("Error at auth");
  }
};