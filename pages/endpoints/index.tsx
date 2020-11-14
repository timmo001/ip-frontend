import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetStaticProps } from "next";
import axios, { AxiosResponse } from "axios";
import {
  Container,
  Dialog,
  Fab,
  Grid,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import ApiAuthorization from "../../types/ApiAuthorization";
import Endpoint from "../../types/Endpoint";
import EndpointEdit from "../../components/Endpoint/EndpointEdit";
import EndpointView from "../../components/Endpoint/EndpointView";
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function Endpoints(): ReactElement {
  const [addEndpoint, setAddEndpoint] = useState<boolean>(false);
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [endpoints, setEndpoints] = useState<Endpoint[]>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  async function getEndpoints(): Promise<void> {
    try {
      console.log("getEndpoints - auth:", auth);
      const response: AxiosResponse = await axios.get("/backend/endpoints", {
        baseURL: apiUrl,
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      if (response.status === 200 && response.data) {
        if (process.env.NODE_ENV === "development")
          console.log("getEndpoints - Endpoints:", response.data);
        setEndpoints(response.data);
      } else {
        setMessage({
          severity: "error",
          text: `Error getting Endpoints: ${response.data}`,
        });
      }
    } catch (e) {
      console.error(e);
      setMessage({
        severity: "error",
        text: `Error getting Endpoints: ${e.message}`,
      });
    }
  }

  const handleDeleteEndpoint = useCallback(
    (i: number) => async (): Promise<void> => {
      if (endpoints)
        try {
          const endpoint = endpoints[i];
          const response: AxiosResponse = await axios.delete(
            `/backend/endpoints/${endpoint.id}`,
            {
              baseURL: apiUrl,
              headers: { Authorization: `Bearer ${auth.accessToken}` },
            }
          );
          if (response.status === 200 && response.data) {
            if (process.env.NODE_ENV === "development")
              console.log("Deleted:", endpoint);
            setMessage({
              severity: "success",
              text: `Deleted Endpoint: ${endpoint.name}`,
            });
            endpoints.splice(i, 1);
            setEndpoints(endpoints);
          } else {
            setMessage({
              severity: "error",
              text: `Error updating Endpoint: ${response.data}`,
            });
          }
        } catch (e) {
          console.error(e);
          setMessage({
            severity: "error",
            text: `Error updating Endpoint: ${e.message}`,
          });
        }
    },
    [endpoints]
  );

  const handleCreateEndpoint = useCallback(
    async (endpoint: Endpoint): Promise<void> => {
      try {
        const response: AxiosResponse = await axios.post(
          `/backend/endpoints`,
          endpoint,
          {
            baseURL: apiUrl,
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          }
        );
        if (response.status === 201 && response.data) {
          if (process.env.NODE_ENV === "development")
            console.log("Endpoints:", response.data);
          setMessage({
            severity: "success",
            text: `Updated Endpoint: ${endpoint.name}`,
          });
          endpoint.id = response.data.id;
          if (endpoints) endpoints.push(endpoint);
          setEndpoints(endpoints);
        } else {
          setMessage({
            severity: "error",
            text: `Error updating Endpoint: ${response.data}`,
          });
        }
      } catch (e) {
        console.error(e);
        setMessage({
          severity: "error",
          text: `Error updating Endpoint: ${e.message}`,
        });
      }
    },
    [endpoints]
  );

  const handleUpdateEndpoint = useCallback(
    (i: number) => async (endpoint: Endpoint): Promise<void> => {
      try {
        const response: AxiosResponse = await axios.put(
          `/backend/endpoints/${endpoint.id}`,
          endpoint,
          {
            baseURL: apiUrl,
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          }
        );
        if (response.status === 200 && response.data) {
          if (process.env.NODE_ENV === "development")
            console.log("Endpoints:", response.data);
          setMessage({
            severity: "success",
            text: `Updated Endpoint: ${endpoint.name}`,
          });
          if (endpoints) endpoints[i] = endpoint;
          setEndpoints(endpoints);
        } else {
          setMessage({
            severity: "error",
            text: `Error updating Endpoint: ${response.data}`,
          });
        }
      } catch (e) {
        console.error(e);
        setMessage({
          severity: "error",
          text: `Error updating Endpoint: ${e.message}`,
        });
      }
    },
    [endpoints]
  );

  function handleAddEndpoint(): void {
    setAddEndpoint(true);
  }

  function handleFinishedAddingEndpoint(): void {
    setAddEndpoint(false);
  }

  useEffect(() => {
    if (auth && !endpoints) getEndpoints();
  }, [auth, endpoints, getEndpoints]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <Layout
      apiUrl={apiUrl}
      auth={auth}
      classes={classes}
      description="TODO"
      message={message}
      setAuth={setAuth}
      setMessage={setMessage}
      setUser={setUser}
      title="Endpoints"
      url="https://upaas.timmo.dev"
      user={user}>
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid container direction="row">
          {endpoints
            ? endpoints.map((endpoint: Endpoint, index: number) => (
                <EndpointView
                  key={index}
                  endpoint={endpoint}
                  handleDeleteEndpoint={handleDeleteEndpoint(index)}
                  handleUpdateEndpoint={handleUpdateEndpoint(index)}
                />
              ))
            : ""}
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="add"
            onClick={handleAddEndpoint}>
            <AddIcon />
          </Fab>
          <Dialog
            open={addEndpoint}
            fullScreen={fullScreen}
            fullWidth
            maxWidth="lg"
            aria-labelledby="dialog-title">
            {addEndpoint ? (
              <EndpointEdit
                endpoint={{
                  id: "",
                  endpoint: "",
                  service: "",
                  name: "",
                  resultOnly: true,
                  logLevel: "info",
                  supportedMethods: "",
                  published: false,
                }}
                handleUpdateEndpoint={handleCreateEndpoint}
                handleFinishedEditingEndpoint={handleFinishedAddingEndpoint}
              />
            ) : (
              ""
            )}
          </Dialog>
        </Grid>{" "}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 1,
  };
};

export default Endpoints;
