import { Box } from "@mui/material";
import { AuthWrapper } from "../components/AuthWrapper";
import { CustomCard } from "../components/CustomCard";
import newClient from "../assets/newClient.svg";
import edit from "../assets/edit.svg";
import { BackButton } from "../components/BackButton";
import { BackgroundWrapper } from "../components/BackgroundWrapper";

export const Bill = () => {
  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box sx={{ padding: "5px", height: "calc(100vh - 10px)" }}>
          <BackButton route={"/home"} />
          <Box
            sx={{
              width: "100%",
              //   height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              height: "80vh",
            }}
          >
            <CustomCard
              image={newClient}
              title={"KREIRANJE RACUNA"}
              route={"/bill/create"}
            />
            <CustomCard
              image={edit}
              title={"LISTA RACUNA"}
              route={"/bill/list"}
            />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
