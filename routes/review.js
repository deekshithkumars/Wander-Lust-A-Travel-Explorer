const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js');
// const ExpressError = require('../utils/ExpressError.js');
// const { reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
const ReviewController = require("../controllers/review.js");

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

//post route
router.post("/",isLoggedIn, validateReview,wrapAsync(ReviewController.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview))

module.exports = router;