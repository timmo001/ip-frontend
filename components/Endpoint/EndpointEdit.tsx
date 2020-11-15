import React, { ReactElement, useState, useMemo, Fragment } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Endpoint from "../../types/Endpoint";
import Service from "../../types/Service";

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
    justifyContent: "center",
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
  buttonWithIcon: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
  iconOnButton: {
    marginRight: theme.spacing(0.5),
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
  actions: ReactElement | ReactElement[];
  endpoint: Endpoint;
  services: Service[];
  new?: boolean;
  handleSave: (endpoint: Endpoint) => Promise<void>;
}

export default function EndpointEdit(
  props: EndpointEditProps
): ReactElement | null {
  const [endpoint, setEndpoint] = useState<Endpoint>(props.endpoint);

  const supportedMethods: string[] = useMemo(
    () => (endpoint ? endpoint.supportedMethods.split(",") : []),
    [endpoint]
  );

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
      [prop]: (event.target.value as string[])
        .filter((value: string) =>
          // Remove any rogue null values
          value.length > 0 ? true : false
        )
        .join(","),
    });
  };

  if (!endpoint) return null;

  const validationSuccess: boolean = useMemo(() => {
    if (!endpoint) return false;
    if (!endpoint.name) return false;
    if (!endpoint.endpoint) return false;
    if (!endpoint.service) return false;
    if (!endpoint.logLevel) return false;
    if (!endpoint.supportedMethods) return false;
    return true;
  }, [endpoint]);

  const classes = useStyles();

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Typography component="h2" variant="h4" gutterBottom>
            Endpoint: {endpoint.name}
          </Typography>
          <section className={classes.content}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center">
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
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center">
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
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center">
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
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center">
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
        </CardContent>
        <CardActions className={classes.actions}>
          {props.actions}
          <Button
            className={classes.buttonWithIcon}
            disabled={!validationSuccess}
            color="primary"
            size="medium"
            variant="contained"
            onClick={() => props.handleSave(endpoint)}>
            <SaveIcon className={classes.iconOnButton} fontSize="small" />
            {props.new ? "Create" : "Save"}
          </Button>
        </CardActions>
      </Card>
    </Fragment>
  );
}
