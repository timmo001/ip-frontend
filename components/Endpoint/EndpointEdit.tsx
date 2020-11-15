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
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Endpoint from "../../types/Endpoint";
import Service from "../../types/Service";
import { Autocomplete } from "@material-ui/lab";

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

const methods = ["DELETE", "GET", "PATCH", "POST", "PUT"];
const logLevels = ["debug", "info", "warn", "error"];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
interface EndpointEditProps {
  actions: ReactElement | ReactElement[];
  endpoint: Endpoint;
  handleSave: (endpoint: Endpoint) => Promise<void>;
  new?: boolean;
  services: Service[];
}

export default function EndpointEdit(
  props: EndpointEditProps
): ReactElement | null {
  const [endpoint, setEndpoint] = useState<Endpoint>(props.endpoint);

  const service: Service = useMemo(
    () => props.services.find((s: Service) => s.id === endpoint.service),
    [endpoint]
  );

  const supportedMethods: string[] = useMemo(
    () => endpoint.supportedMethods.split(","),
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

  const handleServiceChange = (
    _event: React.ChangeEvent<{ value: unknown }>,
    newValue: Service
  ): void => {
    if (newValue)
      setEndpoint({
        ...endpoint,
        service: newValue.id,
      });
  };

  const handleSelectionChange = (prop: keyof Endpoint) => (
    _event: React.ChangeEvent<{ value: unknown }>,
    newValue: any
  ): void => {
    setEndpoint({
      ...endpoint,
      [prop]: newValue,
    });
  };

  const handleSelectionMultipleChange = (prop: keyof Endpoint) => (
    _event: React.ChangeEvent<{ value: unknown }>,
    newValue: string[]
  ): void => {
    setEndpoint({
      ...endpoint,
      [prop]: newValue
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
                variant="outlined"
                value={endpoint.name}
                onChange={handleTextFieldChange("name")}
              />
              <TextField
                className={classes.formControl}
                fullWidth
                label="Endpoint"
                margin="dense"
                required
                variant="outlined"
                value={endpoint.endpoint}
                onChange={handleTextFieldChange("endpoint")}
              />
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center">
              <Autocomplete
                className={classes.formControl}
                fullWidth
                getOptionLabel={(option) =>
                  `${option.name} - ${option.description}`
                }
                options={props.services}
                value={service}
                onChange={handleServiceChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    label="Service"
                  />
                )}
              />
              <FormControl
                className={classes.formControl}
                fullWidth
                required
                variant="outlined">
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
              <Autocomplete
                className={classes.formControl}
                disableCloseOnSelect
                fullWidth
                getOptionLabel={(option) => option}
                multiple
                options={methods}
                value={supportedMethods}
                onChange={handleSelectionMultipleChange("supportedMethods")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    label="Supported Methods"
                  />
                )}
                renderOption={(option, { selected }) => (
                  <Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </Fragment>
                )}
              />
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
