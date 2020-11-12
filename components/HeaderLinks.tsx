import React, { ReactElement } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@mdi/react";
import {
  mdiCogOutline,
  mdiScriptTextOutline,
  mdiTextBoxOutline,
  mdiViewDashboardOutline,
} from "@mdi/js";

import { Avatar, IconButton } from "@material-ui/core";
import User from "../types/User";
import useStyles from "../assets/jss/components/headerLinks";

interface HeaderLinksProps {
  user: User;
}

function HeaderLinks(props: HeaderLinksProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href="/">
          <Button variant="text" className={classes.navLink}>
            <Icon
              className={classes.icon}
              path={mdiViewDashboardOutline}
              color={theme.palette.text.primary}
              size={1}
            />
            <span className={classes.listItemText}>Dashboard</span>
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/services">
          <Button variant="text" className={classes.navLink}>
            <Icon
              className={classes.icon}
              path={mdiScriptTextOutline}
              color={theme.palette.text.primary}
              size={1}
            />
            <span className={classes.listItemText}>Services</span>
          </Button>
        </Link>
      </ListItem>
      <ListItem className={clsx(classes.listItem, classes.divider)} />
      <ListItem className={classes.listItem}>
        <Link href="/logs">
          <Button variant="text" className={classes.navLink}>
            <Icon
              className={classes.icon}
              path={mdiTextBoxOutline}
              color={theme.palette.text.primary}
              size={1}
            />
            <span className={classes.listItemText}>Logs</span>
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/config">
          <Button variant="text" className={classes.navLink}>
            <Icon
              className={classes.icon}
              path={mdiCogOutline}
              color={theme.palette.text.primary}
              size={1}
            />
            <span className={classes.listItemText}>Configuration</span>
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <IconButton>
          <Avatar className={classes.avatar} variant="circle">
            {props.user
              ? props.user.firstName.charAt(0).toUpperCase() +
                props.user.lastName?.charAt(0).toUpperCase()
              : ""}
          </Avatar>
        </IconButton>
      </ListItem>
    </List>
  );
}

export default HeaderLinks;
