import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Container, Link } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import {
  deleteEndpoint,
  getEndpoint,
  updateEndpoint,
} from "../../lib/data/endpoints";
import { getServices } from "../../lib/data/services";
import ApiAuthorization from "../../types/ApiAuthorization";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import Endpoint from "../../types/Endpoint";
import EndpointEditView from "../../components/Endpoint/EndpointEdit";
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import Service from "../../types/Service";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";
import Loading from "../../components/Shared/Loading";

interface EndpointEditProps {
  id: string;
}

function EndpointEdit(props: EndpointEditProps): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [endpoint, setEndpoint] = useState<Endpoint>();
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

  async function handleGetEndpoint(): Promise<void> {
    try {
      setEndpoint(await getEndpoint({ apiUrl, auth }, props.id));
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  const handleDelete = useCallback(async (): Promise<void> => {
    try {
      await deleteEndpoint({ apiUrl, auth }, endpoint);
      window.location.assign("/endpoints");
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }, [apiUrl, auth, endpoint]);

  const handleUpdateEndpoint = useCallback(
    async (endpoint: Endpoint): Promise<void> => {
      try {
        await updateEndpoint({ apiUrl, auth }, endpoint);
        window.location.assign("/endpoints");
      } catch (e) {
        setMessage({
          severity: "error",
          text: e.message,
        });
      }
    },
    [apiUrl, auth, endpoint]
  );

  function handleDeleteConfirm(): void {
    setDeleteConfirm(true);
  }

  function handleDeleteConfirmFinished(): void {
    setDeleteConfirm(false);
  }

  useEffect(() => {
    if (auth) {
      if (!endpoint) handleGetEndpoint();
      if (!services) handleGetServices();
    }
  }, [auth, endpoint, services, handleGetEndpoint, handleGetServices]);

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
      title={endpoint ? endpoint.name : "Edit"}
      url="https://upaas.timmo.dev"
      user={user}>
      {!endpoint || !services ? (
        <Loading text="Loading Data.." />
      ) : (
        <Container className={classes.main} component="article" maxWidth="xl">
          <EndpointEditView
            actions={
              <Fragment>
                <Button
                  className={classes.buttonWithIcon}
                  color="inherit"
                  size="medium"
                  style={{ backgroundColor: red[800] }}
                  variant="contained"
                  onClick={handleDeleteConfirm}>
                  <DeleteIcon
                    className={classes.iconOnButton}
                    fontSize="small"
                  />
                  Delete
                </Button>
                <Link href="/endpoints">
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
            endpoint={endpoint}
            services={services}
            handleSave={handleUpdateEndpoint}
          />
          {deleteConfirm ? (
            <ConfirmDialog
              text={`Are you sure you want to delete endpoint '${endpoint.name}'?`}
              handleConfirm={handleDelete}
              handleFinished={handleDeleteConfirmFinished}
            />
          ) : (
            ""
          )}
        </Container>
      )}
    </Layout>
  );
}

EndpointEdit.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};

export default EndpointEdit;
