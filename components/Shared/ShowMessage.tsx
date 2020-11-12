import React, { ReactElement, useState } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { Color } from "@material-ui/lab/Alert";

interface ShowMessageProps {
  severity: Color;
  duration?: number;
  text: string;
  handleResetMessage: () => void;
}

export default function ShowMessage(props: ShowMessageProps): ReactElement {
  const [open, setOpen] = useState<boolean>(true);

  function handleClose() {
    setOpen(false);
    props.handleResetMessage();
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={props.duration ? props.duration : 6000}
      onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" severity={props.severity}>
        {props.text}
      </MuiAlert>
    </Snackbar>
  );
}
