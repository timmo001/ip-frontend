import React, { ReactElement, useState, useMemo, Fragment } from "react";
import dynamic from "next/dynamic";
import { makeStyles } from "@material-ui/styles";
import {
  DialogContent,
  Grid,
  TextField,
  Theme,
  DialogActions,
  Button,
  DialogTitle,
} from "@material-ui/core";
import YAML from "yaml";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

import Service from "../../types/Service";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  textField: {
    maxWidth: "48%",
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

interface ServiceEditProps {
  service: Service;
  handleFinishedEditingService: () => void;
  handleUpdateService: (service: Service) => Promise<void>;
}

export default function ServiceEdit(props: ServiceEditProps): ReactElement {
  const { handleFinishedEditingService, handleUpdateService } = props;
  const [service, setService] = useState<Service>(props.service);
  const config = useMemo(() => YAML.stringify(service.config), [
    service.config,
  ]);

  const handleTextFieldChange = (prop: keyof Service) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setService({ ...service, [prop]: event.target.value });
  };

  function handleConfigChange(newValue: string): void {
    try {
      const config = YAML.parse(newValue);
      setService({ ...service, config });
    } catch (e) {}
  }

  function handleSave(): void {
    if (!validationSuccess) return;
    if (process.env.NODE_ENV === "development")
      console.log("ServiceEdit - Save:", service);

    handleUpdateService(service);

    handleFinishedEditingService();
  }

  const validationSuccess: boolean = useMemo(() => {
    if (!service.name) return false;
    return true;
  }, [service.name]);

  const classes = useStyles();
  return (
    <Fragment>
      <DialogTitle id="dialog-title">Service: {service.name}</DialogTitle>
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
              label="Name"
              margin="dense"
              required
              value={service.name}
              onChange={handleTextFieldChange("name")}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Description"
              margin="dense"
              value={service.description}
              onChange={handleTextFieldChange("description")}
            />
          </Grid>
        </section>
        <MonacoEditor
          height="520px"
          width="100%"
          language="yaml"
          theme="vs-dark"
          defaultValue={config}
          onChange={handleConfigChange}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          size="medium"
          color="primary"
          variant="text"
          onClick={handleFinishedEditingService}>
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
