import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Button, Card, Container, Grid } from "@material-ui/core";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSortDirection,
  GridSortModel,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { GetStaticProps } from "next";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/EditTwoTone";
import Link from "next/link";
import moment from "moment";

import { getEndpoints } from "../../lib/data/endpoints";
import { getServices } from "../../lib/data/services";
import ApiAuthorization from "../../types/ApiAuthorization";
import Endpoint from "../../types/Endpoint";
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import Service from "../../types/Service";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function Endpoints(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [services, setServices] = useState<Service[]>();
  const [endpoints, setEndpoints] = useState<Endpoint[]>();
  const [message, setMessage] = useState<Message>();
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
      if (!services) handleGetServices();
    }
  }, [auth, endpoints, handleGetEndpoints]);

  const classes = useStyles();

  const sortModel: GridSortModel = useMemo(
    () => [
      {
        field: "name",
        sort: "asc" as GridSortDirection,
      },
    ],
    []
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        id: 0,
        field: "dbId",
        headerName: "ID",
        type: "string",
        width: 300,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        width: 320,
      },
      {
        field: "endpoint",
        headerName: "Endpoint",
        type: "string",
        width: 160,
      },
      {
        field: "service",
        headerName: "Service",
        type: "string",
        valueFormatter: (params: GridValueFormatterParams) =>
          services
            ? services.find((s: Service) => s.id === (params.value as string))
                .name
            : params.value,
        width: 280,
      },
      {
        field: "resultOnly",
        headerName: "Result Only?",
        type: "string",
        width: 115,
      },
      {
        field: "logLevel",
        headerName: "Log Level",
        type: "string",
        width: 120,
      },
      {
        field: "supportedMethods",
        headerName: "Supported Methods",
        type: "string",
        width: 180,
      },
      {
        field: "published",
        headerName: "Published?",
        type: "string",
        width: 105,
      },
      {
        field: "updatedOn",
        headerName: "Last Updated",
        type: "dateTime",
        valueFormatter: (params: GridValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 145,
      },
      {
        disableSorting: true,
        field: "",
        renderCell: (params: GridValueFormatterParams) => (
          <Link
            href={`/endpoints/edit?id=${params.getValue(0, "dbId") as string}`}
          >
            <Button
              className={classes.buttonWithIcon}
              color="primary"
              size="small"
              variant="text"
            >
              <EditIcon className={classes.iconOnButton} fontSize="small" />
              Edit
            </Button>
          </Link>
        ),
        width: 100,
      },
    ],
    []
  );

  const rows: GridRowsProp = useMemo(
    () =>
      endpoints
        ? endpoints.map(
            (
              {
                id,
                name,
                endpoint,
                service,
                resultOnly,
                logLevel,
                supportedMethods,
                published,
                updatedOn,
              }: Endpoint,
              index: number
            ) => ({
              id: index,
              dbId: id,
              name,
              endpoint,
              service,
              resultOnly,
              logLevel,
              supportedMethods,
              published,
              updatedOn,
            })
          )
        : [],
    [endpoints, services]
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
      title="Endpoints"
      url="https://ip.timmo.dev"
      user={user}
    >
      <Container className={classes.main} component="article" maxWidth="xl">
        <Grid
          className={classes.header}
          container
          direction="row"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Link href="/endpoints/new">
            <Button
              className={classes.buttonWithIcon}
              color="primary"
              size="medium"
              variant="contained"
            >
              <AddIcon className={classes.iconOnButton} />
              Add Endpoint
            </Button>
          </Link>
        </Grid>
        <Card style={{ height: 1020 }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                columns={columns}
                pagination
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

export default Endpoints;
