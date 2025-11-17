import { Box, Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { getCompanyInfo } from "../apiCalls/useCompanyInfo";
import PhoneInput from "react-phone-input-2";

const inputStyle = {
    margin: "5px 0 5px 0",
};

export const EditCompanyInfo = ({ mutationFunction, id }) => {
    const [bankInfo, setBankInfo] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [headerText, setHeaderText] = useState("");
    const [footerText, setFooterText] = useState('')
    const [email, setEmail] = useState('')
    const [cityName, setCityName] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [companyAddress, setCompanyAddress] = useState('')

    useQuery("company-info", async () => await getCompanyInfo(), {
        onSuccess: ({ data }) => {
            const { bankInfo, phoneNumber, mobileNumber, headerText, footerText, postalCode, cityName, companyAddress, email } = data.attributes;
            setBankInfo(bankInfo);
            setPhoneNumber(phoneNumber);
            setMobileNumber(mobileNumber);
            setFooterText(footerText)
            setHeaderText(headerText);
            setPostalCode(postalCode)
            setCompanyAddress(companyAddress)
            setCityName(cityName)
            setEmail(email)
        },
    });

    const onSuccess = (data) => {
        toast(`Uspesno editovanje informacija o firmi`, {
            type: "success",
        });
        const { bankInfo, phoneNumber, mobileNumber, headerText, footerText, postalCode, cityName, companyAddress, email } = data.data.attributes;
        setBankInfo(bankInfo);
        setPhoneNumber(phoneNumber);
        setMobileNumber(mobileNumber);
        setFooterText(footerText)
        setHeaderText(headerText);
        setPostalCode(postalCode)
        setCompanyAddress(companyAddress)
        setCityName(cityName)
        setEmail(email)
    };

    const mutation = useMutation(mutationFunction, {
        onSuccess: (data) => onSuccess(data),
        onError: (err) => toast("Greska", { type: "error" }),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            bankInfo,
            phoneNumber,
            mobileNumber,
            headerText,
            footerText,
            cityName,
            postalCode,
            email,
            companyAddress
        };
        mutation.mutate(payload);
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
                value={bankInfo ? bankInfo : ""}
                onChange={(e) => setBankInfo(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Info o banci"
                variant="outlined"
                multiline
            />
            <TextField
                value={phoneNumber ? phoneNumber : ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Fiksni"
                variant="outlined"
                multiline
            />
            <PhoneInput
                country="rs"
                value={mobileNumber ? mobileNumber : ""}
                // onChange={e => console.log(e.length)}
                onChange={(e) => setMobileNumber(e)}
                placeholder="+381 60 123 456 7"
                inputProps={{
                    maxLength: 16,
                }}
                label="Mobilni"
                disableDropdown
                inputStyle={{
                    background: "none",
                    width: "100%",
                    border: "1px solid gray",
                }}
                buttonStyle={{ background: "none", border: "1px solid gray" }}
            />
            <TextField
                value={headerText ? headerText : ""}
                onChange={(e) => setHeaderText(e.target.value)}
                size="small"
                sx={{ ...inputStyle, mt: 1.5 }}
                id="outlined-basic"
                label="Heder na racunu"
                variant="outlined"
                multiline
            />
            <TextField
                value={footerText ? footerText : ""}
                onChange={(e) => setFooterText(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Futer na racunu"
                variant="outlined"
                multiline
            />
            <TextField
                value={email ? email : ""}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="email"
                variant="outlined"
                multiline
            />
            <TextField
                value={companyAddress ? companyAddress : ""}
                onChange={(e) => setCompanyAddress(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Adresa"
                variant="outlined"
                multiline
            />
            <TextField
                value={postalCode ? postalCode : ""}
                onChange={(e) => setPostalCode(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Postanski broj"
                variant="outlined"
                multiline
            />
            <TextField
                value={cityName ? cityName : ""}
                onChange={(e) => setCityName(e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Grad"
                variant="outlined"
                multiline
            />
            <Button size="small" variant="contained" type="submit">
                Sacuvaj
            </Button>
        </Box>
    );
};
