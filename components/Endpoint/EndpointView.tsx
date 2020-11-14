import React, { ReactElement, useState, Fragment } from "react";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Button,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
  Dialog,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ConfirmDialog from "../Shared/ConfirmDialog";
import Endpoint from "../../types/Endpoint";
import EndpointEdit from "./EndpointEdit";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: `${theme.spacing(1)}px !important`,
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

const Accordion = withStyles({
  root: {
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
    borderRadius: 4,
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 8px",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

interface EndpointViewProps {
  endpoint: Endpoint;
  handleDeleteEndpoint: () => void;
  handleUpdateEndpoint: (endpoint: Endpoint) => Promise<void>;
}

export default function EndpointView(props: EndpointViewProps): ReactElement {
  const { endpoint, handleDeleteEndpoint, handleUpdateEndpoint } = props;
  const [editEndpoint, setEditEndpoint] = useState<boolean>(false);
  const [deleteEndpointConfirm, setDeleteEndpointConfirm] = useState<boolean>(
    false
  );

  function handleEditEndpoint(): void {
    setEditEndpoint(true);
  }

  function handleFinishedEditingEndpoint(): void {
    setEditEndpoint(false);
  }

  function handleDeleteEndpointConfirm(): void {
    setDeleteEndpointConfirm(true);
  }

  function handleDeleteEndpointConfirmFinished(): void {
    setDeleteEndpointConfirm(false);
  }

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <Fragment>
      <Accordion
        className={classes.root}
        TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${endpoint.id}-panel-content`}
          id={`${endpoint.id}-panel-header`}>
          <Typography component="h4" variant="h4">
            {endpoint.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="row">
            <Grid item container direction="row" justify="space-evenly">
              <Button
                className={classes.button}
                size="medium"
                color="primary"
                variant="contained"
                onClick={handleEditEndpoint}>
                Edit Endpoint
              </Button>
              <Button
                className={classes.button}
                size="large"
                color="primary"
                variant="contained"
                onClick={handleDeleteEndpointConfirm}>
                Delete Endpoint
              </Button>
            </Grid>
            <Typography component="span" variant="body1">
              <b>Endpoint:</b> {endpoint.endpoint}
              <br />
              <b>Service:</b> {endpoint.service}
              <br />
              <b>Log Level:</b> {endpoint.logLevel}
              <br />
              <b>Supported Methods:</b>{" "}
              {endpoint.supportedMethods.split(",").join(", ")}
              <br />
              <br />
              <b>{endpoint.resultOnly ? "Result Only" : "Full Response"}</b>
              <br />
              <b>{endpoint.published ? "Published" : "Draft"}</b>
            </Typography>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {deleteEndpointConfirm ? (
        <ConfirmDialog
          text={`Are you sure you want to delete endpoint '${endpoint.name}'?`}
          handleConfirm={handleDeleteEndpoint}
          handleFinished={handleDeleteEndpointConfirmFinished}
        />
      ) : (
        ""
      )}
      <Dialog
        open={editEndpoint}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="lg"
        aria-labelledby="dialog-title">
        {editEndpoint ? (
          <EndpointEdit
            {...props}
            handleFinishedEditingEndpoint={handleFinishedEditingEndpoint}
          />
        ) : (
          ""
        )}
      </Dialog>
    </Fragment>
  );
}
