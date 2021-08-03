const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = function(req, res, next) {
  try{
    const token = req.cookies.token;
    if (!token) return res.redirect("./login");
    try {
      const decoded = jwt.verify(token, "nanuadmin");
      req.admin = decoded.admin;
      next();
    } catch (e) {
      console.error(e);
      res.redirect("./login");
    }
  }catch(e){
    console.log("Error at auth");
  }
};