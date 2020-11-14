import React, { ReactElement, useState, useMemo, Fragment } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  DialogContent,
  Grid,
  TextField,
  Theme,
  DialogActions,
  Button,
  DialogTitle,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Input,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";

import Endpoint from "../../types/Endpoint";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
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
  formControl: {
    maxWidth: "48%",
    margin: theme.spacing(1, 1, 2),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const methods = ["DELETE", "GET", "PATCH", "POST", "PUT"];
const logLevels = ["debug", "info", "warn", "error"];

interface EndpointEditProps {
  endpoint: Endpoint;
  handleFinishedEditingEndpoint: () => void;
  handleUpdateEndpoint: (endpoint: Endpoint) => Promise<void>;
}

export default function EndpointEdit(props: EndpointEditProps): ReactElement {
  const { handleFinishedEditingEndpoint, handleUpdateEndpoint } = props;
  const [endpoint, setEndpoint] = useState<Endpoint>(props.endpoint);

  const supportedMethods = useMemo(() => endpoint.supportedMethods.split(","), [
    endpoint.supportedMethods,
  ]);

  const handleTextFieldChange = (prop: keyof Endpoint) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEndpoint({ ...endpoint, [prop]: event.target.value });
  };

  const handleToggleChange = (prop: keyof Endpoint) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEndpoint({ ...endpoint, [prop]: event.target.checked });
  };

  const handleSelectionChange = (prop: keyof Endpoint) => (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setEndpoint({
      ...endpoint,
      [prop]: event.target.value as string[],
    });
  };

  const handleSelectionMultipleChange = (prop: keyof Endpoint) => (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setEndpoint({
      ...endpoint,
      [prop]: (event.target.value as string[]).join(","),
    });
  };

  function handleSave(): void {
    if (!validationSuccess) return;
    if (process.env.NODE_ENV === "development")
      console.log("EndpointEdit - Save:", endpoint);

    handleUpdateEndpoint(endpoint);

    handleFinishedEditingEndpoint();
  }

  const validationSuccess: boolean = useMemo(() => {
    if (!endpoint.name) return false;
    return true;
  }, [endpoint.name]);

  const classes = useStyles();

  return (
    <Fragment>
      <DialogTitle id="dialog-title">Endpoint: {endpoint.name}</DialogTitle>
      <DialogContent className={classes.container}>
        <section className={classes.content}>
          <Grid container direction="row" alignItems="center" justify="center">
            <TextField
              className={classes.formControl}
              fullWidth
              label="Name"
              margin="dense"
              required
              value={endpoint.name}
              onChange={handleTextFieldChange("name")}
            />
            <TextField
              className={classes.formControl}
              fullWidth
              label="Endpoint"
              margin="dense"
              required
              value={endpoint.endpoint}
              onChange={handleTextFieldChange("endpoint")}
            />
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <TextField
              className={classes.formControl}
              fullWidth
              label="Service"
              margin="dense"
              required
              value={endpoint.service}
              onChange={handleTextFieldChange("service")}
            />
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="log-level-label">Log Level</InputLabel>
              <Select
                labelId="log-level-label"
                id="log-level"
                value={endpoint.logLevel}
                onChange={handleSelectionChange("logLevel")}>
                {logLevels.map((logLevel: string) => (
                  <MenuItem key={logLevel} value={logLevel}>
                    {logLevel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="supported-methods-label">
                Supported Methods
              </InputLabel>
              <Select
                labelId="supported-methods-label"
                id="supported-methods"
                multiple
                value={supportedMethods}
                onChange={handleSelectionMultipleChange("supportedMethods")}
                input={<Input id="supported-methods-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}>
                {methods.map((method: string) => (
                  <MenuItem key={method} value={method}>
                    <Checkbox
                      color="primary"
                      checked={supportedMethods.indexOf(method) > -1}
                    />
                    <ListItemText primary={method} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <FormControl className={classes.formControl}>
              <FormControlLabel
                control={
                  <Switch
                    checked={endpoint.resultOnly}
                    onChange={handleToggleChange("resultOnly")}
                    name="resultOnly"
                    color="primary"
                  />
                }
                label="Result Only"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <FormControlLabel
                control={
                  <Switch
                    checked={endpoint.published}
                    onChange={handleToggleChange("published")}
                    name="published"
                    color="primary"
                  />
                }
                label="Published"
              />
            </FormControl>
          </Grid>
        </section>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          size="medium"
          color="primary"
          variant="text"
          onClick={handleFinishedEditingEndpoint}>
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
