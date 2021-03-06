import React from "react"
import { Button, ButtonProps } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { colors } from "../../utils/colors"

const useStyles = makeStyles((theme) => {
    return {
        button: {
            "&:hover": {
                backgroundColor: colors.gray_300,
            },
            marginRight: theme.spacing(1),
        },
    }
})

export const DialogButton = (props: ButtonProps) => {
    const classes = useStyles()
    return (
        <Button
            className={classes.button}
            size="large"
            variant="outlined"
            {...props}
        />
    )
}
