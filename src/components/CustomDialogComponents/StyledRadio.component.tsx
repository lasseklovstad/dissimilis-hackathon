import { Radio, RadioProps } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react"
import { theme } from "../../theme"

import { colors } from "../../utils/colors"

const useStyles = makeStyles({
    subtitle: {
        fontWeight: "bold",
        marginBottom: theme.spacing(1),
    },
    radioButtonGroup: {
        color: colors.black,
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(2),
    },
    root: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    radioButton: {
        borderRadius: "50%",
        width: 16,
        height: 16,
        boxShadow: `inset 0 0 0 1px ${colors.gray_500}, inset 0 -1px 0 ${colors.gray_400}`,
        backgroundColor: colors.gray_100,
        backgroundImage: `linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))`,
        "input:hover ~ &": {
            backgroundColor: colors.gray_200,
        },
    },
    checkedRadioButton: {
        backgroundColor: colors.gray_500,
        backgroundImage:
            "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
        borderRadius: "50%",
        "&:before": {
            display: "block",
            width: 16,
            height: 16,
            backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
            content: '""',
        },
    },
    focusedRadioButton: {
        boxShadow: `0 0 0 3px ${colors.focus}`,
    },
})

export const StyledRadio = function (props: RadioProps) {
    const classes = useStyles()

    return (
        <Radio
            className={classes.root}
            disableFocusRipple
            color="default"
            checkedIcon={<span className={classes.checkedRadioButton} />}
            icon={<span className={classes.radioButton} />}
            focusVisibleClassName={classes.focusedRadioButton}
            {...props}
        />
    )
}
