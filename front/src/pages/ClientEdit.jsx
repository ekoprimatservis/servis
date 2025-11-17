import React from "react";
import { CreateClientForm } from "../components/CreateClientForm";
import { BackButton } from "../components/BackButton";
import { Box, Typography } from "@mui/material";
import { theme } from "../helper/theme";
import { useParams } from "react-router-dom";
import { editClient } from "../apiCalls/useClient";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { AuthWrapper } from "../components/AuthWrapper";

export const ClientEdit = () => {
  const { id } = useParams();
  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            padding: "5px",
            height: "calc(100vh - 10px)",
          }}
        >
          <BackButton route={"/client"} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                minWidth: 365,
                display: "flex",
                background: theme.primary,
                height: "5vh",
                justifyContent: "space-between",
                flexDirection: "column",
                borderRadius: "15px",
                padding: "1% 2% 1% 2%",
                alignItems: "center",
              }}
              gutterBottom
              variant="h6"
              component="div"
            >
              Editovanje postojaceg klijenta
            </Typography>
            <CreateClientForm id={id} mutationFunction={editClient} />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
