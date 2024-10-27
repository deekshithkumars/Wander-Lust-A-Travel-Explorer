const { query } = require("express");
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

module.exports.index = async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/listing.ejs",{allListings});
}

module.exports.renderNewListingForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.createNewListing = async(req,res,next)=>{

    let response= await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit:1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;//storing owner id while creating
    newListing.image={url,filename};//storing url and filename
    newListing.geometry=response.body.features[0].geometry
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash('success',"New listing created");
    res.redirect("/listing");
}

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id).populate(
        {path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash('error',"Listing you are searching for does not exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditListingForm = async(req,res)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error',"Listing you are searching for does not exist");
        res.redirect("/listing");
    }
    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_250,w_300");
    res.render("listings/edit.ejs",{listing,OriginalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    let updatedListing = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id,updatedListing,{runValidators:true,new:true})

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};//storing url and filename
        await listing.save();
    }
    
    req.flash('success',"Listing updated");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success',"Listing deleted");
    res.redirect("/listing");
}