import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';
// A custom theme for this app
const theme = createTheme({
  palette: {
    type: 'light',
    // default: {
    //   main: "#000000",
    //   light: "#000000",
    //   dark: "#000000",
    // },
    // primary: {
    //   main: '#FFFFFF',
    //   light: '#FFFFFF',
    //   dark: '#FFFFFF',
    // },
    secondary: {
      main: "#000000",
      light: "#000000",
      dark: "#000000",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#dddddd',
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        padding: '20px 10px',
        margin: '10px',
        backgroundColor: '#fff', // 5d737e
      },
    },
    MuiButton: {
      root: {
        margin: '5px',
      },
    },
  },
});
export default theme;