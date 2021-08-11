import React, { ReactElement } from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/styles";
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

interface CardStatProps {
  icon: string;
  linkText: string;
  linkUrl: string;
  stats?: ReactElement | ReactElement[];
  subtitle1?: string | ReactElement;
  subtitle2?: string | ReactElement;
  title: string | ReactElement;
}

export default function CardStat(props: CardStatProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Card square>
      <CardContent>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid className={classes.item} item>
            <Icon
              color={theme.palette.text.secondary}
              path={props.icon}
              size={6}
            />
          </Grid>
          <Grid className={classes.item} item xs container direction="column">
            <Grid item>
              <Typography component="h3" variant="h3">
                {props.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.text} component="h6" variant="h6">
                {props.subtitle1}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                className={classes.text}
                component="span"
                variant="subtitle1"
              >
                {props.subtitle2}
              </Typography>
            </Grid>
            {props.stats}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Link href={props.linkUrl}>
          <Button color="primary" variant="text">
            {props.linkText}
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
