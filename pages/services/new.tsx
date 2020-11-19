import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetStaticProps } from "next";
import { Button, Container, Link } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { createService } from "../../lib/data/services";
import { getServices } from "../../lib/data/services";
import ApiAuthorization from "../../types/ApiAuthorization";
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import Service from "../../types/Service";
import ServiceEditView from "../../components/Service/ServiceEdit";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function ServiceNew(): ReactElement {
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

  const handleCreateService = useCallback(
    async (service: Service): Promise<void> => {
      try {
        await createService({ apiUrl, auth }, service);
        window.location.assign("/services");
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
        });
      }
    },
    [apiUrl, auth]
  );

  useEffect(() => {
    if (auth) {
      if (!services) handleGetServices();
    }
  }, [auth, services, handleGetServices]);

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
        <ServiceEditView
          actions={
            <Fragment>
              <div className={classes.flex} />
              <Link href="/services">
                <Button
                  className={classes.buttonWithIcon}
                  color="primary"
                  size="medium"
                  style={{ marginLeft: 0 }}
                  variant="contained">
                  <DeleteIcon
                    className={classes.iconOnButton}
                    fontSize="small"
                  />
                  Cancel
                </Button>
              </Link>
            </Fragment>
          }
          service={{
            id: "",
            name: "",
            description: "",
            conditions: [],
            actions: [],
          }}
          handleSave={handleCreateService}
          new
        />
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

export default ServiceNew;
