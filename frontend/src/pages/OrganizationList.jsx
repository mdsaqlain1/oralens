import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { BACKEND_URL } from "../../globals";

const OrganizationList = () => {
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/organizations`);
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };
  const [organizations, setOrganizations] = useState([]); // Store organizations

  useEffect(() => {
    fetchOrganizations();
    console.log("Organizations:", organizations);
  }, []);

  const handleImageUpload = async (e, memberId, organizationId, teamId) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("organizationId", organizationId);
      formData.append("teamId", teamId);

      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/members/${memberId}/${organizationId}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Image upload success, no need to update state as we rely on the backend response.
        console.log("Image uploaded successfully", response.data.imageUrl);
        fetchOrganizations(); // Fetch organizations to update the UI
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent>
          <Typography variant="h4" className="text-center font-bold mb-6">
            Organization Hierarchy
          </Typography>
          <List>
            {organizations.map((org, orgIndex) => (
              <Box key={orgIndex} mb={4}>
                <Card variant="outlined" className="mb-4">
                  <CardContent>
                    <Typography variant="h5" className="font-bold">
                      {org.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Email: {org.email}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Location: {org.location}
                    </Typography>
                  </CardContent>
                </Card>
                <List subheader={<ListSubheader>Teams</ListSubheader>}>
                  {org.teams.map((team, teamIndex) => (
                    <ListItem key={teamIndex} divider>
                      <ListItemText
                        primary={team.name}
                        secondary={
                          team.members.length > 0
                            ? `${team.members.length} Member(s)`
                            : "No Members"
                        }
                      />
                      <List>
                        {team.members.map((member, memberIndex) => (
                          <ListItem
                            key={memberIndex}
                            style={{ paddingLeft: "20px" }}
                          >
                            <Avatar
                              src={
                                member.imgUrl
                                  ? `${BACKEND_URL}${member.imgUrl}`
                                  : undefined // Render the member's image
                              }
                              alt={member.name}
                              sx={{ width: 40, height: 40, marginRight: 2 }}
                            />
                            <ListItemText
                              primary={member.name}
                              secondary={
                                member.imgUrl
                                  ? "Image Uploaded"
                                  : "Image Not Uploaded"
                              }
                              style={{
                                color: member.imgUrl ? "green" : "red",
                              }}
                            />
                            <Button
                              variant="contained"
                              component="label"
                              size="small"
                              startIcon={<CloudUploadIcon />}
                              style={{ marginLeft: "10px" }}
                            >
                              Upload Image
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageUpload(
                                    e,
                                    member.id,
                                    org._id,
                                    team._id
                                  )
                                }
                              />
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationList;
