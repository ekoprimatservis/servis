import React from "react";
import { BackButton } from "../components/BackButton";
import { Box, Typography } from "@mui/material";
import { theme } from "../helper/theme";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { AuthWrapper } from "../components/AuthWrapper";
import { EditCompanyInfo } from "../components/EditCompanyInfo";
import { editCompanyInfo } from "../apiCalls/useCompanyInfo";

export const CompanyInfo = () => {
    return (
        <AuthWrapper>
            <BackgroundWrapper>
                <Box
                    sx={{
                        padding: "5px",
                        height: "auto",
                    }}
                >
                    <BackButton route={"/input"} />
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                            Informacije o Firmi
                        </Typography>
                        <EditCompanyInfo mutationFunction={editCompanyInfo} />
                    </Box>
                </Box>
            </BackgroundWrapper>
        </AuthWrapper>
    );
};
