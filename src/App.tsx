import React from 'react'
import './App.css'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Routing from './Routing'
import { theme } from './theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import * as dotenv from 'dotenv'

function App() {
    dotenv.config()

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Routing />
            </MuiThemeProvider>
        </div>
    )
}

export default App
