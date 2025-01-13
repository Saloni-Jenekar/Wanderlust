const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    //console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");

    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview=async(req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review reference from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    // Redirect to the listing's show page
    res.redirect(`/listings/${id}`);
};
