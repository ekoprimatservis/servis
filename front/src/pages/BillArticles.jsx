import React from "react";
import { BackButton } from "../components/BackButton";
import { Box, Typography } from "@mui/material";
import { theme } from "../helper/theme";
import { CreateBillArticlesForm } from "../components/CreateBillArticlesForm";
import { useParams } from "react-router-dom";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { createBillArticle } from "../apiCalls/useBillArticles";
import { AuthWrapper } from "../components/AuthWrapper";

export const BillArticlesCreate = () => {
  const { id } = useParams();

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            padding: "5px",
            height: "calc(100vh - 10px)",
            overflow: "auto",
          }}
        >
          <BackButton route={"/bill/list"} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              overflow: "auto",
              minHeight: "80vh",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                display: "flex",
                background: theme.primary,
                height: "5vh",
                justifyContent: "space-between",
                flexDirection: "column",
                borderRadius: "15px",
                padding: "1% 2% 1% 2%",
                alignItems: "center",
                minWidth: 350
              }}
            >
              Dodavanje Artikla Racunu
            </Typography>
            <CreateBillArticlesForm
              mutationFunction={createBillArticle}
              id={id}
            />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
