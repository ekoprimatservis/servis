import axios from "axios";
import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, TablePagination } from "@mui/material";
import { BackButton } from "../components/BackButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getArticles } from "../apiCalls/useArticle";
import { format } from "date-fns";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { AuthWrapper } from "../components/AuthWrapper";
import { theme } from "../helper/theme";

export const ArticleList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const navigate = useNavigate();
  const { data, isLoading } = useQuery(
    ["articles", page, rowsPerPage],
    async () => await getArticles(page, rowsPerPage)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <BackButton route={"/article"} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
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
                  height: "80vh",
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
                  <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Naziv</TableCell>
                        <TableCell align="right">Metrika</TableCell>
                        <TableCell align="right">Cena</TableCell>
                        <TableCell align="right">Cena Azurirana</TableCell>
                        <TableCell align="right">Opis</TableCell>
                        <TableCell align="right">Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.data.map((row) => (
                        <TableRow
                          key={row?.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {/* <TableCell component="th" scope="row">
                                            {row?.attributes?.name}
                                        </TableCell> */}
                          <TableCell align="left">
                            {row?.attributes?.name}
                          </TableCell>
                          <TableCell align="right">
                            {row?.attributes?.metric}
                          </TableCell>
                          <TableCell align="right">
                            {row?.attributes?.price}
                          </TableCell>
                          <TableCell align="right">
                            {row?.attributes?.updated ? format(
                              row?.attributes?.updated,
                              "dd/MM/yyyy, HH:mm"
                            ) : null}
                          </TableCell>
                          <TableCell align="right">
                            {row?.attributes?.description}
                          </TableCell>
                          <TableCell align="right">
                            <EditNoteIcon
                              onClick={() =>
                                navigate(`/article/edit/${row?.id}`)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
          <Box width={'83%'}>
            <TablePagination
              component="div"
              count={data?.meta?.pagination?.total || 100000}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </BackgroundWrapper>
    </AuthWrapper>
  );
};
