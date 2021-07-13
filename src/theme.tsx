import { createMuiTheme } from "@material-ui/core/styles"
import { colors } from "./utils/colors"

const defaultTheme = createMuiTheme()

export const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            "@global": {
                html: {
                    fontSize: "100%",
                },
            },
        },
        MuiTab: {
            root: {
                "&:focus": {
                    boxShadow: `0 0 0 4px ${colors.focus}`,
                },
            },
        },
        MuiIconButton: {
            root: {
                "&:focus": {
                    boxShadow: `0 0 0 4px ${colors.focus}`,
                },
            },
        },
        MuiButton: {
            root: {
                "&:focus": {
                    boxShadow: `0 0 0 4px ${colors.focus}`,
                },
            },
        },
        MuiSelect: {
            root: {
                "&:focus": {
                    boxShadow: `0 0 0 4px ${colors.focus}`,
                },
            },
        },
        MuiCardActionArea: {
            root: {
                "&:focus $focusHighlight": {
                    opacity: 0,
                },
                "&:focus:hover $focusHighlight": {
                    opacity: 0.04,
                },
            },
        },
        MuiDialog: {
            paper: {
                padding: defaultTheme.spacing(1),
            },
        },
        MuiDialogActions: {
            root: {
                padding: `${defaultTheme.spacing(1)}px ${defaultTheme.spacing(
                    2
                )}px`,
                justifyContent: "flex-start",
            },
        },
        MuiDialogContentText: {
            root: {
                color: colors.black,
            },
        },
    },
    palette: {
        primary: {
            main: colors.gray_400,
        },
        background: {
            default: colors.gray_100,
        },
    },
    typography: {
        fontFamily: "Roboto",
        h1: {
            fontSize: "2rem",
            lineHeight: 1.5,
            "@media(max-width:600px)": {
                fontSize: "1.625rem",
            },
        },
        h2: {
            fontSize: "1.5rem",
            lineHeight: 1.5,
            "@media(max-width:600px)": {
                fontSize: "1.25rem",
            },
        },
        body1: {
            // Corresponding to the parapraph in the figma sketches. Can use variant = "p" to use this, 16px
            fontSize: "1rem",
            lineHeight: 1.5,
            "@media(max-width:600px)": {
                fontSize: "0.875rem",
            },
        },
        caption: {
            // 12px
            fontSize: "0.75rem",
            lineHeight: 1.5,
        },
        button: {
            textTransform: "none",
        },
        body2: {
            lineHeight: 0,
            fontSize: "0.875rem",
        },
    },
})
