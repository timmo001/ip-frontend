import { makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

function CustomPagination(props: { pagination: any; api: any }) {
  const { pagination, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      page={pagination.page}
      count={pagination.pageCount}
      onChange={(_event, value) => api.current.setPage(value)}
    />
  );
}

export default CustomPagination;
