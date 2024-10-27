const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');

module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//getting original url that where user want to visit
        req.flash("error","You must be login");
        return res.redirect("/login");
    }
    next();
})

//this code is because we cannot directly access session in passport so we use locals
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//this code is checking listing owner and login user are same to give authorisation for delete and edit
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


//moved from listing router
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//moved from review router
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//this code is for checking log in user and review author are same
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}