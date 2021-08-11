import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import moment from "moment";
import { Button, Card, Container, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/EditTwoTone";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSortDirection,
  GridSortModel,
  GridValueFormatterParams,
} from "@material-ui/data-grid";

import { getServices } from "../../lib/data/services";
import Action from "../../types/Action";
import ApiAuthorization from "../../types/ApiAuthorization";
import Layout from "../../components/Layout";
import Message from "../../types/Message";
import Service from "../../types/Service";
import User from "../../types/User";
import useStyles from "../../assets/jss/components/layout";

function Services(): ReactElement {
  const [auth, setAuth] = useState<ApiAuthorization>();
  const [services, setServices] = useState<Service[]>();
  const [message, setMessage] = useState<Message>();
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

  useEffect(() => {
    if (auth) if (!services) handleGetServices();
  }, [auth, services, handleGetServices]);

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
        id: "dbId",
        field: "dbId",
        headerName: "ID",
        type: "string",
        width: 300,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        width: 420,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        width: 720,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "string",
        valueFormatter: (params: GridValueFormatterParams) =>
          (params.value as Action[]).length || "0",
        width: 160,
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
            href={`/services/edit?id=${
              params.getValue("dbId", "dbId") as string
            }`}
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
      services
        ? services.map(
            (
              { id, name, description, actions, updatedOn }: Service,
              index: number
            ) => ({
              id: index,
              dbId: id,
              name,
              description,
              actions,
              updatedOn,
            })
          )
        : [],
    [services, services]
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
      title="Services"
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
          <Link href="/services/new">
            <Button
              className={classes.buttonWithIcon}
              color="primary"
              size="medium"
              variant="contained"
            >
              <AddIcon className={classes.iconOnButton} />
              Add Service
            </Button>
          </Link>
        </Grid>
        <Card style={{ height: 1020 }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                columns={columns}
                disableSelectionOnClick
                pagination
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

export default Services;
