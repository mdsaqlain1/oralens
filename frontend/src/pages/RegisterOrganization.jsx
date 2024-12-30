import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios"; // Ensure you have axios installed
import { BACKEND_URL } from "../../globals";

const RegisterOrganization = () => {
  const [organization, setOrganization] = useState({
    name: "",
    email: "",
    location: "",
  });

  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prevOrg) => ({ ...prevOrg, [name]: value }));
  };

  const addTeam = () => setTeams((prevTeams) => [...prevTeams, { name: "", members: [] }]);

  const removeTeam = (index) => setTeams((prevTeams) => prevTeams.filter((_, i) => i !== index));

  const handleTeamChange = (index, value) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      updatedTeams[index].name = value;
      return updatedTeams;
    });
  };

  const addMember = (teamIndex) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      updatedTeams[teamIndex].members.push({ id: Date.now(), name: "" });
      return updatedTeams;
    });
  };

  const removeMember = (teamIndex, memberIndex) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      updatedTeams[teamIndex].members = updatedTeams[teamIndex].members.filter((_, i) => i !== memberIndex);
      return updatedTeams;
    });
  };

  const handleMemberChange = (teamIndex, memberIndex, value) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      updatedTeams[teamIndex].members[memberIndex].name = value;
      return updatedTeams;
    });
  };

  const validateForm = () => {
    if (!organization.name || !organization.email || !organization.location) {
      alert("Please fill in all organization details.");
      return false;
    }
    for (const team of teams) {
      if (!team.name) {
        alert("Please provide names for all teams.");
        return false;
      }
      for (const member of team.members) {
        if (!member.name) {
          alert("Please provide names for all team members.");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = { ...organization, teams };

    try {
      setIsLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/organizations/add`, data); // Replace with your API endpoint
      console.log("Response:", response.data);
      alert("Organization registered successfully!");
      setOrganization({ name: "", email: "", location: "" });
      setTeams([]);
    } catch (error) {
      console.error("Error registering organization:", error);
      alert("Failed to register organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent>
          <Typography variant="h4" className="text-center font-bold mb-6">
            Register Organization
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Organization Details */}
            <div className="my-6">
              <TextField
                label="Organization Name"
                name="name"
                value={organization.name}
                onChange={handleOrgChange}
                fullWidth
                variant="outlined"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Email"
                name="email"
                value={organization.email}
                onChange={handleOrgChange}
                fullWidth
                variant="outlined"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Location"
                name="location"
                value={organization.location}
                onChange={handleOrgChange}
                fullWidth
                variant="outlined"
                required
                style={{ marginBottom: "10px" }}
              />
            </div>

            {/* Teams Section */}
            <Box className="mb-6">
              <Typography variant="h6" className="mb-4">
                Teams
              </Typography>
              {teams.map((team, index) => (
                <Card key={index} className="mb-4 p-4 bg-gray-100">
                  <TextField
                    label={`Team ${index + 1} Name`}
                    value={team.name}
                    onChange={(e) => handleTeamChange(index, e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                    className="mb-4"
                  />
                  <Box>
                    <Typography variant="body1" style={{ margin: "10px 0px" }}>
                      Members
                    </Typography>
                    {team.members.map((member, memberIndex) => (
                      <div key={member.id} className="mb-4 flex items-center">
                        <TextField
                          label={`Member ${memberIndex + 1} Name`}
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, memberIndex, e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                          required
                        />
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => removeMember(index, memberIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="text" onClick={() => addMember(index)}>
                      + Add Member
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeTeam(index)}
                    className="mt-4"
                  >
                    Remove Team
                  </Button>
                </Card>
              ))}
              <Button variant="outlined" onClick={addTeam} className="w-full mt-4">
                + Add Team
              </Button>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterOrganization;
