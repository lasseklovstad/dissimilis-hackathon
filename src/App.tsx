import React, { useState } from 'react';
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Routing from './Routing';
import { theme } from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AuthContext, AuthContextProvider } from './contexts/auth';

function App() {
  return (
    <div>
      <AuthContextProvider>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Routing />
        </MuiThemeProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;