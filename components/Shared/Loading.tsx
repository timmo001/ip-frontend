import React, { ReactElement } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, CircularProgress, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    height: "100%",
    width: "100%",
    background: theme.palette.background.default,
  },
  text: {
    marginTop: theme.spacing(1),
    userSelect: "none",
  },
}));

interface LoadingProps {
  text: string;
}

function Loading(props: LoadingProps): ReactElement {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <CircularProgress size={42} />
      <Typography
        className={classes.text}
        color="textPrimary"
        component="h3"
        variant="subtitle1"
      >
        {props.text}
      </Typography>
    </Grid>
  );
}

export default Loading;
