import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import {responsiveFontSizes} from "@material-ui/core"

const dissimilisTheme = createMuiTheme({
    palette: {
        primary: {main: '#47acff'},
        secondary: {main: '#ff67c7', contrastText: 'white'},
        success: {main: '#58b02c'}
    },

    typography: {
        fontFamily: 'Lucida Sans Unicode'
    }
})
export default responsiveFontSizes(dissimilisTheme)
