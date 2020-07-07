import {createMuiTheme} from "@material-ui/core/styles";
import {colors} from "./utils/colors";

export const theme : object = createMuiTheme({
    overrides: {
        MuiCssBaseline : {
            '@global' : {
                html: {
                    fontSize: "100%"
                }
            }
        }
    },
    spacing: 8,
    palette: {
        primary: {
            main: colors.gray_400
        },
        background: {
            default: colors.gray_100,
        }
    },
    /*props: {
        MuiTypography: {
            variantMapping: {
                p : "body1"
            }
        }
    },*/
    typography: {
        fontFamily: "Roboto", 
        h1: {
            fontSize: "2rem",
            lineHeight: 1.5,
            '@media(max-width:600px)' : {
                fontSize: "1.625rem"
            }
        },
        h2: {
            fontSize: "1.5rem",
            lineHeight: 1.5,
            '@media(max-width:600px)' : {
                fontSize: "1.25"
            }
        },
        body1: { //Corresponding to the parapraph in the figma sketches. Can use variant = "p" to use this
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        caption: {
            fontSize: "0.75rem",
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none'
        }
    }

});