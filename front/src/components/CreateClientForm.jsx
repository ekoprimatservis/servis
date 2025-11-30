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
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getClient } from "../apiCalls/useClient";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";

const inputStyle = {
  margin: "5px 0 5px 0",
};

export const CreateClientForm = ({ mutationFunction, id }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [email, setEmail] = useState("");
  const [clientType, setClientType] = useState("Fizicko");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");


  const client = useQuery("client", async () => await getClient(id), {
    enabled: Boolean(id),
    onSuccess: ({ data }) => {
      const {
        name,
        surname,
        address,
        city,
        phone,
        mobile,
        mobile2,
        email,
        addressNumber,
        clientType,
        floor,
        entrance,
        apartment
      } = data.attributes;
      setName(name);
      setSurname(surname);
      setCity(city);
      setAddress(address);
      setPhone(phone);
      setMobile(mobile?.replace("0", "381"));
      setMobile2(mobile2?.replace("0", "381"));
      setEmail(email);
      setFloor(floor)
      setEntrance(entrance)
      setApartment(apartment)
      setAddressNumber(addressNumber);
      setClientType(clientType);
    },
  });
  const navigate = useNavigate();

  const onSuccess = () => {
    toast(`Uspesno ${id ? "editovanje" : "kreiranje"} klijenta ${name}`, {
      type: "success",
    });
    setName("");
    setSurname("");
    setCity("");
    setAddress("");
    setPhone("");
    setMobile("");
    setMobile2("");
    setEmail("");
    setAddressNumber("");
    setFloor("")
    setEntrance("")
    setApartment("")
    if (id) {
      navigate("/client/list");
    }
  };
  const mutation = useMutation(mutationFunction, {
    onSuccess: (data) => onSuccess(data),
    onError: () => toast("Greska", { type: "error" }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      name,
      surname,
      city,
      address,
      phone,
      mobile,
      addressNumber,
      clientType,
      floor,
      entrance,
      apartment,
      mobile2
    };
    if (email) {
      payload = { ...payload, email }
    }
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
        display: "flex",
        background: theme.primary,
        justifyContent: "space-between",
        flexDirection: "column",
        borderRadius: "15px",
        padding: "2%",
        minWidth: 350
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
        value={city ? city : ""}
        onChange={(e) => upperCase(setCity, e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Lokacija"
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
        value={addressNumber ? addressNumber : ""}
        onChange={(e) => setAddressNumber(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Broj"
        variant="outlined"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <TextField
          value={entrance ? entrance : ""}
          onChange={(e) => setEntrance(e.target.value)}
          size="small"
          sx={inputStyle}
          id="outlined-basic"
          label="Ulaz"
          variant="outlined"
        />
        <TextField
          value={floor ? floor : ""}
          onChange={(e) => setFloor(e.target.value)}
          size="small"
          sx={inputStyle}
          id="outlined-basic"
          label="Sprat"
          variant="outlined"
        />
        <TextField
          value={apartment ? apartment : ""}
          onChange={(e) => setApartment(e.target.value)}
          size="small"
          sx={inputStyle}
          id="outlined-basic"
          label="Stan"
          variant="outlined"
        />
      </Box>
      <TextField
        value={phone ? phone : ""}
        onChange={(e) => setPhone(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Telefon"
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
        inputStyle={{
          background: "none",
          width: "100%",
          border: "1px solid gray",
        }}
        buttonStyle={{ background: "none", border: "1px solid gray" }}
      />
      <PhoneInput
        country="rs"
        value={mobile2 ? mobile2 : ""}
        // onChange={e => console.log(e.length)}
        onChange={(e) => setMobile2(e)}
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

      {/* <TextField
        value={mobile ? mobile : ""}
        onChange={(e) => setMobile(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Mobilni"
        variant="outlined"
      /> */}
      <TextField
        value={email ? email : ""}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        sx={inputStyle}
        id="outlined-basic"
        label="Email"
        type="email"
        variant="outlined"
      />
      <Button size="small" variant="contained" type="submit">
        Sacuvaj
      </Button>
    </Box>
  );
};
