const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.isUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  console.log("user:", req.user?.role );
  

  if (req.user?.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Forbidden route. Only admins can access this route",
  });
};

exports.isSameUser = (req, res, next) => {
  const { uuid } = req.params;
  function getuuid() {
    const uid = req.body.uuid
    return uid
  }



   const paramsid = uuid
   const reqUuid = getuuid()

  if (req.user?.uuid !== reqUuid) {
    return res
      .status(403)
      .json({ success: false, message: "Wrong profile. Is this your profile?" });
  }
  return next();
};
