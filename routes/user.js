const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controllers/user.js")


//router.route[merging routes with same route]

router.route("/signup")
.get(UserController.signupForm)
.post(wrapAsync(UserController.signup))

router.route("/login")
.get(UserController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
wrapAsync(UserController.login))

// router.get("/signup",UserController.signupForm)

// router.post("/signup",wrapAsync(UserController.signup))

// router.get("/login",UserController.loginForm)

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
// wrapAsync(UserController.login))

router.get("/logout",UserController.logout)

module.exports = router;