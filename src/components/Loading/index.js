import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: 'flex',
      background: "rgba(255, 255, 255, .4)",
      zIndex: 24003204,
      justifyContent: "center",
      alignItems: "center",
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }),
);

const Loading = ({isLoading}) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ display: isLoading ? "flex" : "none" }}>
      <CircularProgress />
    </div>
  );
}
export default Loading;