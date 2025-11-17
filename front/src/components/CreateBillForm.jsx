import {
  Box,
  Button,
  FormControl,
  ListItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getClients } from "../apiCalls/useClient";
import { formatPhoneNumber } from "../helper/calculations";
import useInfiniteScroll from "react-infinite-scroll-hook";
import Autocomplete from "@mui/material/Autocomplete";
import { getLastLawBill } from "../apiCalls/useBill";

export const CreateBillForm = ({ mutationFunction, id, client, setClient }) => {
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [fullInvoiceId, setFullInvoiceId] = useState('')

  const navigate = useNavigate();

  const clients = useQuery(
    ["clients", searchString],
    async () => await getClients(searchString, 1, 100),
    {
      enabled: !Boolean(id),
      keepPreviousData: true,
    }
  );
  function extractBetweenSlashes(str) {
    const parts = str?.split('/');
    return parts?.length >= 3 ? parts[1] : '';
  }

  const lawBills = useQuery(["lawBills", client.label], getLastLawBill, { enabled: client.label ? !isNaN(extractBetweenSlashes(client.label)) : false });

  function extractBeforeDash(str) {
    const index = str.indexOf('-');
    return index !== -1 ? str.slice(0, index) : str;
  }

  useEffect(() => {
    if (isNaN(extractBetweenSlashes(client.label))) {
      return
    }
    let lastInvoiceId = 1
    const dateNow = new Date()
    if (lawBills?.data?.data?.length > 0) {
      const createdAt = lawBills?.data?.data[0]?.attributes?.createdAt
      let lastInvoiceIdDb = lawBills?.data?.data[0]?.attributes?.invoiceId
      lastInvoiceId = lastInvoiceIdDb ? extractBeforeDash(lastInvoiceIdDb) : 1
      const createdAtDate = new Date(createdAt)
      if (dateNow.getMonth() === createdAtDate.getMonth()) {
        lastInvoiceId = Number(lastInvoiceId)
        lastInvoiceId += 1
      }
    }
    setFullInvoiceId(`${lastInvoiceId}-${dateNow.getMonth() + 1}/${dateNow.getFullYear().toString().replace('20', '')}`)
  }, [client, lawBills])

  const hasNextPage = clients.data?.meta?.pagination?.page < clients.data?.meta?.pagination?.pageCount;

  const fetchNextPage = () => {
    if (hasNextPage && !clients.isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: clients.isFetching,
    hasNextPage,
    disabled: !clients.data,
    rootMargin: "0px 0px 200px 0px",
    onLoadMore: fetchNextPage,
  });

  const clientOptions =
    clients.data?.data.map(({ id, attributes }) => ({
      value: id,
      label: `${attributes.name} /${attributes.surname}/ ${attributes.address} ${attributes.addressNumber} | ${attributes.mobile ? formatPhoneNumber(attributes.mobile) : ""
        }`,
    })) || [];

  const sentryOption = { value: "sentry", label: "" };

  const getFilteredOptions = (options) => {
    const filtered = [...options];
    if (hasNextPage || clients.isFetching) {
      filtered.push(sentryOption);
    }
    return filtered;
  };

  const renderClientOption = (props, option) => {
    if (option.value === "sentry") {
      return (
        <ListItem ref={sentryRef} key="sentry">
          Loading more...
        </ListItem>
      );
    }
    return (
      <ListItem {...props} key={option.value}>
        {option.label}
      </ListItem>
    );
  };

  const onSuccess = (data) => {
    const { id } = data.data;
    navigate(`/bill-articles/${id}`);
  };

  const mutation = useMutation(mutationFunction, {
    onSuccess,
    onError: () => toast("Greska", { type: "error" }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateNow = new Date();
    const datePlus3Days = new Date();
    datePlus3Days.setDate(dateNow.getDate() + 3);

    const payload = {
      client_id: client,
      pickup_date: datePlus3Days,
      invoiceId: !isNaN(extractBetweenSlashes(client.label)) ? fullInvoiceId : null
    };

    if (window.confirm("Da li ste sigurni da zelite da napravite racun za klijenta")) {
      mutation.mutate(payload);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        background: theme.primary,
        justifyContent: "space-between",
        flexDirection: "column",
        borderRadius: "15px",
        padding: "2%",
        minWidth: 370
      }}
    >
      <FormControl fullWidth sx={{ pb: "10px" }}>
        <Autocomplete
          loading={clients.isLoading}
          value={client.label || null}
          onChange={(event, value) => {
            if (value?.value !== "sentry") {
              setClient({ id: value?.value, label: value?.label });
            }
          }}
          options={clientOptions}
          filterOptions={getFilteredOptions}
          renderOption={renderClientOption}
          ListboxProps={{ ref: rootRef }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Klijent"
              onChange={(e) => setSearchString(e.target.value)}
            />
          )}
        />
      </FormControl>

      <Button disabled={!client} size="small" variant="contained" type="submit">
        Sacuvaj
      </Button>
    </Box>
  );
};