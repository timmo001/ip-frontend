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

import { createEndpoint } from "../../lib/data/endpoints";
import { getServices } from "../../lib/data/services";
import ApiAuthorization from "../../types/ApiAuthorization";
import Endpoint from "../../types/Endpoint";
import EndpointEditView from "../../components/Endpoint/EndpointEdit";
import Layout from "../../components/Layout";
import Loading from "../../components/Shared/Loading";
import Message from "../../types/Message";
import Service from "../../types/Service";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function EndpointNew(): ReactElement {
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
        text: JSON.stringify(e.message),
      });
    }
  }

  const handleCreateEndpoint = useCallback(
    async (endpoint: Endpoint): Promise<void> => {
      try {
        await createEndpoint({ apiUrl, auth }, endpoint);
        window.location.assign("/endpoints");
      } catch (e) {
        setMessage({
          severity: "error",
          text: JSON.stringify(e.message),
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
      title="Endpoints"
      url="https://upaas.timmo.dev"
      user={user}
    >
      {!services ? (
        <Loading text="Loading Data.." />
      ) : (
        <Container className={classes.main} component="article" maxWidth="xl">
          <EndpointEditView
            actions={
              <Fragment>
                <Link href="/endpoints">
                  <Button
                    className={classes.buttonWithIcon}
                    color="primary"
                    size="medium"
                    style={{ marginLeft: 0 }}
                    variant="contained"
                  >
                    <DeleteIcon
                      className={classes.iconOnButton}
                      fontSize="small"
                    />
                    Cancel
                  </Button>
                </Link>
              </Fragment>
            }
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
            handleSave={handleCreateEndpoint}
            new
            services={services}
          />
        </Container>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 1,
  };
};

export default EndpointNew;
