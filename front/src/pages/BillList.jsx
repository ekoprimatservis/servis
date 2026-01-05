import axios from "axios";
import * as React from "react";
import { useState, useEffect } from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, FormControl, IconButton, MenuItem, Select, TextField, InputLabel, Checkbox, ListItemText, OutlinedInput, ListItemButton, TablePagination } from "@mui/material";
import { BackButton } from "../components/BackButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { editBill, getBills } from "../apiCalls/useBill";
import { format } from "date-fns";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import PaidIcon from "@mui/icons-material/Paid";
import { applyDiscount, formatPhoneNumber } from "../helper/calculations";
import { toast } from "react-toastify";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { AuthWrapper } from "../components/AuthWrapper";
import { backgroundRowColor, theme } from "../helper/theme";
import DeleteIcon from '@mui/icons-material/Delete';
import { useFilters } from "../context/FiltersContext";


// const allFilters = [
//   { name: 'Placeno i isporuceno', color: '#D3D3D3' },
//   { name: 'Isporuceno i neplaceno', color: '#FFD580' },
//   { name: 'U magacinu i nema sifru', color: '#FF7F7F' },
//   { name: 'Spremno za transport', color: '#C5E1BA' },
//   { name: 'Ima sifru', color: '#FFFF6E' }
// ];
const allFilters = [
  { name: 'Sve', color: '' },
  { name: 'Narudzbina | Ima sifru | Transport', color: 'linear-gradient(to right, #FF7F7F 33%, #FFFF6E 33%, #FFFF6E 66%, #C5E1BA 66%)' },
  { name: 'Isporuceno i neplaceno', color: '#90D5FF' },
  { name: 'Narudzbina', color: '#FF7F7F' },
  { name: 'Ima sifru', color: '#FFFF6E' },
  { name: 'Transport', color: '#C5E1BA' },
  { name: 'Arhivirano', color: '#D3D3D3' },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export const BillList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const {
    selectedFilters,
    setSelectedFilters,
    nameSurnameSearch,
    setNameSurnameSearch,
    addressSearch,
    setAddressSearch,
    additionalIdSearch,
    setAdditionalIdSearch,
  } = useFilters();

  const [debouncedNameSurnameSearch, setDebouncedNameSurnameSearch] = useState('');
  const [debouncedAddressSearch, setDebouncedAddressSearch] = useState('');
  const [debouncedAdditionalIdSearch, setDebouncedAdditionalIdSearch] = useState('')
  const { data, isLoading } = useQuery(["bills", page, rowsPerPage, selectedFilters, debouncedNameSurnameSearch, debouncedAddressSearch, debouncedAdditionalIdSearch], async () => await getBills(null, page, rowsPerPage, selectedFilters, nameSurnameSearch, addressSearch, additionalIdSearch), { keepPreviousData: true });


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNameSurnameSearch(nameSurnameSearch);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [nameSurnameSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAddressSearch(addressSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [addressSearch]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAdditionalIdSearch(additionalIdSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [additionalIdSearch]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const upperCase = (setState, value) => {
    setState(value.charAt(0).toUpperCase() + value.slice(1));
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const mutationBillClose = useMutation(editBill, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      toast("Uspresna izmena racuna", { type: "success" });
    },
    onError: (err) => toast("Greska", { type: "error" }),
  });

  const handleTransportReady = async (id, e) => {
    const payload = {
      transportReady: true,
    };
    if (
      window.confirm(
        `Da li ste sigurni da je racun za klijenta ${e.name} ${e.surname} spreman za transport?\n(Ovom akcijom necete vise moci da vrsiti izmene na ovom racunu)`
      )
    ) {
      mutationBillClose.mutate({ ...payload, id });
    } else {
      toast("Akcija nije uspesna", { type: "error" });
    }
  };
  const handlePay = async (row, e) => {
    const payload = {
      payed: true,
    };
    if (
      window.confirm(
        `Da li ste sigurni da je racun za klijenta ${e.name} ${e.surname} placen?\n(Ovom akcijom necete vise moci da vrsiti izmene na ovom racunu)`
      )
    ) {
      mutationBillClose.mutate({ ...payload, id: row.id });
    } else {
      toast("Akcija nije uspesna", { type: "error" });
    }
  };
  const handleSubmitArticlesLocation = async (e, id) => {
    const payload = {
      articles_location: e,
    };
    //  e.preventDefault();
    if (
      window.confirm(
        `Da li ste sigurni da zelite da izmenite lokaciju artikla?`
      )
    ) {
      mutationBillClose.mutate({ ...payload, id });
    }
  };
  const handleDeleteBill = (id) => {
    const payload = {
      deletedFlag: true
    }
    if (
      window.confirm(
        `Da li ste sigurni da zelite da obrisete ovaj racun?`
      )
    ) {
      mutationBillClose.mutate({ ...payload, id });
    }
  }

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFilters(
      value);
    setPage(1)
  };

  return (
    <AuthWrapper>
      <BackgroundWrapper>
        <Box
          sx={{
            padding: "5px",
            height: "calc(100vh - 10px)",
            overflow: "hidden",
          }}
        >
          <BackButton route={"/bill"} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: 'center',
              justifyContent: "center",
              flexDirection: 'column'
            }}
          >
            <Box sx={{
              display: "flex",
              background: theme.primary,
              justifyContent: "space-between",
              // flexDirection: "column",
              borderRadius: "15px",
              padding: "2%",
              gap: 2,
              flexWrap: 'wrap',
            }}>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Filter</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={selectedFilters}
                  onChange={handleSelectChange}
                  input={<OutlinedInput label="Filter" />}
                  renderValue={(selected) => selected}
                  MenuProps={MenuProps}
                  sx={{ width: 300 }}
                >
                  {allFilters.map((item) => (
                    <MenuItem sx={{ p: 0 }} key={item.name} value={item.name}>
                      <Checkbox checked={selectedFilters === item.name} />
                      <ListItemText sx={{ background: item.color, py: 1.5, px: 1 }} primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                value={nameSurnameSearch}
                onChange={(e) => upperCase(setNameSurnameSearch, e.target.value)}
                size="big"
                sx={{ width: 300 }}
                id="outlined-basic"
                label={'Ime ili Prezime/Pib ili firma'}
                variant="outlined"
              />
              <TextField
                value={addressSearch}
                onChange={(e) => upperCase(setAddressSearch, e.target.value)}
                size="big"
                sx={{ width: 300 }}
                id="outlined-basic"
                label={'Adresa'}
                variant="outlined"
              />
              <TextField
                value={additionalIdSearch}
                onChange={(e) => setAdditionalIdSearch(e.target.value)}
                size="big"
                sx={{ width: 300 }}
                id="outlined-basic"
                label={'sifra tepiha'}
                variant="outlined"
              />
            </Box>
            {isLoading ? (
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
              <Box
                sx={{
                  height: "65vh",
                  overflow: "auto",
                  marginTop: "1.5%",
                  width: '100%'
                }}
              >
                <TableContainer style={{ overflowX: "initial" }} component={Paper}>
                  <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Sifra Tepiha</TableCell>
                        <TableCell align="left">Datum</TableCell>
                        <TableCell align="left">Klijent</TableCell>
                        <TableCell align="left">Adresa</TableCell>
                        <TableCell align="left">Ukupan Iznos</TableCell>
                        <TableCell align="left">Lokacija Artikla</TableCell>
                        <TableCell align="left">Edit</TableCell>
                        <TableCell align="left">Spremno za Transport</TableCell>
                        <TableCell align="left">Placen</TableCell>
                        <TableCell align="left">Faktura</TableCell>
                        <TableCell align="left">Racun</TableCell>
                        <TableCell align="left">Obrisi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.data
                        // ?.sort(
                        //   (a, b) => a.attributes.payed - b.attributes.payed
                        // )
                        ?.map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              background: backgroundRowColor(row.attributes),
                              '&:hover .additionalButtonDefault': {
                                opacity: 1,

                              },
                              '&:hover .additionalButtonDelete': {
                                opacity: 1,
                                color: !(!row.attributes.additionalId && !row.attributes.payed) ? 'transparent' : 'black',
                              },
                            }}
                          >
                            <TableCell align="left">
                              {row.attributes.additionalId === 'bez sifre' ? '' : row.attributes.additionalId}
                            </TableCell>
                            <TableCell align="right">
                              {new Date(row.attributes.date ?? row.attributes.createdAt).toLocaleDateString("en-GB")}
                            </TableCell>
                            <TableCell align="left">
                              {row.attributes.client_id.data.attributes.surname || null}{" "}
                              {row.attributes.client_id.data.attributes.name || null}
                            </TableCell>
                            {/* <TableCell align="left">
                              {row.attributes.client_id.data.attributes.address} {row.attributes.client_id.data.attributes.addressNumber}
                            </TableCell> */}
                            <TableCell align="left">
                              {row.attributes.client_id.data.attributes.address} {row.attributes.client_id.data.attributes.addressNumber}
                            </TableCell>
                            <TableCell align="left">
                              {row.attributes.bill_articles.data.length
                                ? `${applyDiscount(row.attributes.bill_articles.data, row.attributes.discount)} RSD`
                                : "---"}
                            </TableCell>
                            <TableCell align="left">
                              {/* {row.attributes.articles_location === 1 ? 'U magacinu' : 'Vraceno klijentu'} */}
                              <TextField
                                disabled={(!row.attributes.additionalId && !row.attributes.payed) || row.attributes.articles_location === 2}
                                onChange={(e) => handleSubmitArticlesLocation(e.target.value, row.id)}
                                value={row.attributes.articles_location}
                                size="small"
                                // sx={inputStyle}
                                id="outlined-basic"
                                type="text"
                                label="Lokacija artikla"
                                variant="outlined"
                                select
                                sx={{ minWidth: "160px" }}
                              >
                                <MenuItem value="1">U magacinu</MenuItem>
                                <MenuItem value="3">Transport</MenuItem>
                                <MenuItem value="2">Vraceno klijentu</MenuItem>
                              </TextField>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton
                                onClick={() =>
                                  navigate(`/bill-articles/${row.id}`)
                                }
                              >
                                <EditNoteIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                disabled={row.attributes.transportReady || (!row.attributes.additionalId && !row.attributes.payed) || !row.attributes.bill_articles.data.length}
                                onClick={() =>
                                  handleTransportReady(
                                    row.id,
                                    row.attributes.client_id.data.attributes
                                  )
                                }
                              >
                                <LocalShippingIcon sx={{ fill: row.attributes.transportReady ? 'green' : (!row.attributes.additionalId && !row.attributes.payed) || !row.attributes.bill_articles.data.length ? 'gray' : 'red' }} />
                              </IconButton>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                disabled={row.attributes.payed || (!row.attributes.additionalId && !row.attributes.payed) || !row.attributes.bill_articles.data.length}
                                onClick={() =>
                                  handlePay(
                                    row,
                                    row.attributes.client_id.data.attributes
                                  )
                                }
                              >
                                <PaidIcon sx={{ fill: row.attributes.payed ? 'green' : (!row.attributes.additionalId && !row.attributes.payed) || !row.attributes.bill_articles.data.length ? 'gray' : 'red' }} />
                              </IconButton>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton
                                disabled={!row.attributes.bill_articles.data.length || row.attributes.client_id.data.attributes.clientType !== 'Pravno'}
                                onClick={() =>
                                  navigate(`/invoice-pdf/${row.id}`)
                                }
                              >
                                <DescriptionIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton
                                disabled={!row.attributes.bill_articles.data.length}
                                onClick={() => navigate(`/bill-pdf/${row.id}`)}
                              >
                                <RequestPageIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <ListItemButton
                                onClick={() => handleDeleteBill(row.id)}
                                disabled={!(!row.attributes.additionalId && !row.attributes.payed)}
                                className={'additionalButtonDelete'}
                                sx={{
                                  display: 'flex',
                                  opacity: 0,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  py: 1.5,
                                  width: 2,
                                  borderRadius: 1,
                                  color: 'transparent',
                                }}>
                                <DeleteIcon />
                              </ListItemButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
          <TablePagination
            component="div"
            count={data?.meta?.pagination?.total || 100000}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
