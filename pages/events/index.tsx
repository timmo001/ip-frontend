import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import moment from "moment";
import { Button, Card, Container } from "@material-ui/core";
import LogIcon from "@material-ui/icons/TextFieldsTwoTone";
import {
  ColDef,
  DataGrid,
  RowsProp,
  SortDirection,
  SortModel,
  ValueFormatterParams,
} from "@material-ui/data-grid";

import { getEvents } from "../../lib/data/events";
import ApiAuthorization from "../../types/ApiAuthorization";
import Layout from "../../components/Layout";
import Event from "../../types/Event";
import Message from "../../types/Message";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";
import Link from "next/link";
import CustomPagination from "../../components/DataGrid/CustomPagination";

function Events(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [events, setEvents] = useState<Event[]>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  async function handleGetEvents(): Promise<void> {
    try {
      setEvents(await getEvents({ apiUrl, auth }));
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  useEffect(() => {
    if (auth && !events) handleGetEvents();
  }, [auth, events]);

  const classes = useStyles();

  const sortModel: SortModel = useMemo(
    () => [
      {
        field: "updatedOn",
        sort: "desc" as SortDirection,
      },
    ],
    []
  );

  const columns: ColDef[] = useMemo(
    () => [
      {
        field: "dbId",
        headerName: "ID",
        type: "string",
        width: 310,
      },
      {
        field: "service",
        headerName: "Service",
        type: "string",
        width: 300,
      },
      {
        field: "endpoint",
        headerName: "Endpoint",
        type: "string",
        width: 300,
      },
      {
        field: "status",
        headerName: "Status",
        type: "string",
        width: 180,
      },
      {
        field: "message",
        headerName: "Message",
        type: "message",
        width: 320,
      },
      {
        field: "updatedOn",
        headerName: "Last Updated",
        type: "dateTime",
        valueFormatter: (params: ValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 145,
      },
      {
        field: "startedOn",
        headerName: "Started On",
        type: "dateTime",
        valueFormatter: (params: ValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 145,
      },
      {
        field: "completedOn",
        headerName: "Completed On",
        type: "dateTime",
        valueFormatter: (params: ValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 145,
      },
    ],
    [events]
  );

  const rows: RowsProp = useMemo(
    () =>
      events
        ? events.map(
            (
              {
                id,
                service,
                endpoint,
                status,
                createdOn,
                updatedOn,
                completedOn,
                message,
              }: Event,
              index: number
            ) => ({
              id: index,
              dbId: id,
              service,
              endpoint,
              status,
              createdOn,
              updatedOn,
              completedOn,
              message,
            })
          )
        : [],
    [events]
  );

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
      title="Events"
      url="https://upaas.timmo.dev"
      user={user}>
      <Container className={classes.main} component="article" maxWidth="xl">
        <Card style={{ height: 720 }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                columns={columns}
                components={{
                  pagination: CustomPagination,
                }}
                disableSelectionOnClick
                rows={rows}
                sortModel={sortModel}
              />
            </div>
          </div>
        </Card>
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

export default Events;
