import React, { ReactElement } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

interface ConfirmDialogProps {
  text?: string;
  handleConfirm: () => void;
  handleFinished: () => void;
}

function ConfirmDialog(props: ConfirmDialogProps): ReactElement {
  function handleClose(): void {
    props.handleFinished();
  }

  function handleConfirm(): void {
    handleClose();
    props.handleConfirm();
  }

  return (
    <Dialog open>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.text ? props.text : "Are you sure you want to do this?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={handleConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
