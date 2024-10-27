const User = require("../models/user")

module.exports.signupForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username ,email , password} =req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        //login automatically after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listing");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.loginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listing" //this line because if we click login button directly
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listing");
    })
}