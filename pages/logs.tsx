import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { Container, Grid } from "@material-ui/core";

import ApiAuthorization from "../types/ApiAuthorization";
import Layout from "../components/Layout";
import useStyles from "../assets/jss/components/layout";

interface LogsProps {}

function Logs(props: LogsProps): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  const handleAuthorized = useCallback(
    (auth: ApiAuthorization): void => setAuth(auth),
    []
  );

  const classes = useStyles();

  return (
    <Layout
      {...props}
      apiUrl={apiUrl}
      auth={auth}
      classes={classes}
      handleAuthorized={handleAuthorized}
      title="Logs"
      url="https://upaas.timmo.dev"
      description="TODO">
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid container direction="row"></Grid>
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

export default Logs;
