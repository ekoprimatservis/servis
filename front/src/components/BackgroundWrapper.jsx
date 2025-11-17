import { Box } from "@mui/material";
import React from "react";
import logo from "../assets/newLogoTransparentOpacity.png";

export const BackgroundWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(${logo})`,
        backgroundSize: "200px",
        backgroundColor: "#ebfaf1",
        fontFamily: "Montserrat",
      }}
    >
      {children}
    </Box>
  );
};
