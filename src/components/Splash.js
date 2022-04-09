import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { Button, Paper } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    background: "#F6E0C9"
  },
  input: {
    marginLeft: '6px',
    flex: 1,
    fontSize: "12px"
  },
  iconButton: {
    padding: 2,
    fontSize: "12px"
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));
function App(props) {
  const classes = useStyles();
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!'theme' in localStorage && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('html').classList.add('dark')
  } else if (localStorage.theme === 'dark') {
      document.querySelector('html').classList.add('dark')
  }
  })
  const switchTheme = () => {
    let htmlClasses = document.documentElement.classList;
        if(localStorage.theme == 'dark') {
            htmlClasses.remove('dark');
            localStorage.removeItem('theme')
        } else {
            htmlClasses.add('dark');
            localStorage.theme = 'dark';
        }
  }
  return (
    <div className="flex h-screen w-2/3 items-center mx-auto">
      <IconButton aria-label="dark-light theme" onClick={switchTheme}>
        <Icon color="action" className="dark:text-yellow-200">brightness_medium</Icon>
      </IconButton>
      <Container maxWidth="md" className="App">

        <Paper elevation={3} className="rounded-3xl pb-32 dark:bg-gray-700">

          <Typography variant="h3" gutterBottom className="font-bold text-black dark:text-gray-300">
            NFTs Created by Creators
          </Typography>
          <Typography variant="h5" className="text-black dark:text-gray-300 font-medium" gutterBottom>
            Exclusive NFTs by auction sale, created by real creators themselves
          </Typography>
          <div className="flex justify-between w-1/2 mx-auto mt-16">
            <Button onClick={() => props.history.push('/login')} variant="contained" color="primary" elevation={3} className="w-36 rounded-md capitalize">
              Sign In
            </Button>
            <Button component={Link} to="/signup" variant="contained" color="secondary" elevation={3} className="w-36 rounded-md capitalize">
              Sign Up
            </Button>
          </div>
          <Paper component="form" elevation={2} color="primary" className={`px-1 py-0.5 mx-auto mt-10 flex items-center w-1/2 rounded-3xl ${classes.root}`}>
            <InputBase
              className={classes.input}
              placeholder="Search Creators NFTs"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <Icon color="action" className="text-base leading-none">search</Icon>
            </IconButton>
          </Paper>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
