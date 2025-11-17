import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { BackButton } from "../components/BackButton";
import { useQuery } from "react-query";
import { getBill } from "../apiCalls/useBill";
import { getCompanyInfo } from "../apiCalls/useCompanyInfo";
import { AuthWrapper } from "../components/AuthWrapper";
import { MyDoc } from "../components/MyDoc";

export const BillPDF = () => {
  const { id } = useParams();
  const bill = useQuery(["bill", id], () => getBill(id));
  const companyInfo = useQuery("company-info", getCompanyInfo);

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        {bill.isLoading || companyInfo.isLoading ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ padding: "5px", height: "calc(100vh - 10px)", overflow: "hidden" }}>
            <BackButton route="/bill/list" />
            <Box
              sx={{
                width: "100%",
                height: "90vh",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <PDFViewer style={{ width: "55%", height: "90vh" }}>
                <MyDoc
                  data={bill.data.data.attributes}
                  id={bill.data.data.id}
                  companyInfo={companyInfo.data.data.attributes}
                />
              </PDFViewer>
            </Box>
          </Box>
        )}
      </BackgroundWrapper>
    </AuthWrapper>
  );
};