import axios from "axios";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../assets/ekoprimat-logo.png";
import { theme } from "../helper/theme";
import { useLayoutEffect } from "react";
import { CircularProgress } from "@mui/material";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const defaultTheme = createTheme();

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const mutation = useMutation(
    () =>
      axios.post(`${BASE_URL}api/auth/local`, {
        identifier: email,
        password,
      }),
    {
      onSuccess: (data) => {
        toast("Uspesno logovanje", { type: "success" });
        Cookies.set("jwt", data.data.jwt);
        navigate("/home");
      },
      onError: () => toast("Greska", { type: "error" }),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  useLayoutEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      navigate("/home");
      navigate(0);
      return;
    }
    setLoading(false);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      {loading || mutation.isLoading ? (
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> */}
            <img width={"250px"} src={Logo} />
            {/* </Avatar> */}
            {/* <Typography component="h1" variant="h5">
                            Sign in
                        </Typography> */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
};
