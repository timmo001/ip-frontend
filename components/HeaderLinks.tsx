import React, { Fragment, ReactElement, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Icon from "@mdi/react";
import {
  mdiCloudOutline,
  mdiCogOutline,
  mdiExclamation,
  mdiLogoutVariant,
  mdiScriptTextOutline,
  mdiTextBoxOutline,
  mdiViewDashboardOutline,
} from "@mdi/js";

import User from "../types/User";
import useStyles from "../assets/jss/components/headerLinks";

interface HeaderLinksProps {
  handleLogOut: () => void;
  user: User;
}

function HeaderLinks(props: HeaderLinksProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  const theme = useTheme();

  const profileAvatar = (
    <Avatar className={classes.avatar} variant="circle">
      {props.user
        ? props.user.firstName.charAt(0).toUpperCase() +
          props.user.lastName?.charAt(0).toUpperCase()
        : ""}
    </Avatar>
  );

  return (
    <Fragment>
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Link href="/">
            <Button variant="text" className={classes.navLink}>
              <Icon
                className={classes.icon}
                color={theme.palette.text.primary}
                path={mdiViewDashboardOutline}
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
                color={theme.palette.text.primary}
                path={mdiScriptTextOutline}
                size={1}
              />
              <span className={classes.listItemText}>Services</span>
            </Button>
          </Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Link href="/endpoints">
            <Button variant="text" className={classes.navLink}>
              <Icon
                className={classes.icon}
                color={theme.palette.text.primary}
                path={mdiCloudOutline}
                size={1}
              />
              <span className={classes.listItemText}>Endpoints</span>
            </Button>
          </Link>
        </ListItem>
        <ListItem className={clsx(classes.listItem, classes.divider)} />
        <ListItem className={classes.listItem}>
          <Link href="/events">
            <Button variant="text" className={classes.navLink}>
              <Icon
                className={classes.icon}
                color={theme.palette.text.primary}
                path={mdiExclamation}
                size={1}
              />
              <span className={classes.listItemText}>Events</span>
            </Button>
          </Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Link href="/logs">
            <Button variant="text" className={classes.navLink}>
              <Icon
                className={classes.icon}
                color={theme.palette.text.primary}
                path={mdiTextBoxOutline}
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
                color={theme.palette.text.primary}
                path={mdiCogOutline}
                size={1}
              />
              <span className={classes.listItemText}>Configuration</span>
            </Button>
          </Link>
        </ListItem>
        <ListItem className={clsx(classes.listItem, classes.divider)} />
        <ListItem className={classes.listItem}>
          <IconButton
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleClickProfileMenu}
          >
            {profileAvatar}
          </IconButton>
        </ListItem>
      </List>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        getContentAnchorEl={null}
        id="profile-menu"
        keepMounted
        onClose={handleCloseProfileMenu}
        open={Boolean(anchorEl)}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem className={classes.menuProfile}>
          {props.user ? (
            <Fragment>
              <ListItemIcon>{profileAvatar}</ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    {props.user.firstName} {props.user.lastName}
                    <br />
                    <Typography component="span" variant="body2">
                      {props.user.username}
                    </Typography>
                  </span>
                }
              />
            </Fragment>
          ) : (
            ""
          )}
        </MenuItem>
        <Divider light />
        <MenuItem onClick={props.handleLogOut}>
          <ListItemIcon>
            <Icon
              className={classes.icon}
              color={theme.palette.text.primary}
              path={mdiLogoutVariant}
              size={1}
            />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

export default HeaderLinks;
