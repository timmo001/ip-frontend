import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetStaticProps } from "next";
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
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import Service from "../../types/Service";
import ServiceEdit from "../../components/Service/ServiceEdit";
import {
  createService,
  deleteService,
  getServices,
  triggerService,
  updateService,
} from "../../lib/data/services";
import ServiceView from "../../components/Service/ServiceView";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function Services(): ReactElement {
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

  async function handleGetServices(): Promise<void> {
    try {
      setServices(await getServices({ apiUrl, auth }));
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  const handleDeleteService = useCallback(
    (i: number) => async (): Promise<void> => {
      try {
        const service = services[i];
        await deleteService({ apiUrl, auth }, service);
        services.splice(i, 1);
        setServices(services);
        setMessage({
          severity: "success",
          text: `Deleted Service: ${service.name}`,
        });
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
        });
      }
    },
    [services]
  );

  const handleCreateService = useCallback(
    async (service: Service): Promise<void> => {
      try {
        services.push(await createService({ apiUrl, auth }, service));
        setServices(services);
        setMessage({
          severity: "success",
          text: `Updated Service: ${service.name}`,
        });
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
        });
      }
    },
    [services]
  );

  const handleUpdateService = useCallback(
    (i: number) => async (service: Service): Promise<void> => {
      try {
        if (services)
          services[i] = await updateService({ apiUrl, auth }, service);
        setServices(services);
        setMessage({
          severity: "success",
          text: `Updated Service: ${service.name}`,
        });
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
        });
      }
    },
    [services]
  );

  const handleTriggerService = useCallback(
    (i: number) => async (): Promise<void> => {
      try {
        const service = services[i];
        await triggerService({ apiUrl, auth }, service);
        setMessage({
          severity: "success",
          text: `Event triggered for Service: ${service.name}`,
        });
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
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
    if (auth && !services) handleGetServices();
  }, [auth, services, handleGetServices]);

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

export default Services;
