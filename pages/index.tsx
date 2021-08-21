import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import moment from "moment";
import { Container, Grid, Typography, useTheme } from "@material-ui/core";
import Icon from "@mdi/react";
import {
  mdiAlertBoxOutline,
  mdiAlertOutline,
  mdiBugOutline,
  mdiCheckBoxOutline,
  mdiCloudOutline,
  mdiExclamation,
  mdiFormatListNumbered,
  mdiInformationOutline,
  mdiRocketLaunch,
  mdiScriptTextOutline,
  mdiTextBoxOutline,
} from "@mdi/js";

import { getEndpoints } from "../lib/data/endpoints";
import { getEvents } from "../lib/data/events";
import { getServices } from "../lib/data/services";
import ApiAuthorization from "../types/ApiAuthorization";
import CardStat from "../components/Stats/CardStat";
import Endpoint from "../types/Endpoint";
import Event from "../types/Event";
import Layout from "../components/Layout";
import Loading from "../components/Shared/Loading";
import Log from "../types/Log";
import Message from "../types/Message";
import Service from "../types/Service";
import User from "../types/User";
import useStyles from "../assets/jss/components/layout";
import { getLogs } from "../lib/data/logs";

function Dashboard(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [endpoints, setEndpoints] = useState<Endpoint[]>();
  const [events, setEvents] = useState<Event[]>();
  const [logs, setLogs] = useState<Log[]>();
  const [message, setMessage] = useState<Message>();
  const [services, setServices] = useState<Service[]>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.BACKEND_PORT || 5684
      }`,
    []
  );

  async function handleGetEndpoints(): Promise<void> {
    try {
      setEndpoints(await getEndpoints({ apiUrl, auth }));
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  async function handleGetEvents(): Promise<void> {
    try {
      const newEvents: Event[] = await getEvents({ apiUrl, auth });
      setEvents(
        newEvents.sort((a: Event, b: Event) =>
          moment(a.updatedOn) > moment(b.updatedOn) ? 1 : -1
        )
      );
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  async function handleGetLogs(): Promise<void> {
    try {
      const newLogs: Log[] = await getLogs({ apiUrl, auth });
      setLogs(
        newLogs.sort((a: Log, b: Log) =>
          moment(a.createdOn) > moment(b.createdOn) ? 1 : -1
        )
      );
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

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

  useEffect(() => {
    if (auth) {
      if (!endpoints) handleGetEndpoints();
      if (!events) handleGetEvents();
      if (!logs) handleGetLogs();
      if (!services) handleGetServices();
    }
  }, [
    auth,
    endpoints,
    events,
    logs,
    services,
    handleGetEndpoints,
    handleGetEvents,
    handleGetLogs,
    handleGetServices,
  ]);

  const latestEvent: Event = useMemo(
    () => (events ? events[0] : undefined),
    [events]
  );
  const latestEventService: Service = useMemo(
    () =>
      services && events
        ? services.find((s: Service) => s.id === latestEvent?.service)
        : undefined,
    [services]
  );
  const completedEvents: Event[] = useMemo(
    () =>
      events
        ? events.filter((e: Event) => e.status === "Completed")
        : undefined,
    [events]
  );
  const runningEvents: Event[] = useMemo(
    () =>
      events ? events.filter((e: Event) => e.status === "Running") : undefined,
    [events]
  );
  const erroredEvents: Event[] = useMemo(
    () =>
      events ? events.filter((e: Event) => e.status === "Error") : undefined,
    [events]
  );
  const debugLogs: Log[] = useMemo(
    () => (logs ? logs.filter((l: Log) => l.level === "debug") : undefined),
    [logs]
  );
  const infoLogs: Log[] = useMemo(
    () => (logs ? logs.filter((l: Log) => l.level === "info") : undefined),
    [logs]
  );
  const warnLogs: Log[] = useMemo(
    () => (logs ? logs.filter((l: Log) => l.level === "warn") : undefined),
    [logs]
  );
  const errorLogs: Log[] = useMemo(
    () => (logs ? logs.filter((l: Log) => l.level === "error") : undefined),
    [logs]
  );

  const classes = useStyles();
  const theme = useTheme();

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
      title="Home"
      url="https://ip.timmo.dev"
      user={user}
    >
      {!endpoints || !events || !logs || !services ? (
        <Loading text="Loading Data.." />
      ) : (
        <Container className={classes.main} component="article" maxWidth="xl">
          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={6} xl={5}>
              <CardStat
                icon={mdiExclamation}
                linkText="Events"
                linkUrl="/events"
                stats={
                  <Grid
                    className={classes.flexNoWrap}
                    item
                    xs
                    container
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.success.main}
                        path={mdiCheckBoxOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Complete: {completedEvents.length}
                      </Typography>
                    </Grid>
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.info.main}
                        path={mdiRocketLaunch}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Running: {runningEvents.length}
                      </Typography>
                    </Grid>
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.error.main}
                        path={mdiAlertOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Error: {erroredEvents.length}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                subtitle1={
                  <span>
                    <b>
                      <i>Latest:</i>
                    </b>{" "}
                    {latestEventService?.name}
                  </span>
                }
                subtitle2={
                  <span>
                    <b>
                      <i>Status:</i>
                    </b>{" "}
                    {latestEvent?.status}
                  </span>
                }
                title="Events"
              />
            </Grid>
            <Grid item xs={6} xl={5}>
              <CardStat
                icon={mdiTextBoxOutline}
                linkText="Logs"
                linkUrl="/logs"
                stats={
                  <Grid
                    className={classes.flexNoWrap}
                    item
                    xs
                    container
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.primary.main}
                        path={mdiBugOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Debug: {debugLogs.length}
                      </Typography>
                    </Grid>
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.info.main}
                        path={mdiInformationOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Info: {infoLogs.length}
                      </Typography>
                    </Grid>
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.warning.main}
                        path={mdiAlertBoxOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Warning: {warnLogs.length}
                      </Typography>
                    </Grid>
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.error.main}
                        path={mdiAlertOutline}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Error: {errorLogs.length}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                subtitle1={
                  <span>
                    <b>
                      <i>Latest:</i>
                    </b>{" "}
                    {latestEventService?.name}
                  </span>
                }
                subtitle2={
                  <span>
                    <b>
                      <i>Status:</i>
                    </b>{" "}
                    {latestEvent?.status}
                  </span>
                }
                title="Logs"
              />
            </Grid>
            <Grid item xs={6} xl={5}>
              <CardStat
                icon={mdiScriptTextOutline}
                linkText="Services"
                linkUrl="/services"
                stats={
                  <Grid
                    className={classes.flexNoWrap}
                    item
                    xs
                    container
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.secondary.main}
                        path={mdiFormatListNumbered}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Total: {services.length}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                title="Services"
              />
            </Grid>
            <Grid item xs={6} xl={5}>
              <CardStat
                icon={mdiCloudOutline}
                linkText="Endpoints"
                linkUrl="/endpoints"
                stats={
                  <Grid
                    className={classes.flexNoWrap}
                    item
                    xs
                    container
                    direction="row"
                    justifyContent="space-around"
                  >
                    <Grid className={classes.item} item>
                      <Icon
                        color={theme.palette.secondary.main}
                        path={mdiFormatListNumbered}
                        size={1}
                      />
                      <Typography
                        className={classes.text}
                        component="span"
                        variant="subtitle1"
                      >
                        Total: {endpoints.length}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                title="Endpoints"
              />
            </Grid>
          </Grid>
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

export default Dashboard;
