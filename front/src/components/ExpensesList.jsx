import React, { useEffect, useLayoutEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, CircularProgress, IconButton, ListItemButton, TextField, Typography, } from "@mui/material";
import { theme } from "../helper/theme";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteExpense, getExpenses } from "../apiCalls/useExpenses";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from '@mui/icons-material/Search';

export const ExpensesList = () => {
    const [selectedDateFrom, setSelectedDateFrom] = useState('')
    const [selectedDateTo, setSelectedDateTo] = useState('')
    const { data, isLoading } = useQuery(["expenses", selectedDateFrom, selectedDateTo], async () => await getExpenses(selectedDateFrom, selectedDateTo), { enabled: Boolean(selectedDateFrom) && Boolean(selectedDateTo) });

    const queryClient = useQueryClient()

    const onSuccess = (data) => {
        toast(`Uspesno brisanje troska ${data.data.attributes.name} `, {
            type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
    };
    useLayoutEffect(() => {
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 1)
        setSelectedDateFrom(fromDate)
        setSelectedDateTo(new Date())
    }, [])

    const mutation = useMutation(deleteExpense, {
        onSuccess: (data) => onSuccess(data),
        onError: (err) => toast("Greska", { type: "error" }),
    });

    const handleDeleteExpense = (row) => {
        const payload = {
            id: row.id,
        };

        if (window.confirm(`Da li ste sigurni da zelite da obrisete trosak ${row.attributes.name}`)) {
            mutation.mutate({ ...payload })
        }
    }

    return (
        <Box
            sx={{
                minWidth: 380,
                width: '90%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                pt: '2%',
                overflowX: 'auto', // enables horizontal scroll if needed
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    background: theme.primary,
                    flexDirection: 'column',
                    borderRadius: '15px',
                    py: '2%',
                    height: '58vh',
                    width: '100%',
                    overflowY: 'auto',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year', 'month']}
                                value={dayjs(selectedDateFrom)}
                                onChange={(e) => setSelectedDateFrom(new Date(e))}
                                label="Od"
                                disableFuture
                                required
                                sx={{ width: '35%', pb: 1 }}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year', 'month']}
                                value={dayjs(selectedDateTo)}
                                onChange={(e) => setSelectedDateTo(new Date(e))}
                                label="Do"
                                disableFuture
                                required
                                sx={{ width: '35%', pb: 1 }}
                            />
                        </LocalizationProvider>
                        <IconButton
                            sx={{ bgcolor: '#1565C0' }}
                            size="small"
                            variant="contained"
                        >
                            <SearchIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                    <Typography>Ukupno: {isLoading ? '' : data?.data.reduce(
                        (partialSum, a) => partialSum + a.attributes.price,
                        0
                    )} RSD</Typography>
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
                    <TableContainer component={Paper}>
                        <Table stickyHeader sx={{ minWidth: 350 }} aria-label="simple table">
                            <TableHead >
                                <TableRow>
                                    <TableCell align="left">Naziv troska</TableCell>
                                    <TableCell align="left">Datum</TableCell>
                                    <TableCell align="left">Cena</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {filtredData
                        ?.sort(
                          (a, b) => a.attributes.payed - b.attributes.payed
                        ) */}
                                {data?.data?.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            //   background: backgroundRowColor(row.attributes),
                                            '&:hover .additionalButtonDelete': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ py: 0 }} align="left">
                                            {row.attributes.name}
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="left">
                                            {row.attributes.date}
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="left">
                                            {row.attributes.price}
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="left">
                                            <ListItemButton onClick={() => handleDeleteExpense(row)}
                                                className={'additionalButtonDelete'}
                                                sx={{
                                                    display: 'flex',
                                                    opacity: 0,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    py: 1.5,
                                                    width: 2,
                                                    borderRadius: 1,
                                                    "&.Mui-disabled": {
                                                        pointerEvents: "auto"
                                                    }
                                                }}>
                                                <DeleteIcon />
                                            </ListItemButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>)}
            </Box>
        </Box >
    )
}
