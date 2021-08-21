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
import PlayIcon from "@material-ui/icons/PlayArrowTwoTone";

import {
  deleteService,
  getService,
  triggerService,
  updateService,
} from "../../lib/data/services";
import ApiAuthorization from "../../types/ApiAuthorization";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import Layout from "../../components/Layout";
import Loading from "../../components/Shared/Loading";
import Message from "../../types/Message";
import Service from "../../types/Service";
import ServiceEditView from "../../components/Service/ServiceEdit";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

interface ServiceEditProps {
  id: string;
}

function ServiceEdit(props: ServiceEditProps): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [service, setService] = useState<Service>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.BACKEND_PORT || 5684
      }`,
    []
  );

  async function handleGetService(): Promise<void> {
    try {
      setService(await getService({ apiUrl, auth }, props.id));
    } catch (e) {
      setMessage({
        severity: "error",
        text: JSON.stringify(e.message),
      });
    }
  }

  const handleDelete = useCallback(async (): Promise<void> => {
    try {
      await deleteService({ apiUrl, auth }, service);
      window.location.assign("/services");
    } catch (e) {
      setMessage({
        severity: "error",
        text: JSON.stringify(e.message),
      });
    }
  }, [apiUrl, auth, service]);

  const handleUpdateService = useCallback(
    async (service: Service): Promise<void> => {
      try {
        await updateService({ apiUrl, auth }, service);
        window.location.assign("/services");
      } catch (e) {
        setMessage({
          severity: "error",
          text: JSON.stringify(e.message),
        });
      }
    },
    [apiUrl, auth, service]
  );

  const handleTriggerService = useCallback(async (): Promise<void> => {
    try {
      await triggerService({ apiUrl, auth }, service);
    } catch (e) {
      setMessage({
        severity: "error",
        text: JSON.stringify(e.message),
      });
    }
  }, [apiUrl, auth, service]);

  function handleDeleteConfirm(): void {
    setDeleteConfirm(true);
  }

  function handleDeleteConfirmFinished(): void {
    setDeleteConfirm(false);
  }

  useEffect(() => {
    if (auth) {
      if (!service) handleGetService();
    }
  }, [auth, service, handleGetService]);

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
      title={service ? service.name : "Edit"}
      url="https://ip.timmo.dev"
      user={user}
    >
      {!service ? (
        <Loading text="Loading Data.." />
      ) : (
        <Container className={classes.main} component="article" maxWidth="xl">
          <ServiceEditView
            actions={
              <Fragment>
                <div className={classes.flex} />
                <div className={classes.flex} />
                <div className={classes.flex} />
                <div className={classes.flex} />
                <Button
                  className={classes.buttonWithIcon}
                  color="primary"
                  size="medium"
                  variant="contained"
                  onClick={handleTriggerService}
                >
                  <PlayIcon className={classes.iconOnButton} fontSize="small" />
                  Trigger
                </Button>
                <div className={classes.flex} />
                <Button
                  className={classes.buttonWithIcon}
                  color="inherit"
                  size="medium"
                  style={{ backgroundColor: red[800] }}
                  variant="contained"
                  onClick={handleDeleteConfirm}
                >
                  <DeleteIcon
                    className={classes.iconOnButton}
                    fontSize="small"
                  />
                  Delete
                </Button>
                <Link href="/services">
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
            service={service}
            handleSave={handleUpdateService}
          />
          {deleteConfirm ? (
            <ConfirmDialog
              text={`Are you sure you want to delete service '${service.name}'?`}
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

ServiceEdit.getInitialProps = async ({ query }) => {
  const { id } = query;
  return { id };
};

export default ServiceEdit;
