import { useParams } from "react-router-dom";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font
} from "@react-pdf/renderer";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { BackButton } from "../components/BackButton";
import logo from "../assets/newLogoTransparent.png";
import { useQuery } from "react-query";
import { getBill, getLastLawBill } from "../apiCalls/useBill";
import { AuthWrapper } from "../components/AuthWrapper";
import { useEffect, useState } from "react";
import { applyDiscount } from "../helper/calculations";
import { getClients } from "../apiCalls/useClient";
import { getCompanyInfo } from "../apiCalls/useCompanyInfo";

const headerText = `SERVIS ZA ČISCENJE TEPIHA\nDimitrija Tucovića 9a\n22320 Inđija\nPIB: 108661394       Matični broj firme: 63609048        APR broj: BP91047/2014       Šifra delatnosti: 9601\nTekući račun: 105-0000002612679-77     AIK BANKA\nTelefon: 022/552-311     Mob telefon: 063/88-92-714      E-mail:ekoprimatservis@gmail.com\n\n*izdavalac računa nije obveznik pov-a po članu 33. Zakona o pdv.\n*izdavalac računa je paušalni obveznik poreza po članu 42. Zakona o porezu na dohodak`;

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    fontFamily: 'Roboto',
    // justifyContent: "center",
    // backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 8,
  },
  table: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid black",
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 8,
    width: "90%",
  },
  header: {
    borderTop: "none",
  },
  bold: {
    fontWeight: "bold",
  },
});

export const MyDoc = ({ data, fiscalClipping, companyInfo }) => {
  const {
    footerText = '',
    postalCode = '',
    cityName = '',
    companyAddress = '',
    phoneNumber = '',
    mobileNumber = '',
    email = '',
  } = companyInfo || {};

  const client = data?.client_id?.data?.attributes || {};
  const { name = '', address = '', addressNumber = '', city = '', surname = '' } = client;

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const billArticles = data?.bill_articles?.data;
    if (!Array.isArray(billArticles)) return;

    const summaryMap = {};

    billArticles.forEach((item) => {
      const articleId = item?.attributes?.article?.data?.id;
      const articleAttrs = item?.attributes?.article?.data?.attributes;
      const itemAttrs = item?.attributes;

      if (!articleId || !articleAttrs || !itemAttrs) return;

      const {
        name = '',
        description = '',
        metric = '',
        // price: articlePrice = 0,
      } = articleAttrs;
      const {
        price = 0,
        height = 0,
        width = 0,
        articlePrice = 0
      } = itemAttrs;

      const surface = height * width;

      if (summaryMap[articleId]) {
        summaryMap[articleId].totalPrice += price;
        summaryMap[articleId].surface += surface;
      } else {
        summaryMap[articleId] = {
          title: description,
          metric,
          articlePrice,
          totalPrice: price,
          surface,
        };
      }
    });

    setFilteredData(Object.values(summaryMap));
  }, [data]);


  const billArticles = data?.bill_articles?.data || [];
  const discount = data?.discount || 0;

  return (
    <Document title="Invoice">
      <Page size="A5" style={styles.page}>
        <View style={styles.section}>
          <Image src={logo} style={{ width: "150px" }} />
          <Text>{headerText}</Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            fontSize: 8,
            margin: 10,
            padding: 20,
          }}
        >
          <View style={{ width: "50%", display: "flex" }}>
            <Text style={{ paddingLeft: "30px", paddingBottom: "10px", fontWeight: "bold" }}>
              RAČUN BROJ: {data?.invoiceId || 'N/A'}
            </Text>
            <Text>
              Datum izdavanja računa:
              <Text style={{ textDecoration: "underline" }}> {new Date().toLocaleDateString("en-GB").replaceAll('/', '.')} </Text> godine
            </Text>
            <Text>
              Mesto izdavanja računa:
              <Text style={{ textDecoration: "underline" }}> Inđija</Text>
            </Text>
            <Text>
              Datum prometa dobara i usluga:
              <Text style={{ textDecoration: "underline" }}> {new Date(data?.createdAt).toLocaleDateString("en-GB").replaceAll('/', '.') || '/'} </Text> godine
            </Text>
            <Text>
              Mesto prometa dobara i usluga:
              <Text style={{ textDecoration: "underline" }}> Inđija</Text>
            </Text>
            <Text>
              Rok placanja: <Text>{"__________"}</Text>
            </Text>
            <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <Text>
                Nacin plaćanja: <Text style={{ textDecoration: "underline" }}> virmanski</Text>
              </Text>
              <Text style={{ paddingLeft: "10px" }}>
                fiskalni isečak BI: <Text style={{ textDecoration: "underline" }}>{fiscalClipping || 'N/A'}</Text>
              </Text>
            </View>
          </View>

          <View style={{ width: "50%", display: "flex", alignItems: "center" }}>
            <View>
              <Text style={{ paddingLeft: "30px", paddingBottom: "10px", fontWeight: "bold" }}>
                Klijent
              </Text>
              <Text>{name}</Text>
              <Text>{city}</Text>
              <Text>{address} {addressNumber}</Text>
              <Text>PIB: {surname}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={{ width: "10%" }}>Redni broj</Text>
            <Text style={{ width: "30%" }}>VRSTA - NAZIV USLUGE</Text>
            <Text style={{ width: "10%" }}>Jedinica mere</Text>
            <Text style={{ width: "15%" }}>Obim usluga</Text>
            <Text style={{ width: "10%" }}>CENA</Text>
            <Text style={{ width: "20%" }}>UKUPNA VREDNOST</Text>
          </View>
          {filteredData.map((row, i) => (
            <View key={i} style={styles.row} wrap={false}>
              <Text style={{ width: "10%" }}>{i + 1}</Text>
              <Text style={{ width: "30%" }}>{row.title}</Text>
              <Text style={{ width: "10%" }}>{row.metric}</Text>
              <Text style={{ width: "15%" }}>{row.surface.toFixed(2)}</Text>
              <Text style={{ width: "10%" }}>{row.articlePrice}.00</Text>
              <Text style={{ width: "15%" }}>{row.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            ...styles.row,
            justifyContent: "space-between",
            width: "50%",
            marginTop: "5%",
          }}
        >
          <Text style={{ fontSize: 10 }}>UKUPNO ZA NAPLATU</Text>
          <Text style={{ fontSize: 10 }}>
            {`${applyDiscount(billArticles, discount)} RSD`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>{footerText}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const InvoicePDF = () => {

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [fiscalClipping, setFiscalClipping] = useState('');
  const { id } = useParams();

  const companyInfo = useQuery("company-info", getCompanyInfo);
  const bill = useQuery(["bill", id], () => getBill(id));
  // const lawBills = useQuery("lawBills", getLastLawBill);

  // useEffect(() => {
  //   if (!lawBills?.data?.data || !id) return;

  //   const date = new Date();
  //   const index = lawBills.data.data.findIndex((element) => element?.id?.toString() === id?.toString());

  //   if (index !== -1) {
  //     setInvoiceNumber(`${index + 1}-${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`);
  //   }
  // }, [lawBills?.isLoading, lawBills?.data?.data, id]);

  const billData = bill?.data?.data?.attributes;
  const billId = bill?.data?.data?.id;
  const companyDetails = companyInfo?.data?.data?.attributes;

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        {bill?.isLoading || companyInfo?.isLoading ? (
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
          <Box
            sx={{
              padding: "5px",
              height: "calc(100vh - 10px)",
              overflow: "hidden",
            }}
          >
            <BackButton route="/bill/list" />
            <Box
              sx={{
                width: "100%",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  bgcolor: 'lightGray',
                  height: 50,
                  width: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextField
                  value={fiscalClipping}
                  onChange={(e) => setFiscalClipping(e.target.value)}
                  size="small"
                  id="outlined-basic"
                  label="Fiskalni isecak"
                  variant="standard"
                />
              </Box>

              <PDFViewer style={{ width: "55%", height: "90vh" }}>
                <MyDoc
                  data={billData}
                  // invoiceNumber={invoiceNumber}
                  fiscalClipping={fiscalClipping}
                  companyInfo={companyDetails}
                />
              </PDFViewer>
            </Box>
          </Box>
        )}
      </BackgroundWrapper>
    </AuthWrapper>
  );
}