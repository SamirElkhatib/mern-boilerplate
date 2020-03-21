const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;


/* Verify Token Middleware */
// FIXME: handle account deletion? removing cookie from client side
exports.auth = function(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ errors: { param: "login", msg: "Login Required" } });

  try {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (!err) req.user = decoded.user;
      next();
    });
  } catch (e) {
    console.error(e);
    // TODO: handle errors and expiry of tokens
    //   if (err.name == "TokenExpiredError") {
    //   }
    // remove token from client in case it is invalid
    res.clearCookie("token");
    res.status(401).send({ errors: { param: "token", msg: "Invalid token" } });
  }
};

/* Clears Cookie From Client */
exports.unauth = function(res, next) {
  res
    .clearCookie("token")
    .status(200)
    .json({ msg: "User logged out" });
  next();
};

/* Sign Payload and Send JWT as Cookie */
// TODO: look into JWT secret
exports.sign = function(res, payload, next) {
  // FIXME: extract all time values and configurations into config file
  jwt.sign(
    payload,
    SECRET,
    {
      expiresIn: "7d"
    },
    (err, token) => {
      if (err) throw err;

      // FIXME: raise security of sent token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000)
        // secure: false, // set to true if your using https
        // httpOnly: true
      });

      next();
    }
  );
};