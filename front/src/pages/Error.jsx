import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";
import { BackgroundWrapper } from "../components/BackgroundWrapper";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  return (
    <BackgroundWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h1" style={{ color: "black" }}>
          404
        </Typography>
        <Typography variant="h6" style={{ color: "black" }}>
          Stranica koju trazite ne postoji
        </Typography>
        <Button onClick={() => navigate("/home")} variant="contained">
          Nazad
        </Button>
      </Box>
    </BackgroundWrapper>
  );
};
