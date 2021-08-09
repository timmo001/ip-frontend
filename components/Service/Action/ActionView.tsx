import React, { ReactElement, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Theme,
  Typography,
} from "@material-ui/core";

import Action from "../../../types/Action";
import ActionEdit from "./ActionEdit";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  text: {
    maxWidth: 280,
    margin: theme.spacing(1),
  },
}));

export interface ActionViewProps {
  action: Action;
  key: number;
  handleUpdateAction: (action: Action) => void;
}

export default function ActionView(props: ActionViewProps): ReactElement {
  const { action } = props;

  const [editAction, setEditAction] = useState<boolean>(false);

  function handleShowEditAction() {
    setEditAction(true);
  }

  function handleFinishedEditingAction() {
    setEditAction(false);
  }

  const classes = useStyles();

  return (
    <Fragment>
      <Grid className={classes.root} item xs={12} xl={8}>
        <Card square>
          <CardActionArea onClick={handleShowEditAction}>
            <CardContent>
              <Typography component="h5" variant="h5" gutterBottom>
                {action.description} ({action.id})
              </Typography>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-evenly"
              >
                <Typography
                  className={classes.text}
                  component="span"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Requires: {action.requires || "none"}
                </Typography>
                <Typography
                  className={classes.text}
                  component="span"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Plugin: {action.service.plugin}
                </Typography>
                <Typography
                  className={classes.text}
                  component="span"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Service: {action.service.service}
                </Typography>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      {editAction ? (
        <ActionEdit
          {...props}
          handleFinishedEditingAction={handleFinishedEditingAction}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
}
