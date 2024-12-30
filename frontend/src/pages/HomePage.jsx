import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 pb-16">
      <Container
        maxWidth="md"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 flex flex-col items-center text-center gap-8"
      >
        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          className="text-4xl text-gray-800 dark:text-gray-100"
          style={{ fontWeight: 700 }}
        >
          Welcome to Organization Manager
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          className="text-gray-700 dark:text-gray-300 text-lg"
        >
          Effortlessly manage your organizations, teams, and members with a
          seamless experience.
        </Typography>

        {/* Options */}
        <Box className="flex items-center justify-center gap-10">
          <Box
            onClick={() => navigate("/organizations")}
            className="w-64 h-64 rounded-lg flex items-center justify-center p-5 cursor-pointer bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <BusinessIcon sx={{ fontSize: "3rem" }} />
            <Typography className="text-xl mt-3">View Organizations</Typography>
          </Box>

          <Box
            onClick={() => navigate("/register")}
            className="w-64 h-64 rounded-lg flex items-center justify-center p-5 cursor-pointer bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <AppRegistrationIcon sx={{ fontSize: "3rem" }} />
            <Typography className="text-xl mt-3">
              Register Organization
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
