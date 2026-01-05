import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { editBill, getBill } from "../apiCalls/useBill";
import { getArticles } from "../apiCalls/useArticle";
import { format } from "date-fns";
import { applyDiscount, formatPhoneNumber, formulaPicker } from "../helper/calculations";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const inputStyle = {
  margin: "5px 0 5px 0",
};
const boxStyle = {
  width: "400px",
  display: "flex",
  background: theme.primary,
  justifyContent: "space-between",
  flexDirection: "column",
  borderRadius: "15px",
  marginBottom: "2%",
  padding: "3%",
};

export const CreateBillArticlesForm = ({ mutationFunction, id }) => {
  const queryClient = useQueryClient();

  const [article, setArticle] = useState("");
  const [articleFormulaId, setArticleFormulaId] = useState("");
  const [formulaDetails, setFormulaDetails] = useState({ id: 0 });
  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState("");
  const [additionalId, setAdditionalId] = useState("");
  const [articlePrice, setArticlePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isPayed, setIsPayed] = useState(false);
  const [pickupDate, setPickupDate] = useState("")
  const [articlesLocation, setArticlesLocation] = useState("")

  const totalPrice = (width * height * articlePrice * (formulaDetails.id === 2 ? 3.14 : 1)).toFixed(2);

  const bill = useQuery("bill", async () => await getBill(id), {
    onSuccess: (data) => {
      setDiscount(data?.data.attributes.discount);
      setIsPayed(data?.data.attributes.payed);
      setAdditionalId(data?.data.attributes.additionalId)
    },
  });

  const articles = useQuery("articles", async () => await getArticles(1, 100));
  // http://localhost:1337/api/bill-articles?populate=[0]=bill&filters[bill][id][$eq]=6

  const mutation = useMutation(mutationFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill"] });
      toast("Uspesno dodat novi artikal", { type: "success" });
    },
    onError: () => toast("Greska", { type: "error" }),
  });
  const mutationDiscount = useMutation(editBill, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill"] });
      toast("Uspesno ste azurirali racun", { type: "success" });
    },
    onError: () => toast("Greska", { type: "error" }),
  });
  useEffect(() => {
    if (bill?.data) {
      setPickupDate(bill?.data?.data.attributes.pickup_date)
      setArticlesLocation(bill?.data?.data.attributes.articles_location)
    }
  }, [bill])

  const handleSubmit = async (e) => {
    const payload = {
      bill: id,
      articles: article,
      height,
      width,
      additionalId,
      price: totalPrice,
      article,
      articlePrice
    };
    e.preventDefault();

    if (
      window.confirm(
        `Da li ste sigurni da zelite da dodate stavku na racun za klijenta`
      )
    ) {
      const formatedPayload = formulaPicker(formulaDetails.id, payload);
      mutation.mutate(formatedPayload.payload);
    }
    // else {
    //     toast('Kreiranje racuna nije uspesno');
    // }
  };
  const handleSubmitDiscount = async (e) => {
    const payload = {
      discount,
    };
    e.preventDefault();
    if (
      window.confirm(
        `Da li ste sigurni da zelite da primenite popust na ovaj racun?`
      )
    ) {
      mutationDiscount.mutate({ ...payload, id });
    }
    // else {
    //     toast('Kreiranje racuna nije uspesno')
    // }
  };
  const handleAdditionalField = async (e) => {
    const payload = {
      additionalId,
    };
    e.preventDefault();
    if (
      window.confirm(
        `Da li ste sigurni da zelite da promenite sifru na ovom racunu?`
      )
    ) {
      mutationDiscount.mutate({ ...payload, id });
    }

  };
  useEffect(() => {
    if (!articles.isLoading && article) {
      const filtredArr = articles?.data?.data.filter((m) => m.id === article);
      setArticlePrice(filtredArr[0].attributes.price);
      setArticleFormulaId(filtredArr[0].attributes.formulaId);
      const formula = formulaPicker(filtredArr[0].attributes.formulaId);
      setFormulaDetails(formula);
    }
  }, [id, article]);

  const formatDiscountPrice = (e) => {
    const max = 100;
    const min = 0;
    let value = parseInt(e.target.value, 10);
    if (value > max) value = max;
    if (value < min) value = min;

    setDiscount(value);
  };
  const handleSubmitPickupDate = async (e) => {
    const payload = {
      pickup_date: e,
    };
    console.log(e)
    //  e.preventDefault();
    if (
      window.confirm(
        `Da li ste sigurni da zelite da azurirate datum preuzimanja?`
      )
    ) {
      mutationDiscount.mutate({ ...payload, id });
    }
  };
  const handleSubmitArticlesLocation = async (e) => {
    const payload = {
      articles_location: e,
    };
    //  e.preventDefault();
    if (
      window.confirm(
        `Da li ste sigurni da zelite da izmenite lokaciju artikla?`
      )
    ) {
      mutationDiscount.mutate({ ...payload, id });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        flexFlow: "wrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            marginBottom: "2%",
            ...boxStyle,
            width: "100%",
            padding: 2,
          }}
        >
          {!bill.isLoading ? (
            <>
              <Typography>
                Klijent:
                {bill?.data?.data.attributes.client_id?.data.attributes.name}{" "}
                {bill?.data?.data.attributes.client_id?.data.attributes.surname}
              </Typography>
              <Typography>
                Adresa:{" "}
                {bill?.data?.data.attributes.client_id?.data.attributes.address}{" "}
                {bill?.data?.data.attributes.client_id?.data.attributes.addressNumber}
                {bill?.data?.data.attributes.client_id?.data.attributes.entrance ? `ulaz:${bill?.data?.data.attributes.client_id?.data.attributes.entrance}/` : null}
                {bill?.data?.data.attributes.client_id?.data.attributes.floor ? `sprat:${bill?.data?.data.attributes.client_id?.data.attributes.floor}/` : null}
                {bill?.data?.data.attributes.client_id?.data.attributes.apartment ? `stan:${bill?.data?.data.attributes.client_id?.data.attributes.apartment}/` : null}
              </Typography>
              <Typography>
                Mobilni:{" "}
                {formatPhoneNumber(bill?.data?.data.attributes.client_id?.data.attributes.mobile)}
              </Typography>
              <Typography style={{ color: isPayed ? "" : "red" }}>
                {isPayed ? " Racun je Placen" : "Racun nije placen"}
              </Typography>
              <Typography>
                Ukupna Cena:{" "}
                {applyDiscount(
                  bill?.data?.data.attributes.bill_articles?.data,
                  discount
                )}{" "}
                RSD
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(pickupDate).set("hour", 12)}
                  onChange={(e) => handleSubmitPickupDate(e)}
                  sx={{ mt: 1 }}
                  label="Predvidjen datum za preuzimanje"
                />
              </LocalizationProvider>
              <Box
                onSubmit={handleAdditionalField}
                component="form"
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "row ",
                  pt: 1,
                }}>
                <TextField
                  disabled={isPayed}
                  value={additionalId}
                  onChange={(e) => setAdditionalId(e.target.value)}
                  size="small"
                  sx={inputStyle}
                  id="outlined-basic"
                  type="text"
                  label="Sifra racuna"
                  variant="outlined"
                />
                <Button
                  disabled={isPayed || bill?.data?.data?.attributes?.additionalId}
                  size="small"
                  variant="contained"
                  type="submit"
                >
                  Potvrdi
                </Button>
              </Box>
            </>
          ) : (
            "LOADING"
          )}
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            ...boxStyle,
            width: "100%",
            padding: 2,
          }}
        >
          <FormControl fullWidth sx={{ pb: "10px" }}>
            {/* <InputLabel id="demo-simple-select-label">Artikal</InputLabel> */}
            <TextField
              size="small"
              value={article}
              displayEmpty
              label="Artikal"
              onChange={({ target }) => setArticle(target.value)}
              disabled={isPayed || !bill?.data?.data?.attributes?.additionalId}
              select
            >
              {articles.isLoading ? (
                <MenuItem key={"x"} name="loading" value={{ id: "loading" }}>
                  LOADING
                </MenuItem>
              ) : (
                articles?.data?.data.map(({ id, attributes }) => (
                  <MenuItem key={id} value={id}>
                    {attributes.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </FormControl>
          {!article ? (
            <></>
          ) : formulaDetails.id === 1 ? (
            <>
              <input
                disabled={isPayed}
                placeholder="Duzina"
                required
                style={{
                  background: "transparent",
                  border: "1px solid gray",
                  borderRadius: "3px",
                  height: "40px",
                  paddingLeft: "10px",
                  fontSize: "15px",
                  marginBottom: "5px",
                }}
                onChange={(e) => setHeight(e.target.value)}
                type="number"
                step=".01"
              />
              <input
                disabled={isPayed}
                placeholder="Sirina"
                required
                style={{
                  background: "transparent",
                  border: "1px solid gray",
                  borderRadius: "3px",
                  height: "40px",
                  paddingLeft: "10px",
                  fontSize: "15px",
                }}
                onChange={(e) => setWidth(e.target.value)}
                type="number"
                step=".01"
              />
            </>
          ) : (
            <input
              disabled={isPayed}
              placeholder={formulaDetails.label}
              required
              style={{
                background: "transparent",
                border: "1px solid gray",
                borderRadius: "3px",
                height: "40px",
                paddingLeft: "10px",
                fontSize: "15px",
              }}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
              step=".01"
            />
          )}
          <Typography>Cena: {totalPrice} RSD</Typography>
          <Button
            disabled={isPayed || !bill?.data?.data?.attributes?.additionalId}
            size="small"
            variant="contained"
            type="submit"
          >
            Sacuvaj
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          ...boxStyle,
          width: "60%",
          minWidth: 340
        }}
      >
        {bill.isLoading ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress value={100} disableShrink />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ height: "40vh" }}>
              <Table stickyHeader
              // sx={{ minWidth: 650, height: "400px", overflow: "scroll" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Rb.</TableCell>
                    <TableCell align="right">Stavka</TableCell>
                    <TableCell align="right">Duzina</TableCell>
                    <TableCell align="right">Sirina</TableCell>
                    <TableCell align="right">Cena</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill?.data?.data.attributes.bill_articles?.data.map(
                    (row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="right">{index + 1}</TableCell>
                        <TableCell align="right">
                          {
                            row?.attributes?.article?.data?.attributes?.name
                          }
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.height}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.width}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.price}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.additionalId}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ minWidth: "300px" }}
                  label="Predvidjen datum za preuzimanje"
                  size="small"
                />
              </LocalizationProvider> */}
              {/* <FormControl fullWidth sx={{ pb: "10px" }}> */}
              <TextField
                disabled={(!additionalId && !isPayed) || bill?.data?.data.attributes.articles_location === 2}
                onChange={(e) => handleSubmitArticlesLocation(e.target.value)}
                value={articlesLocation}
                size="small"
                // sx={inputStyle}
                id="outlined-basic"
                type="text"
                label="Lokacija artikla"
                variant="outlined"
                select
                sx={{ minWidth: "150px" }}
              >
                <MenuItem value="1">U magacinu</MenuItem>
                <MenuItem value="2">Vraceno klijentu</MenuItem>
              </TextField>
              {/* <Select
                  size="small"
                  value={article}
                  displayEmpty
                  label="Status"
                  onChange={({ target }) => setArticle(target.value)}
                  disabled={isPayed}
                >
                  <MenuItem>U magacinu</MenuItem>
                  <MenuItem>Vraceno klijentu</MenuItem>
                </Select> */}
              {/* </FormControl> */}
              <Box
                onSubmit={handleSubmitDiscount}
                component="form"
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                  pt: 1,
                }}
              >
                <TextField
                  disabled={isPayed}
                  value={discount}
                  inputProps={{ max: 100, min: 0 }}
                  onChange={(e) => formatDiscountPrice(e)}
                  size="small"
                  sx={inputStyle}
                  id="outlined-basic"
                  type="number"
                  label="Popust"
                  variant="outlined"
                />
                <Button
                  disabled={isPayed}
                  size="small"
                  variant="contained"
                  type="submit"
                >
                  Primeni Popust
                </Button>
              </Box>
              {/* <Typography>
                Ukupna Cena:{" "}
                {applyDiscount(
                  bill?.data?.data.attributes.bill_articles?.data,
                  discount
                )}{" "}
                RSD
              </Typography> */}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
