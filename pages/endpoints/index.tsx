import React, { ReactElement, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { GetStaticProps } from "next";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/EditTwoTone";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
        width: 250,
      },
      {
        field: "endpoint",
        headerName: "Endpoint",
        type: "string",
        width: 190,
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
        width: 220,
      },
      {
        field: "resultOnly",
        headerName: "Result Only?",
        type: "string",
        width: 160,
      },
      {
        field: "logLevel",
        headerName: "Log Level",
        type: "string",
        width: 140,
      },
      {
        field: "supportedMethods",
        headerName: "Supported Methods",
        type: "string",
        width: 205,
      },
      {
        field: "published",
        headerName: "Published?",
        type: "string",
        width: 150,
      },
      {
        field: "updatedOn",
        headerName: "Last Updated",
        type: "dateTime",
        valueFormatter: (params: GridValueFormatterParams) =>
          moment(params.value as string)
            .locale(window.navigator.language)
            .format("L HH:mm"),
        width: 165,
      },
      {
        disableSorting: true,
        field: "",
        renderCell: (params: GridValueFormatterParams) => {
          const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
          );
          const open = Boolean(anchorEl);

          const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <>
              <IconButton
                className={classes.buttonWithIcon}
                size="small"
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 220,
                    width: "20ch",
                  },
                }}
              >
                <Link
                  href={`/endpoints/edit?id=${
                    params.getValue(0, "dbId") as string
                  }`}
                >
                  <MenuItem onClick={handleClose}>
                    <EditIcon
                      className={classes.iconOnButton}
                      fontSize="small"
                    />
                    Edit
                  </MenuItem>
                </Link>
              </Menu>
            </>
          );
        },
        width: 70,
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
        <Card style={{ height: 940 }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                className={classes.dataGrid}
                columns={columns}
                pagination
                rows={rows}
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
