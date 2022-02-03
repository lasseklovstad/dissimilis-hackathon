import { createTheme, Theme } from "@mui/material/styles"
import { colors } from "./utils/colors"

declare module "@mui/styles/defaultTheme" {
    interface DefaultTheme extends Theme {}
}

const defaultTheme = createTheme()

export const theme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-focusVisible": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    "&.Mui-focusVisible": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    "&.Mui-focusVisible": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                },
            },
            defaultProps: {
                color: "inherit",
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    "&.Mui-focused": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    "&.Mui-focused": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&:hover:not(.MuiOutlinedInput-disabled):not(.MuiOutlinedInput-focused):not(.MuiOutlinedInput-error) .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: `${colors.gray_500_dark}`,
                        },
                },
            },
        },
        MuiCardActionArea: {
            styleOverrides: {
                root: {
                    "&.Mui-focused .MuiCardActionArea-focusHighlight": {
                        opacity: 0,
                    },
                    "&.Mui-focused:hover .MuiCardActionArea-focusHighlight": {
                        opacity: 0.04,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    padding: defaultTheme.spacing(1),
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: `${defaultTheme.spacing(
                        1
                    )}px ${defaultTheme.spacing(2)}px`,
                    justifyContent: "flex-start",
                },
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    color: colors.black,
                },
            },
        },
    },
    palette: {
        primary: {
            main: colors.gray_400,
        },
        secondary: {
            main: colors.gray_500_dark,
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
