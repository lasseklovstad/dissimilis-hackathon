import React, { useState } from 'react';
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Routing from './Routing';
import { theme } from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AuthContext } from './contexts/auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedIn, setLoggedIn] = useState(false)
  const value = { token, setToken, loggedIn, setLoggedIn }

  return (
    <div>
      <AuthContext.Provider value={value}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Routing />
        </MuiThemeProvider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;