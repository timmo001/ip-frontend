import React, {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios, { AxiosResponse } from "axios";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import moment from "moment";

import ApiAuthorization from "../types/ApiAuthorization";
import GenericObject from "../types/GenericObject";
import User from "../types/User";
import Message from "../types/Message";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  item: {
    width: "100%",
    padding: theme.spacing(0.5),
  },
  textField: {
    maxWidth: 280,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

interface AuthProps {
  apiUrl: string;
  handleAuthorized: (auth: ApiAuthorization) => Promise<void>;
  setMessage: Dispatch<SetStateAction<Message | undefined>>;
}

export default function Auth(props: AuthProps): ReactElement {
  const [login, setLogin] = useState<User>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [registering, setRegistering] = useState<boolean>(false);

  useEffect(() => {
    const authStr = localStorage.getItem("auth");
    const auth: ApiAuthorization | null = authStr ? JSON.parse(authStr) : null;
    if (auth) props.handleAuthorized(auth);
  }, [props]);

  const handleChange = (prop: keyof User) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLogin({ ...login, [prop]: event.target.value });
  };

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter")
      if (registering) handleRegister();
      else handleLogin();
  }

  function toggleRegistering(): void {
    setRegistering(!registering);
  }

  async function handleRegister(): Promise<void> {
    if (!validationSuccess) return;
    console.log("Auth - handleRegister", login);
    try {
      const response: GenericObject = await axios.post(
        "/backend/auth/register",
        login,
        { baseURL: props.apiUrl }
      );
      if (response) handleLogin();
      else
        props.setMessage({
          severity: "error",
          text: `Error registering: ${response.result?.message}`,
        });
    } catch (e) {
      console.error(e);
      props.setMessage({
        severity: "error",
        text: `Error registering: ${e.message}`,
      });
    }
  }

  async function handleLogin(): Promise<void> {
    if (!validationSuccess) return;
    console.log("Auth - handleLogin:", login);
    try {
      const response: AxiosResponse = await axios.post(
        "/backend/auth/login",
        {
          username: login.username,
          password: login.password,
        },
        { baseURL: props.apiUrl }
      );
      console.log("Response:", response);
      if (response) {
        const auth: ApiAuthorization = response.data;
        auth.expiry = moment()
          .add(auth.expiresIn.replace("s", ""), "s")
          .toDate();
        localStorage.setItem("auth", JSON.stringify(auth));
        console.log("Auth - authorized:", auth);
        props.handleAuthorized(auth);
      } else
        props.setMessage({
          severity: "error",
          text: `Error logging in: ${response.data.message}`,
        });
    } catch (e) {
      console.error(e);
      props.setMessage({
        severity: "error",
        text: `Error logging in: ${e.message}`,
      });
    }
  }

  const validationSuccess: boolean = useMemo(() => {
    if (!login.username) return false;
    if (!login.password) return false;
    if (registering) {
      if (!login.email) return false;
      if (!login.firstName) return false;
    }
    return true;
  }, [
    login.email,
    login.firstName,
    login.password,
    login.username,
    registering,
  ]);

  const theme = useTheme();
  const largerScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  return (
    <Fragment>
      <Grid
        className={classes.root}
        container
        component="section"
        direction="row"
        alignItems="center"
        justify="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={4}
          xl={2}
          container
          direction="column"
          alignItems="center"
          justify="center">
          <Grid className={classes.item} item>
            <Card>
              <CardMedia
                component="img"
                alt="Logo"
                height={largerScreen ? 340 : 240}
                image="https://via.placeholder.com/400"
                title="Logo"
              />
              <CardContent>
                <Grid
                  component="form"
                  container
                  direction="column"
                  alignItems="center"
                  justify="center">
                  <Typography gutterBottom variant="h5" component="h2">
                    {registering ? "Register" : "Login"}
                  </Typography>
                  <TextField
                    className={classes.textField}
                    autoComplete="username"
                    fullWidth
                    id="username"
                    label="Username"
                    margin="dense"
                    required
                    value={login.username}
                    onChange={handleChange("username")}
                    onKeyPress={handleKeyPress}
                  />
                  <TextField
                    className={classes.textField}
                    autoComplete={
                      registering ? "new-password" : "current-password"
                    }
                    fullWidth
                    id="password"
                    label="Password"
                    margin="dense"
                    required
                    type="password"
                    value={login.password}
                    onChange={handleChange("password")}
                    onKeyPress={handleKeyPress}
                  />
                  {registering ? (
                    <Fragment>
                      <TextField
                        className={classes.textField}
                        autoComplete="email"
                        fullWidth
                        id="email"
                        label="Email"
                        margin="dense"
                        required
                        type="email"
                        value={login.email}
                        onChange={handleChange("email")}
                        onKeyPress={handleKeyPress}
                      />
                      <TextField
                        className={classes.textField}
                        autoComplete="given-name"
                        fullWidth
                        id="first-name"
                        label="First Name"
                        margin="dense"
                        required
                        type="text"
                        value={login.firstName}
                        onChange={handleChange("firstName")}
                        onKeyPress={handleKeyPress}
                      />
                      <TextField
                        className={classes.textField}
                        autoComplete="family-name"
                        fullWidth
                        id="last-name"
                        label="Last Name"
                        margin="dense"
                        required
                        type="text"
                        value={login.lastName}
                        onChange={handleChange("lastName")}
                        onKeyPress={handleKeyPress}
                      />
                    </Fragment>
                  ) : (
                    ""
                  )}
                </Grid>
              </CardContent>
              <CardActions className={classes.actions}>
                <Button
                  size="medium"
                  color="primary"
                  variant="text"
                  onClick={toggleRegistering}>
                  {registering
                    ? "Alrady have an account?"
                    : "Don't have an account?"}
                </Button>
                <Button
                  disabled={!validationSuccess}
                  size="medium"
                  color="primary"
                  variant="contained"
                  onClick={registering ? handleRegister : handleLogin}>
                  {registering ? "Register" : "Login"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
