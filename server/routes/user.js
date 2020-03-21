const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../models/user");

const { auth, sign, unauth } = require("../controls/authentication");

/* LOGIN */
router.post(
  "/login",
  [
    check("username", "Please enter a valid username")
      .not()
      .isEmpty(),
    check("password", "Please enter a valid password")
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    try {
      // Find username in database
      let user = await User.findOne({ username });
      if (!user)
        return res.status(401).json({
          errors: {
            param: "username",
            msg: "User does not exist"
          }
        });

      // Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({
          errors: {
            param: "password",
            msg: "Incorrect password"
          }
        });

      const tokenPayload = { user: { id: user.id } };

      // FIXME: decide on appropriate JWT expiry time
      sign(res, tokenPayload, () => {
        preparePayload(user, payload => {
          res.status(200).send(payload);
          next();
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        errors: { param: "server", msg: "Server Error" }
      });
    }
  }
);

/* LOGOUT */
router.get("/logout", async (req, res, next) => {
  try {
    unauth(res, next);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      errors: { param: "server", msg: "Server Error" }
    });
  }
});

/* DATA */
router.get("/data", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      unauth(res, () => {
        return res
          .status(401)
          .json({ errors: { param: "user", msg: "User not found!" } });
      });
    }
    preparePayload(user, payload => {
      res.status(200).json(payload);
    });
  } catch (err) {
    res.status(500).json({
      errors: { param: "server", msg: "Server Error" }
    });
  }
});


const preparePayload = (user, next) => {
  Transaction.find(
    {
      _id: {
        $in: user.transactions
      }
    },
    (err, docs) => {
      // FIXME: handle error by sending to next(null, err)?
      if (err) throw err;
      const responseData = {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      next(responseData);
    }
  );
};

module.exports = router;
