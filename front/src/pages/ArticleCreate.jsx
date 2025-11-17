import React from "react";
import { BackButton } from "../components/BackButton";
import { Box, Typography } from "@mui/material";
import { theme } from "../helper/theme";
import { createArticle } from "../apiCalls/useArticle";
import { CreateArticleForm } from "../components/CreateArticleForm";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { AuthWrapper } from "../components/AuthWrapper";

export const ArticleCreate = () => {
  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            padding: "5px",
            height: "calc(100vh - 10px)",
          }}
        >
          <BackButton route={"/article"} />
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
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                minWidth: 360,
                display: "flex",
                background: theme.primary,
                height: "5vh",
                justifyContent: "space-between",
                flexDirection: "column",
                borderRadius: "15px",
                padding: "1% 2% 1% 2%",
                alignItems: "center",
              }}
            >
              Kreiranje novog artikla
            </Typography>
            <CreateArticleForm mutationFunction={createArticle} />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
