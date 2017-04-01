// React
import React from 'react';

// components
import Header from './components/Header';
import Body from './components/Body';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as Colors from 'material-ui/styles/colors';

// build theme
const theme = getMuiTheme({
  palette: {
    primary1Color: Colors.indigo800,
    accent1Color: Colors.yellow500,
    pickerHeaderColor: Colors.indigo800,
  },
  baseTheme: {
    fontFamily: 'Nunito Sans, sans-serif',
  },
  fontFamily: 'Nunito Sans, sans-serif',
  slider: {
    trackColor: Colors.grey50,
    selectionColor: Colors.yellow500,
  },
});

const AppRoot = () => (
  <MuiThemeProvider muiTheme={theme}>
    <div>
      <Header />
      <Body />
    </div>
  </MuiThemeProvider>
);
export default AppRoot;
