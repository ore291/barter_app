const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// User models

const User = require("../../models/User");

// user login

router.post("/", (req, res) => {
  const { email, password } = req.body;

  // simple validation

  if (!email || !password) {
    return res.status(400).json({ msg: "enter all fields!" });
  }

//   check existing users
User.findOne({email}).then(user => {
    if(!user) return res.status(400).json({ msg: "user does not exist"});

    // validate pass
    bcryptjs.compare(password, user.password).then((isMatch) =>{
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials"});

        jwt.sign(
            {id: user.id},
            config.get("bartersecret"),
            {expiresIn: 3600},
            (err, token) =>{
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
})
});


module.exports = router;