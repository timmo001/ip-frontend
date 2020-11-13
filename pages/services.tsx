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

import ApiAuthorization from "../types/ApiAuthorization";
import Layout from "../components/Layout";
import Service from "../types/Service";
import ServiceEdit from "../components/Service/ServiceEdit";
import ServiceView from "../components/Service/ServiceView";
import useStyles from "../assets/jss/components/layout";
import User from "../types/User";
import Message from "../types/Message";

interface ServicesProps {}

function Dashboard(props: ServicesProps): ReactElement {
  const [addService, setAddService] = useState<boolean>(false);
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [message, setMessage] = useState<Message>();
  const [services, setServices] = useState<Service[]>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  async function getServices(): Promise<void> {
    try {
      console.log("getServices - auth:", auth);
      const response: AxiosResponse = await axios.get("/backend/services", {
        baseURL: apiUrl,
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      if (response.status === 200 && response.data) {
        if (process.env.NODE_ENV === "development")
          console.log("getServices - Services:", response.data);
        setServices(response.data);
      } else {
        setMessage({
          severity: "error",
          text: `Error getting Services: ${response.data}`,
        });
      }
    } catch (e) {
      console.error(e);
      setMessage({
        severity: "error",
        text: `Error getting Services: ${e.message}`,
      });
    }
  }

  const handleDeleteService = useCallback(
    (i: number) => async (): Promise<void> => {
      if (services)
        try {
          const service = services[i];
          const response: AxiosResponse = await axios.delete(
            `/backend/services/${service.id}`,
            {
              baseURL: apiUrl,
              headers: { Authorization: `Bearer ${auth.accessToken}` },
            }
          );
          if (response.status === 200 && response.data) {
            if (process.env.NODE_ENV === "development")
              console.log("Deleted:", service);
            setMessage({
              severity: "success",
              text: `Deleted Service: ${service.name}`,
            });
            services.splice(i, 1);
            setServices(services);
          } else {
            setMessage({
              severity: "error",
              text: `Error updating Service: ${response.data}`,
            });
          }
        } catch (e) {
          console.error(e);
          setMessage({
            severity: "error",
            text: `Error updating Service: ${e.message}`,
          });
        }
    },
    [services]
  );

  const handleCreateService = useCallback(
    async (service: Service): Promise<void> => {
      try {
        const response: AxiosResponse = await axios.post(
          `/backend/services`,
          service,
          {
            baseURL: apiUrl,
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          }
        );
        if (response.status === 201 && response.data) {
          if (process.env.NODE_ENV === "development")
            console.log("Services:", response.data);
          setMessage({
            severity: "success",
            text: `Updated Service: ${service.name}`,
          });
          service.id = response.data.id;
          if (services) services.push(service);
          setServices(services);
        } else {
          setMessage({
            severity: "error",
            text: `Error updating Service: ${response.data}`,
          });
        }
      } catch (e) {
        console.error(e);
        setMessage({
          severity: "error",
          text: `Error updating Service: ${e.message}`,
        });
      }
    },
    [services]
  );

  const handleUpdateService = useCallback(
    (i: number) => async (service: Service): Promise<void> => {
      try {
        const response: AxiosResponse = await axios.put(
          `/backend/services/${service.id}`,
          service,
          {
            baseURL: apiUrl,
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          }
        );
        if (response.status === 200 && response.data) {
          if (process.env.NODE_ENV === "development")
            console.log("Services:", response.data);
          setMessage({
            severity: "success",
            text: `Updated Service: ${service.name}`,
          });
          if (services) services[i] = service;
          setServices(services);
        } else {
          setMessage({
            severity: "error",
            text: `Error updating Service: ${response.data}`,
          });
        }
      } catch (e) {
        console.error(e);
        setMessage({
          severity: "error",
          text: `Error updating Service: ${e.message}`,
        });
      }
    },
    [services]
  );

  const handleTriggerService = useCallback(
    (i: number) => async (): Promise<void> => {
      if (services)
        try {
          const service = services[i];
          const response: AxiosResponse = await axios.post(
            `/backend/events`,
            { type: "service", serviceKey: service.id },
            {
              baseURL: apiUrl,
              headers: { Authorization: `Bearer ${auth.accessToken}` },
            }
          );
          if (response.status === 201 && response.data) {
            if (process.env.NODE_ENV === "development")
              console.log("Services:", response.data);
            setMessage({
              severity: "info",
              text: `Event triggered for Service: ${service.name}`,
            });
          } else {
            setMessage({
              severity: "error",
              text: `Error triggering Event: ${response.data}`,
            });
          }
        } catch (e) {
          console.error(e);
          setMessage({
            severity: "error",
            text: `Error triggering Event: ${e.message}`,
          });
        }
    },
    [services]
  );

  function handleAddService(): void {
    setAddService(true);
  }

  function handleFinishedAddingService(): void {
    setAddService(false);
  }

  useEffect(() => {
    console.log("services - trigger");
    if (auth && !services) getServices();
  }, [auth, services, getServices]);

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
      title="Services"
      url="https://upaas.timmo.dev"
      user={user}>
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid container direction="row">
          {services
            ? services.map((service: Service, index: number) => (
                <ServiceView
                  {...props}
                  key={index}
                  service={service}
                  handleDeleteService={handleDeleteService(index)}
                  handleTriggerService={handleTriggerService(index)}
                  handleUpdateService={handleUpdateService(index)}
                />
              ))
            : ""}
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="add"
            onClick={handleAddService}>
            <AddIcon />
          </Fab>
          <Dialog
            open={addService}
            fullScreen={fullScreen}
            fullWidth
            maxWidth="lg"
            aria-labelledby="dialog-title">
            {addService ? (
              <ServiceEdit
                {...props}
                service={{ id: "", name: "", conditions: [], actions: [] }}
                handleUpdateService={handleCreateService}
                handleFinishedEditingService={handleFinishedAddingService}
              />
            ) : (
              ""
            )}
          </Dialog>
        </Grid>
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

export default Dashboard;
