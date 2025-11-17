import { Box, Button } from "@mui/material";
import { AuthWrapper } from "../components/AuthWrapper";
import { CustomCard } from "../components/CustomCard";
import bill from "../assets/bill.svg";
import transport from "../assets/transport.svg";
import statistics from "../assets/statistics.svg";
import input from "../assets/input.svg";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { useQuery } from "react-query";
import { getBills } from "../apiCalls/useBill";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  // const { data, isLoading } = useQuery("bills", async () => await getBills());
  const navigate = useNavigate();
  // const unPaid = isLoading
  //   ? 0
  //   : data.data?.filter((m) => !m.attributes.payed).length;

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "right",
            justifyContent: "space-evenly",
          }}
        >
          <>
            {/* {isLoading ? (
              <Button disabled>UCITAVAM</Button>
            ) : ( */}
            <Button
              onClick={() => navigate("/bill/list")}
              variant="contained"
              // color={unPaid ? "error" : "success"}
              startIcon={<NotificationImportantIcon width={26} />}
            >
              Racuni
              {/*: {unPaid} */}
            </Button>
            {/* )} */}
          </>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            minHeight: "90vh",
          }}
        >
          <CustomCard image={input} title={"UNOS"} route={"/input"} />
          <CustomCard image={bill} title={"RACUNI"} route={"/bill"} />
          <CustomCard image={transport} title={"TRANSPORT"} route={"/transport"} />
          <CustomCard image={statistics} title={"STATISTIKA"} route={"/statistics"} />
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
