import { Box, Button } from "@mui/material";
import { AuthWrapper } from "../components/AuthWrapper";
import { CustomCard } from "../components/CustomCard";
import article from "../assets/article.svg";
import client from "../assets/client.svg";
import expenses from "../assets/expenses.svg";
import companyInfo from "../assets/companyInfo.svg";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { useQuery } from "react-query";
import { getBills } from "../apiCalls/useBill";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";

export const Input = () => {
    // const { data, isLoading } = useQuery("bills", async () => await getBills());
    const navigate = useNavigate();
    // const unPaid = isLoading
    //     ? 0
    //     : data.data?.filter((m) => !m.attributes.payed).length;

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
                            Otvoreni Racuni
                            {/* : {unPaid} */}
                        </Button>
                        {/* )} */}
                    </>
                </Box>
                <Box sx={{ position: 'absolute', top: 5, left: 5 }}>
                    <BackButton route={"/home"} />
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
                    <CustomCard image={client} title={"KLIJENTI"} route={"/client"} />
                    <CustomCard image={article} title={"ARTIKLI"} route={"/article"} />
                    <CustomCard image={expenses} title={"TROSKOVI"} route={"/expenses"} />
                    <CustomCard image={companyInfo} title={"INFO O FIRMI"} route={"/company-info"} />
                </Box>
            </BackgroundWrapper>
        </AuthWrapper>
    );
};
