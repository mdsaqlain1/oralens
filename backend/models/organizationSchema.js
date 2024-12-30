import mongoose from "mongoose";

// Member Schema
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String
  }
});

// Team Schema
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [memberSchema] // An array of members in the team
});

// Organization Schema
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  teams: [teamSchema] // An array of teams in the organization
});

// Model for Organization
export const Organization = mongoose.model('Organization', organizationSchema);