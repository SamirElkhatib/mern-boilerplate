// ENVIRONMENT VARIABLES
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");

var initiateMongoConnection = require("./config/db");

// ROUTES
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");


// SETUP
var app = express();


// MIDDLEWARE
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// DATABASE
initiateMongoConnection();

// ALLOWING CORS FOR COOKIES
// app.use(
//     cors({
//       origin: [
//         `${process.env.FRONT_URL}`,
//         'http://localhost:3000',
//         'https://mypage.com',
//       ],
//       credentials: true
//     })
//   );

// ROUTES
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.get("*", (req, res) => {  
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});


module.exports = app;
