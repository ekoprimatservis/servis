import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Box, CircularProgress } from "@mui/material";

export const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      navigate("/login");
      navigate(0);
      return;
    }
    setLoading(false);
    // const { exp } = jwtDecode(jwt);
    // if (Date.now() >= exp * 1000) {
    //   navigate("/login");
    //   //   navigate(0);
    //   return;
    // } else {
    //   navigate("/home");
    //   //   navigate(0);
    // }
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress value={100} disableShrink />
        </Box>
      ) : (
        children
      )}
    </>
  );
};
