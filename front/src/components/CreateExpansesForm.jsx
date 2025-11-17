import { Box, Button, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const inputStyle = {
    margin: "5px 0 5px 0",
    width: 200
};

export const CreateExpansesForm = ({ mutationFunction, id }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        const date = new Date()
        setSelectedDate(date)
    }, [])


    // const article = useQuery("article", async () => await getArticle(id), {
    //     enabled: Boolean(id),
    //     onSuccess: ({ data }) => {
    //         const { name, metric, price, description } = data.attributes;
    //         setName(name);
    //         setMetric(metric);
    //         setPrice(price);
    //         setDescription(description);
    //     },
    // });
    // const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onSuccess = (data) => {
        toast(`Uspesno kreiranje troska ${name}`, {
            type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        setName("");
        const date = new Date()
        setSelectedDate(date);
        setPrice("");
    };

    const mutation = useMutation(mutationFunction, {
        onSuccess: (data) => onSuccess(data),
        onError: (err) => toast("Greska", { type: "error" }),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            date: selectedDate,
            price,
        };
        mutation.mutate({ ...payload })
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                minWidth: 350,
                display: "flex",
                background: theme.primary,
                justifyContent: "space-between",
                flexDirection: "row",
                borderRadius: "15px",
                padding: "2%",
                alignItems: 'center',
                flexWrap: 'wrap'
            }}
        >
            <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                // size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Naziv troska"
                required
                variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={dayjs(selectedDate).set("hour", 12)}
                    onChange={(e) => setSelectedDate(e)}
                    label="Datum"
                    disableFuture
                    required
                />
            </LocalizationProvider>
            <TextField
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={inputStyle}
                id="outlined-basic"
                label="Cena"
                required
                variant="outlined"
            />
            <Button
                size="large"
                variant="contained" type="submit">
                Sacuvaj
            </Button>
        </Box>
    );
};
