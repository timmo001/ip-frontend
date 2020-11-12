import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  mdiAlertBoxOutline,
  mdiAlertOutline,
  mdiInformationOutline,
  mdiScriptTextOutline,
} from "@mdi/js";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import Icon from "@mdi/react";

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: "flex",
    margin: theme.spacing(0.5),
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  text: {
    marginLeft: theme.spacing(0.5),
    fontWeight: "normal",
  },
}));

export default function StatLastEvent(): ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={8} md={5} xl={4}>
      <Card square>
        <CardContent>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid className={classes.item} item>
              <Icon
                color={theme.palette.text.secondary}
                path={mdiScriptTextOutline}
                size={6}
              />
            </Grid>
            <Grid className={classes.item} item xs container direction="column">
              <Grid item>
                <Typography component="h3" variant="h3">
                  Last Event
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.text}
                  component="h6"
                  variant="h6">
                  Something
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  className={classes.text}
                  component="span"
                  variant="subtitle1">
                  Status: Complete
                </Typography>
              </Grid>
              <Grid item xs container direction="row" justify="space-around">
                <Grid className={classes.item} item>
                  <Icon
                    color={theme.palette.info.main}
                    path={mdiInformationOutline}
                    size={1}
                  />
                  <Typography
                    className={classes.text}
                    component="span"
                    variant="subtitle1">
                    Info: 2
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
                    variant="subtitle1">
                    Warning: 4
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
                    variant="subtitle1">
                    Error: 1
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button color="primary" variant="text">
            View Logs
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
