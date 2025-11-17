import { Box, Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getArticle } from "../apiCalls/useArticle";

const inputStyle = {
  margin: "5px 0 5px 0",
};

export const CreateArticleForm = ({ mutationFunction, id }) => {
  const [name, setName] = useState("");
  const [metric, setMetric] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [formulaId, setFormulaId] = useState('')

  const article = useQuery("article", async () => await getArticle(id), {
    enabled: Boolean(id),
    onSuccess: ({ data }) => {
      const { name, metric, price, description, formulaId } = data.attributes;
      setName(name);
      setMetric(metric);
      setPrice(price);
      setDescription(description);
      setFormulaId(formulaId)
    },
  });
  const navigate = useNavigate();

  const onSuccess = (data) => {
    toast(`Uspesno ${id ? "editovanje" : "kreiranje"} artikla ${name}`, {
      type: "success",
    });
    setName("");
    setMetric("");
    setPrice("");
    setDescription("");
    if (id) {
      navigate("/article/list");
    }
  };

  const mutation = useMutation(mutationFunction, {
    onSuccess: (data) => onSuccess(data),
    onError: (err) => toast("Greska", { type: "error" }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const payload = {
      name,
      metric,
      price,
      description,
      updated: date,
      formulaId
    };
    id ? mutation.mutate({ ...payload, id }) : mutation.mutate(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        minWidth: 360,
        display: "flex",
        background: theme.primary,
        justifyContent: "space-between",
        flexDirection: "column",
        borderRadius: "15px",
        padding: "2%",
      }}
    >
      <TextField
        value={name ? name : ""}
        onChange={(e) => setName(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Naziv"
        required
        variant="outlined"
      />
      <TextField
        value={metric ? metric : ""}
        onChange={(e) => setMetric(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Metrika"
        required
        variant="outlined"
      />
      <TextField
        // disabled={isPayed}
        onChange={(e) => setFormulaId(e.target.value)}
        value={formulaId}
        size="small"
        // sx={inputStyle}
        id="outlined-basic"
        type="text"
        label="Izbor Formule"
        variant="outlined"
        select
        sx={{ minWidth: "300px", py: 1 }}
      >
        <MenuItem value='1'>Povrsina tepiha</MenuItem>
        <MenuItem value='2'>Povrsina kruznog tepiha</MenuItem>
        <MenuItem value='3'>Komad</MenuItem>
        <MenuItem value='4'>Sirina</MenuItem>
      </TextField>
      <TextField
        value={price ? price : ""}
        onChange={(e) => setPrice(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Cena"
        required
        variant="outlined"
      />
      <TextField
        value={description ? description : ""}
        onChange={(e) => setDescription(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Opis (Ovaj opis se izlistava u racunu)"
        required
        variant="outlined"
      />
      <Button size="small" variant="contained" type="submit">
        Sacuvaj
      </Button>
    </Box>
  );
};
