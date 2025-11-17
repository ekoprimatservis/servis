import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { useState } from "react";
import { theme } from "../helper/theme";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getClient } from "../apiCalls/useClient";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import { formatPhoneNumber } from "../helper/calculations";

const inputStyle = {
    margin: "5px 0 5px 0",
};

export const QuickCreateClientForm = ({ mutationFunction, id, setOpenDialog, setClient }) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [clientType, setClientType] = useState("Fizicko");
    const queryClient = useQueryClient();

    // const client = useQuery("client", async () => await getClient(id), {
    //     enabled: Boolean(id),
    //     onSuccess: ({ data }) => {
    //         const {
    //             name,
    //             surname,
    //             address,
    //             city,
    //             phone,
    //             mobile,
    //             email,
    //             addressNumber,
    //             clientType,
    //         } = data.attributes;
    //         setName(name);
    //         setSurname(surname);
    //         setCity(city);
    //         setAddress(address);
    //         setPhone(phone);
    //         setMobile(mobile.replace("0", "381"));
    //         setEmail(email);
    //         setAddressNumber(addressNumber);
    //         setClientType(clientType);
    //     },
    // });

    const onSuccess = (data) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        setOpenDialog(false)
        const { id, attributes } = data.data
        setClient({ id, label: `${attributes.name} ${attributes.surname} | ${attributes.address} ${attributes.addressNumber} | ${attributes.mobile ? formatPhoneNumber(attributes.mobile) : ""}` })
        toast(`Uspesno ${id ? "editovanje" : "kreiranje"} klijenta ${name}`, {
            type: "success",
        });
        setName("");
        setSurname("");
        setCity("");
        setAddress("");
        setPhone("");
        setMobile("");
        setEmail("");
        setAddressNumber("");
        // if (id) {
        //     navigate("/client/list");
        // }
    };

    const mutation = useMutation(mutationFunction, {
        onSuccess: (data) => onSuccess(data),
        onError: () => toast("Greska", { type: "error" }),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            surname,
            city,
            address,
            phone,
            mobile,
            // email,
            addressNumber,
            clientType,
        };
        id ? mutation.mutate({ ...payload, id }) : mutation.mutate(payload);
    };

    const upperCase = (setState, value) => {
        setState(value.charAt(0).toUpperCase() + value.slice(1));
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
                // padding: "2%",
            }}
        >
            <FormControl>
                <RadioGroup
                    row
                    onChange={(e) => setClientType(e.target.value)}
                    defaultValue={"Fizicko"}
                >
                    <FormControlLabel
                        value="Fizicko"
                        control={<Radio />}
                        label="Fizicko Lice"
                    />
                    <FormControlLabel
                        value="Pravno"
                        control={<Radio />}
                        label="Pravno Lice"
                    />
                </RadioGroup>
            </FormControl>
            <TextField
                value={name ? name : ""}
                onChange={(e) => upperCase(setName, e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label={clientType === 'Fizicko' ? "Ime" : 'Naziv firme'}
                required
                variant="outlined"
            />
            <TextField
                value={surname ? surname : ""}
                onChange={(e) => upperCase(setSurname, e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label={clientType === 'Fizicko' ? "Prezime" : 'PIB'}
                required
                variant="outlined"
            />
            <TextField
                value={address ? address : ""}
                onChange={(e) => upperCase(setAddress, e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Adresa"
                required
                variant="outlined"
            />
            <TextField
                value={city ? city : ""}
                onChange={(e) => upperCase(setCity, e.target.value)}
                size="small"
                sx={inputStyle}
                id="outlined-basic"
                label="Lokacija"
                required
                variant="outlined"
            />
            <PhoneInput
                country="rs"
                value={mobile ? mobile : ""}
                // onChange={e => console.log(e.length)}
                onChange={(e) => setMobile(e)}
                placeholder="+381 60 123 456 7"
                inputProps={{
                    maxLength: 16,
                }}
                label="Mobilni"
                disableDropdown
                required
                inputStyle={{
                    background: "none",
                    width: "100%",
                    border: "1px solid gray",
                }}
                buttonStyle={{ background: "none", border: "1px solid gray" }}
            />
            <Button sx={{ mt: 1 }} size="small" variant="contained" type="submit">
                Sacuvaj
            </Button>
        </Box>
    );
};
