import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import YAML from "yaml";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

import { getConfig, updateConfig } from "../../lib/data/config";
import ApiAuthorization from "../../types/ApiAuthorization";
import Config from "../../types/Config";
import Layout from "../../components/Layout";
import Loading from "../../components/Shared/Loading";
import Message from "../../types/Message";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function ServerConfig(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [config, setConfig] = useState<Config>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.BACKEND_PORT || 5684
      }`,
    []
  );

  async function handleGetConfig(): Promise<void> {
    try {
      setConfig(await getConfig({ apiUrl, auth }));
    } catch (e) {
      setMessage({
        severity: "error",
        text: JSON.stringify(e.message),
      });
    }
  }

  const handleUpdateConfig = useCallback(async (): Promise<void> => {
    try {
      await updateConfig({ apiUrl, auth }, config);
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }, [apiUrl, auth, config]);

  function handleConfigChange(newValue: string): void {
    try {
      const newConfig = YAML.parse(newValue);
      setConfig(newConfig);
    } catch (e) {}
  }

  useEffect(() => {
    if (auth && !config) handleGetConfig();
  }, [auth, config, handleGetConfig]);

  const configText = useMemo(() => YAML.stringify(config), [config]);

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
      title="Configutation"
      url="https://ip.timmo.dev"
      user={user}
    >
      {!config ? (
        <Loading text="Loading Data.." />
      ) : (
        <Container className={classes.main} component="article" maxWidth="xl">
          <Card>
            <CardContent>
              <Typography component="h5" variant="h5" gutterBottom>
                Config
              </Typography>
              <Divider light />
              <MonacoEditor
                height="520px"
                width="100%"
                language="yaml"
                theme="vs-dark"
                defaultValue={configText}
                onChange={handleConfigChange}
              />
            </CardContent>
            <CardActions className={classes.actions}>
              <div className={classes.flex} />
              <Button
                className={classes.buttonWithIcon}
                // disabled={!validationSuccess}
                color="primary"
                size="medium"
                variant="contained"
                onClick={handleUpdateConfig}
              >
                <SaveIcon className={classes.iconOnButton} fontSize="small" />
                Save
              </Button>
              <div className={classes.flex} />
            </CardActions>
          </Card>
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

export default ServerConfig;
