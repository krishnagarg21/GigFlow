const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const mongoose = require("mongoose");

// Submit a bid
exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res.status(400).json({ message: "Gig not available" });
    }

    // Prevent owner from bidding on own gig
    if (gig.ownerId.toString() === req.userId) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.userId,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get bids for a gig (owner only)
exports.getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId: gig._id })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Hire a freelancer (ATOMIC)
exports.hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid || bid.status !== "pending") {
      throw new Error("Invalid bid");
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig || gig.status !== "open") {
      throw new Error("Gig already assigned");
    }

    if (gig.ownerId.toString() !== req.userId) {
      throw new Error("Not authorized");
    }

    // Assign gig
    gig.status = "assigned";
    await gig.save({ session });

    // Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // Reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

exports.getMyBids = async (req, res) => {
  const bids = await Bid.find({ freelancerId: req.userId })
    .populate("gigId", "title description budget status");
  res.json(bids);
};
