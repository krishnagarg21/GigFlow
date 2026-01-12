const express = require("express");
const { createGig, getGigs, getMyGigs, getGigById } = require("../controllers/gigController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getGigs);              // public feed
router.post("/", protect, createGig);  // protected
router.get("/my", protect, getMyGigs);
router.get("/:id", protect, getGigById);

module.exports = router;
