import React, { ReactElement, useState, useMemo, Fragment } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  DialogContent,
  Grid,
  TextField,
  Theme,
  Typography,
  DialogActions,
  Button,
  DialogTitle,
} from "@material-ui/core";
import MonacoEditor from "react-monaco-editor";
import YAML from "yaml";

import { ActionViewProps } from "./ActionView";
import Action from "../../../types/Action";
import ServiceDefinition from "../../../types/ServiceDefinition";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  textField: {
    maxWidth: "22.5%",
    margin: theme.spacing(1, 1, 2),
  },
  container: {
    padding: 0,
    margin: 0,
    overflow: "hidden",
  },
  content: {
    padding: theme.spacing(0, 2, 1),
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

interface ActionEditProps extends ActionViewProps {
  handleFinishedEditingAction: () => void;
}

export default function ActionEdit(props: ActionEditProps): ReactElement {
  const { handleFinishedEditingAction, handleUpdateAction } = props;
  const [action, setAction] = useState<Action>(props.action);
  const parameters = useMemo(() => YAML.stringify(props.action.parameters), [
    props.action.parameters,
  ]);

  const handleTextFieldChange = (prop: keyof Action) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAction({ ...action, [prop]: event.target.value });
  };

  const handleServiceDefinitionChange = (prop: keyof ServiceDefinition) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAction({
      ...action,
      service: { ...action.service, [prop]: event.target.value },
    });
  };

  function handleParametersChange(newValue: string): void {
    try {
      const parameters = YAML.parse(newValue);
      setAction({ ...action, parameters });
    } catch (e) {}
  }

  function handleSave(): void {
    if (!validationSuccess) return;
    if (process.env.NODE_ENV === "development")
      console.log("ActionEdit - Save:", action);

    handleUpdateAction(action);

    handleFinishedEditingAction();
  }

  const validationSuccess: boolean = useMemo(() => {
    if (!action.description) return false;
    if (!action.service.plugin) return false;
    if (!action.service.service) return false;
    return true;
  }, [action.description, action.service.plugin, action.service.service]);

  const classes = useStyles();
  return (
    <Fragment>
      <DialogTitle id="dialog-title">Action: {action.description}</DialogTitle>
      <DialogContent className={classes.container}>
        <section className={classes.content}>
          <Grid
            component="form"
            container
            direction="row"
            alignItems="center"
            justify="center">
            <TextField
              className={classes.textField}
              fullWidth
              label="Description"
              margin="dense"
              required
              value={action.description}
              onChange={handleTextFieldChange("description")}
            />
            <TextField
              className={classes.textField}
              autoComplete="off"
              fullWidth
              label="Requires"
              margin="dense"
              value={action.requires}
              onChange={handleTextFieldChange("requires")}
            />
            <TextField
              className={classes.textField}
              autoComplete="off"
              fullWidth
              label="Plugin"
              margin="dense"
              required
              value={action.service.plugin}
              onChange={handleServiceDefinitionChange("plugin")}
            />
            <TextField
              className={classes.textField}
              autoComplete="off"
              fullWidth
              label="Service"
              margin="dense"
              required
              value={action.service.service}
              onChange={handleServiceDefinitionChange("service")}
            />
          </Grid>
          <Typography component="h6" variant="h6">
            Parameters
          </Typography>
        </section>
        <MonacoEditor
          height="520px"
          width="100%"
          language="yaml"
          theme="vs-dark"
          defaultValue={parameters}
          onChange={handleParametersChange}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          size="medium"
          color="primary"
          variant="text"
          onClick={handleFinishedEditingAction}>
          Cancel
        </Button>
        <Button
          disabled={!validationSuccess}
          size="medium"
          color="primary"
          variant="contained"
          onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Fragment>
  );
}
