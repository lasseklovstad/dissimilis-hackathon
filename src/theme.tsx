import {createMuiTheme} from "@material-ui/core/styles";
import {colors} from "./utils/colors";


export const theme : object = createMuiTheme({
    palette: {
        background: {
            default: colors.gray_100
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
        h1: {
            fontFamily: 
                "Roboto", 
            fontSize: "32px",
            lineHeight: 1.5,
            '@media(max-width:600px)' : {
                fontSize: "20px"
            }
        },
        h2: {
            fontFamily: 
                "Roboto", 
            
            fontSize: "24px",
            lineHeight: 1.5,
            '@media(max-width:600px)' : {
                fontSize: "20px"
            }
        },
        body1: { //Corresponding to the parapraph in the figma sketches. Can use variant = "p" to use this
            fontFamily: 
                "Roboto"
            ,
            fontSize: "16px",
            lineHeight: 1.5,
        },
        caption: {
            fontFamily: 
                "Roboto", 
            fontSize: "12px",
            lineHeight: 1.5,
        }
    }

});