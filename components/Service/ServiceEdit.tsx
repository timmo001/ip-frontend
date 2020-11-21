import React, { ReactElement, useState, useMemo, Fragment } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import YAML from "yaml";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

import Action from "../../types/Action";
import ActionView from "./Action/ActionView";
import Service from "../../types/Service";
import ActionEdit from "./Action/ActionEdit";

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
  marginTop: {
    marginTop: theme.spacing(2),
  },
  buttonWithIcon: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
  iconOnButton: {
    marginRight: theme.spacing(0.5),
  },
  flex: { flex: 1 },
}));
interface ServiceEditProps {
  actions: ReactElement | ReactElement[];
  handleSave: (service: Service) => Promise<void>;
  new?: boolean;
  service: Service;
}

export default function ServiceEdit(
  props: ServiceEditProps
): ReactElement | null {
  const [service, setService] = useState<Service>(props.service);

  const [addAction, setAddAction] = useState<boolean>(false);

  function handleAdddingAction() {
    setAddAction(true);
  }

  function handleFinishedAddingAction() {
    setAddAction(false);
  }

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

  const handleAddAction = (action: Action): void => {
    service.actions.push(action);
    setService(service);
  };

  const handleUpdateAction = (i: number) => (action: Action): void => {
    service.actions[i] = action;
    setService(service);
  };

  const config = useMemo(() => YAML.stringify(service.config), [
    service.config,
  ]);

  const validationSuccess: boolean = useMemo(() => {
    if (!service) return false;
    if (!service.name) return false;
    return true;
  }, [service]);

  const classes = useStyles();

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Typography component="h2" variant="h4" gutterBottom>
            Service: {service.name}
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
                value={service.name}
                onChange={handleTextFieldChange("name")}
              />
              <TextField
                className={classes.formControl}
                fullWidth
                label="Description"
                margin="dense"
                variant="outlined"
                value={service.description}
                onChange={handleTextFieldChange("description")}
              />
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"></Grid>
          </section>
          <Typography component="h5" variant="h5" gutterBottom>
            Config
          </Typography>
          <Divider light />
          <MonacoEditor
            height="240px"
            width="100%"
            language="yaml"
            theme="vs-dark"
            defaultValue={config}
            onChange={handleConfigChange}
          />
          <Typography
            className={classes.marginTop}
            component="h5"
            variant="h5"
            gutterBottom>
            Actions
          </Typography>
          <Divider light />
          <Grid item container direction="row" justify="space-evenly">
            {service.actions.map((action: Action, index: number) => (
              <ActionView
                key={index}
                {...props}
                action={action}
                handleUpdateAction={handleUpdateAction(index)}
              />
            ))}
            <Grid
              className={classes.marginTop}
              item
              xs={12}
              container
              justify="center">
              <Button
                className={classes.buttonWithIcon}
                color="secondary"
                size="medium"
                variant="outlined"
                onClick={handleAdddingAction}>
                <AddIcon className={classes.iconOnButton} fontSize="small" />
                Add Action
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={classes.actions}>
          {props.actions}
          <Button
            className={classes.buttonWithIcon}
            disabled={!validationSuccess}
            color="primary"
            size="medium"
            variant="contained"
            onClick={() => props.handleSave(service)}>
            <SaveIcon className={classes.iconOnButton} fontSize="small" />
            {props.new ? "Create" : "Save"}
          </Button>
          <div className={classes.flex} />
          <div className={classes.flex} />
          <div className={classes.flex} />
          <div className={classes.flex} />
        </CardActions>
      </Card>
      {addAction ? (
        <ActionEdit
          action={{
            id: uuidv4(),
            description: "",
            requires: "",
            service: { plugin: "", service: "" },
            parameters: undefined,
          }}
          key={-1}
          handleFinishedEditingAction={handleFinishedAddingAction}
          handleUpdateAction={handleAddAction}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
}
