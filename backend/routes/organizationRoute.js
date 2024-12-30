import express from "express";
import { Organization } from "../models/organizationSchema.js"; // Import the Organization model
import multer from "multer";
import mongoose from "mongoose";

const router = express.Router();

// Route to get all organizations

router.post("/organizations/add", async (req, res) => {
  try {
    const organizationData = req.body;

    const newOrganization = new Organization(organizationData);

    const savedOrganization = await newOrganization.save();

    res.status(201).json(savedOrganization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all organizations or a specific one by ID
router.get("/organizations/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res.json(organization);
    }
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an organization by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const options = { new: true, runValidators: true };

    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      updatedData,
      options
    );
    if (!updatedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(updatedOrganization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an organization by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrganization = await Organization.findByIdAndDelete(id);
    if (!deletedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json({
      message: "Organization deleted successfully",
      deletedOrganization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
  },
});

const upload = multer({ storage });

// Route to handle image upload for a specific member

import { v4 as uuidv4 } from 'uuid'; // Ensure the uuid package is imported

router.post("/members/:memberId/:organizationId/upload", upload.single("image"), async (req, res) => {
  try {
    const { memberId, organizationId } = req.params;
    const { teamId } = req.body;

    console.log("Received organizationId:", organizationId);

    // Fetch the organization by ID
    const organization = await Organization.findOne({ _id: organizationId });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    console.log("Fetched organization:", organization);

    // Find the team within the organization
    const team = organization.teams.id(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("Fetched team:", team);
    console.log("Received memberId:", memberId);

    // Find the member within the team by id
    const memberIndex = team.members.findIndex(member => member.id == memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Get the member before the update
    const member = team.members[memberIndex];
    console.log("Member before update:", member);

    // Ensure the member has a valid ID; if not, generate one
    if (!member.id || member.id === null) {
      member.id = uuidv4();
      console.log("Generated new member ID:", member.id);
    }

    // Update the member's imgUrl with the uploaded image URL
    const imageUrl = `/uploads/${req.file.filename}`;

    // Update the member's imgUrl field
    team.members[memberIndex].imgUrl = imageUrl;

    // Save the organization with the updated team and member
    const updatedOrganization = await Organization.findByIdAndUpdate(
      organizationId,
      { $set: { "teams.$[team].members": team.members } },
      { new: true, arrayFilters: [{ "team._id": teamId }] }
    );

    console.log("Updated organization:", updatedOrganization);
    console.log("Updated member:", team.members[memberIndex]);

    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

export default router;
