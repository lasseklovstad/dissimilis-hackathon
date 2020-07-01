import React from 'react';
import {MuiThemeProvider} from "@material-ui/core/styles";
import Routing from './Routing';
import { theme } from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
        <div>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Routing />
          </MuiThemeProvider>
              
        </div>
  );
}

export default App;