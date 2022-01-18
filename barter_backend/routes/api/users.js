const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// import userschema
const User = require("../../models/User");

// random Number generator

const { getRandom } = require("../../helpers/utils");

// post request for reg

router.post("/", (req, res) => {
  const { name, email, phone, password, userRef } = req.body;
  // validation
  if (!name || !email || !password || !phone) {
    return res
      .status(400)
      .json({ msg: "please enter name, email, phone and password" });
  }

  // check if user exists

  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "user already exists" });

    const newUser = new User({
      name,
      email,
      phone,
      password,
      account_number: getRandom(11),
      // starts with 0
      account_balance: getRandom(5),
      userRef,
    });
// create salt using bcrypt
    bcryptjs.genSalt(10, ( err, salt) => {
      bcryptjs.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
       
        newUser.save().then(user => {
          jwt.sign(
            {id: user.id},
            config.get('bartersecret'),
            {expiresIn: 3600},
            (err, token) => {
              if(err) throw err;
            return res.status(200).json({ 
                token,
                user: {
                  id: user.id,
                  phone: user.phone,
                  email: user.email,
                  account_balance: user.account_balance,
                  kyc_tier: user.kyc_tier,
                  account_number: user.account_number,
                }
              })
            }
          )
        })
      });
    });
  });

    
 
});

// post request for reg
router.post("/", (req, res) => res.send("registered"));

module.exports = router;
