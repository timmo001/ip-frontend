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

import Action from "../../types/Action";
import ActionView from "./Action/ActionView";
import ConfirmDialog from "../Shared/ConfirmDialog";
import Service from "../../types/Service";
import ServiceEdit from "./ServiceEdit";

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

interface ServiceViewProps {
  service: Service;
  handleDeleteService: () => void;
  handleTriggerService: () => void;
  handleUpdateService: (service: Service) => Promise<void>;
}

export default function ServiceView(props: ServiceViewProps): ReactElement {
  const {
    service,
    handleDeleteService,
    handleTriggerService,
    handleUpdateService,
  } = props;
  const [editService, setEditService] = useState<boolean>(false);
  const [deleteServiceConfirm, setDeleteServiceConfirm] = useState<boolean>(
    false
  );

  function handleEditService(): void {
    setEditService(true);
  }

  function handleFinishedEditingService(): void {
    setEditService(false);
  }

  function handleDeleteServiceConfirm(): void {
    setDeleteServiceConfirm(true);
  }

  function handleDeleteServiceConfirmFinished(): void {
    setDeleteServiceConfirm(false);
  }

  const handleUpdateAction = (i: number) => (action: Action): void => {
    service.actions[i] = action;
    handleUpdateService(service);
  };

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
          aria-controls={`${service.id}-panel-content`}
          id={`${service.id}-panel-header`}>
          <Typography component="h4" variant="h4">
            {service.name}
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
                onClick={handleTriggerService}>
                Trigger Service
              </Button>
              <Button
                className={classes.button}
                size="medium"
                color="primary"
                variant="contained"
                onClick={handleEditService}>
                Edit Service
              </Button>
              <Button
                className={classes.button}
                size="large"
                color="primary"
                variant="contained"
                onClick={handleDeleteServiceConfirm}>
                Delete Service
              </Button>
            </Grid>
            <Typography component="h5" variant="h5" gutterBottom>
              Actions
            </Typography>
            <Divider light />
            <Grid item container direction="row" justify="space-evenly">
              {service.actions.map((action: Action, index: number) => (
                <ActionView
                  key={index}
                  {...props}
                  action={action}
                  handleUpdateAction={handleUpdateAction(index)}
                />
              ))}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {deleteServiceConfirm ? (
        <ConfirmDialog
          text={`Are you sure you want to delete service '${service.name}'?`}
          handleConfirm={handleDeleteService}
          handleFinished={handleDeleteServiceConfirmFinished}
        />
      ) : (
        ""
      )}
      <Dialog
        open={editService}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="lg"
        aria-labelledby="dialog-title">
        {editService ? (
          <ServiceEdit
            {...props}
            handleFinishedEditingService={handleFinishedEditingService}
          />
        ) : (
          ""
        )}
      </Dialog>
    </Fragment>
  );
}
