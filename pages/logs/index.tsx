import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import moment from "moment";
import { Button, Card, Container, Grid } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/RefreshTwoTone";
import {
  ColDef,
  DataGrid,
  RowsProp,
  SortDirection,
  SortModel,
  ValueFormatterParams,
} from "@material-ui/data-grid";

import { getLogs } from "../../lib/data/logs";
import ApiAuthorization from "../../types/ApiAuthorization";
import Layout from "../../components/Layout";
import Log from "../../types/Log";
import Message from "../../types/Message";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";
import CustomPagination from "../../components/DataGrid/CustomPagination";

function Logs(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [logs, setLogs] = useState<Log[]>();
  const [message, setMessage] = useState<Message>();
  const [user, setUser] = useState<User>();

  const apiUrl: string = useMemo(
    () =>
      `${window.location.protocol}//${window.location.hostname}:${
        process.env.NODE_ENV === "production" ? window.location.port : 5684
      }`,
    []
  );

  async function handleGetLogs(): Promise<void> {
    try {
      setLogs(await getLogs({ apiUrl, auth }));
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message,
      });
    }
  }

  useEffect(() => {
    if (auth && !logs) handleGetLogs();
  }, [auth, logs]);

  const classes = useStyles();

  const sortModel: SortModel = useMemo(
    () => [
      {
        field: "createdOn",
        sort: "desc" as SortDirection,
      },
    ],
    []
  );

  const columns: ColDef[] = useMemo(
    () => [
      {
        field: "createdOn",
        headerName: "Created On",
        type: "dateTime",
        valueFormatter: (params: ValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 145,
      },
      {
        field: "text",
        headerName: "Text",
        type: "string",
        width: 1340,
      },
      {
        field: "level",
        headerName: "Level",
        type: "string",
        width: 120,
      },
      {
        field: "type",
        headerName: "Type",
        type: "string",
        width: 240,
      },
    ],
    [logs]
  );

  const rows: RowsProp = useMemo(
    () =>
      logs
        ? logs.map(({ text, level, type, createdOn }: Log, index: number) => ({
            id: index,
            createdOn,
            text,
            level,
            type,
          }))
        : [],
    [logs]
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
      title="Logs"
      url="https://upaas.timmo.dev"
      user={user}
    >
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid
          className={classes.header}
          container
          direction="row"
          alignItems="flex-start"
          justify="center"
        >
          <Button
            className={classes.buttonWithIcon}
            color="primary"
            size="medium"
            variant="contained"
            onClick={handleGetLogs}
          >
            <RefreshIcon className={classes.iconOnButton} />
            Refresh
          </Button>
        </Grid>
        <Card style={{ height: 1020 }}>
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

export default Logs;
