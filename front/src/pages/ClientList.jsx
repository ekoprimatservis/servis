import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, TextField } from "@mui/material";
import { BackButton } from "../components/BackButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getClients } from "../apiCalls/useClient";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { formatLandLinePhone, formatPhoneNumber } from "../helper/calculations";
import { AuthWrapper } from "../components/AuthWrapper";
import { useState } from "react";
import { theme } from "../helper/theme";
import TablePagination from '@mui/material/TablePagination';

export const ClientList = () => {
  const navigate = useNavigate();
  const [nameSearch, setNameSearch] = useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const { data, isLoading } = useQuery(
    ["clients", nameSearch, page, rowsPerPage],
    async () => await getClients(nameSearch, page, rowsPerPage)
  );

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
          <BackButton route={"/client"} />
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
              display: "flex",
              background: theme.primary,
              justifyContent: "space-between",
              flexDirection: "column",
              borderRadius: "15px",
              padding: "1.5%",
            }}>
              <TextField
                value={nameSearch}
                onChange={(e) => { setNameSearch(e.target.value); setPage(0) }}
                size="small"
                // sx={inputStyle}
                id="outlined-basic"
                label={'Pretraga po imenu ili prezimenu'}
                variant="outlined"
              />
            </Box>
          </Box>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
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
                height: "70vh",
                overflow: "auto",
                marginTop: "1.5%",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: '70vh', // or whatever fits your layout
                  overflowY: 'auto',
                  overflowX: 'auto',
                  backgroundColor: theme.primary,
                }}
              >

                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Ime</TableCell>
                      <TableCell align="right">Prezime</TableCell>
                      <TableCell align="right">Adresa</TableCell>
                      <TableCell align="right">Broj</TableCell>
                      <TableCell align="right">Grad</TableCell>
                      <TableCell align="right">Klijent</TableCell>
                      <TableCell align="right">Email</TableCell>
                      <TableCell align="right">Fiksni</TableCell>
                      <TableCell align="right">Mobilni</TableCell>
                      <TableCell align="right">Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell component="th" scope="row">
                                            {row.attributes.name}
                                        </TableCell> */}
                        <TableCell align="right">
                          {row.attributes.name}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.surname}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.address}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.addressNumber}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.city}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.clientType}
                        </TableCell>
                        <TableCell align="right">
                          {row.attributes.email}
                        </TableCell>
                        <TableCell align="right">
                          {formatLandLinePhone(row.attributes.phone || null)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPhoneNumber(row.attributes.mobile || null)}
                        </TableCell>
                        <TableCell align="right">
                          <EditNoteIcon
                            onClick={() => navigate(`/client/edit/${row.id}`)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </Box>
          )}
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
