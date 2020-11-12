import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { Container, Grid } from "@material-ui/core";

import ApiAuthorization from "../types/ApiAuthorization";
import Layout from "../components/Layout";
import Message from "../types/Message";
import StatLastEvent from "../components/Stats/StatLastEvent";
import User from "../types/User";
import useStyles from "../assets/jss/components/layout";

function Dashboard(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  function handleResetMessage(): void {
    setMessage(undefined);
  }

  const classes = useStyles();

  return (
    <Layout
      apiUrl={apiUrl}
      auth={auth}
      classes={classes}
      description="TODO"
      setAuth={setAuth}
      setMessage={setMessage}
      setUser={setUser}
      title="Home"
      url="https://upaas.timmo.dev">
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid container direction="row">
          <StatLastEvent />
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
