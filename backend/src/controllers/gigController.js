const Gig = require("../models/Gig");

// Create a new gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.userId,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyGigs = async (req, res) => {
  const gigs = await Gig.find({ ownerId: req.userId });
  res.json(gigs);
};


// Get all open gigs + search
exports.getGigs = async (req, res) => {
  try {
    const { search } = req.query;

    let query = { status: "open" };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const gigs = await Gig.find(query).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGigById = async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) {
    return res.status(404).json({ message: "Gig not found" });
  }
  res.json(gig);
};

