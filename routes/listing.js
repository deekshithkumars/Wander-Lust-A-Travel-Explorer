const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js');
const ListingController = require("../controllers/listing.js");
// const ExpressError = require('../utils/ExpressError.js');
// const {listingSchema} = require('../schema.js');
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');

const multer  = require('multer')
const {storage}= require('../cloudConfig.js')
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })

//moved to middleware.js
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

//router.route[merging routes with same route]

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createNewListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file)
// })

router.get("/new",isLoggedIn,ListingController.renderNewListingForm)

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditListingForm))


//all routes async callback shifted to controllers/listing.js
//index route[all details]
// router.get("/",wrapAsync(ListingController.index));

//create route[new listing]
// router.get("/new",isLoggedIn,ListingController.renderNewListingForm)

//create route[new listing]
// router.post("/",validateListing,wrapAsync(ListingController.createNewListing));

//show route[individual listing details]
// router.get("/:id",wrapAsync(ListingController.showListing))

//edit route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditListingForm))

//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing))

//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing))

module.exports = router;