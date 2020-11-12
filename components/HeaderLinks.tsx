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

import useStyles from "../assets/jss/components/headerLinks";

interface HeaderLinksProps {}

function HeaderLinks(_props: HeaderLinksProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href="/">
          <Button variant="text" className={classes.navLink}>
            <Icon
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
              path={mdiCogOutline}
              color={theme.palette.text.primary}
              size={1}
            />
            <span className={classes.listItemText}>Configuration</span>
          </Button>
        </Link>
      </ListItem>
    </List>
  );
}

export default HeaderLinks;
