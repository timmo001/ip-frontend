import React, {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import { teal } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import moment from "moment";
import Typography from "@material-ui/core/Typography";

import ApiAuthorization from "../types/ApiAuthorization";
import Auth from "./Auth";
import Header from "./Header";
import HeaderLinks from "./HeaderLinks";
import Markdown from "./Markdown";
import Message from "../types/Message";
import User from "../types/User";
import ShowMessage from "./Shared/ShowMessage";
import Loading from "./Shared/Loading";

let theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: teal,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  overrides: {
    MuiCard: {
      root: {
        margin: 8,
      },
    },
    MuiCardContent: {
      root: {
        padding: "24px 32px",
        "&:last-child": {
          paddingBottom: 16,
        },
      },
    },
    MuiChip: {
      root: {
        margin: 4,
      },
    },
    MuiCardActions: {
      root: {
        justifyContent: "flex-end",
      },
    },
  },
});
theme = responsiveFontSizes(theme);

interface LayoutProps {
  apiUrl: string;
  auth: ApiAuthorization;
  children?: ReactElement | ReactElement[];
  classes: ClassNameMap;
  description?: string;
  keywords?: string;
  message?: Message;
  setAuth: Dispatch<SetStateAction<ApiAuthorization | undefined>>;
  setMessage: Dispatch<SetStateAction<Message | undefined>>;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  title?: string;
  url?: string;
  user?: User;
}

function Layout(props: LayoutProps): ReactElement {
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const handleAuthorized = useCallback(
    async (auth: ApiAuthorization): Promise<void> => {
      if (process.env.NODE_ENV === "development")
        console.log("handleAuthorized - Auth:", auth);
      if (moment(auth.expiry) > moment()) {
        try {
          const response: AxiosResponse = await axios.get(
            "/backend/auth/user",
            {
              baseURL: props.apiUrl,
              headers: { Authorization: `Bearer ${auth.accessToken}` },
            }
          );
          if (response.data) {
            const user: User = response.data;
            if (process.env.NODE_ENV === "development")
              console.log("handleAuthorized - User:", user);
            props.setAuth(auth);
            props.setUser(user);
            setTimeout(
              () => handleAuthorized(auth),
              moment(auth.expiry).valueOf() - moment().valueOf() + 10000
            );
          } else {
            localStorage.removeItem("auth");
          }
        } catch (e) {
          console.error(e);
          localStorage.removeItem("auth");
        }
      } else {
        console.log("Auth token expired");
        props.setMessage({
          severity: "info",
          text: "Token expired. Please re-login",
        });
        handleLogOut();
      }
      setInitialLoad(false);
    },
    [props.apiUrl, props.auth, props.setUser, props.setMessage]
  );

  useEffect(() => {
    if (!props.auth) {
      const authStr = localStorage.getItem("auth");
      const auth: ApiAuthorization | null = authStr
        ? JSON.parse(authStr)
        : null;
      if (auth) handleAuthorized(auth);
      else setInitialLoad(false);
    }
  }, [props.auth, handleAuthorized]);

  function handleLogOut(): void {
    localStorage.removeItem("auth");
    props.setAuth(undefined);
    props.setUser(undefined);
  }

  function handleResetMessage(): void {
    props.setMessage(undefined);
  }

  const classes = props.classes;

  return (
    <>
      <Head>
        <title>{props.title ? `${props.title} - UPaaS` : `UPaaS`}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#009688" />
        <link rel="canonical" href={props.url} />
        <meta name="author" content="Owner" />
        <meta
          name="description"
          content={
            props.description
              ? `${props.description}`
              : props.title
              ? `${props.title} - UPaaS`
              : `UPaaS`
          }
        />
        <meta
          name="keywords"
          content={
            props.keywords
              ? `${props.keywords}`
              : `material, frontend, template, material-ui, nextjs, reactjs, react, developer`
          }
        />
        <meta name="msapplication-TileColor" content="#009688" />
        <meta name="theme-color" content="#009688" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        {initialLoad ? (
          <Loading text="Loading..." />
        ) : props.auth ? (
          <Fragment>
            <Header
              {...props}
              brand="UPaaS"
              changeColorOnScroll={{
                height: 32,
                color: "primary",
              }}
              color="transparent"
              fixed
              rightLinks={
                <HeaderLinks handleLogOut={handleLogOut} user={props.user} />
              }
            />
            {props.children}
            <Container
              className={classes.footer}
              component="footer"
              maxWidth="xl">
              <Card>
                <CardContent>
                  <Typography component="div">
                    <Markdown source="Copyright © Owner" escapeHtml={false} />
                  </Typography>
                </CardContent>
              </Card>
            </Container>
          </Fragment>
        ) : (
          <Auth
            apiUrl={props.apiUrl}
            handleAuthorized={handleAuthorized}
            setMessage={props.setMessage}
          />
        )}
        {props.message ? (
          <ShowMessage
            handleResetMessage={handleResetMessage}
            severity={props.message.severity}
            text={props.message.text}
          />
        ) : (
          ""
        )}
      </ThemeProvider>
    </>
  );
}

export default Layout;
