import React from "react"
import { Button, makeStyles } from "@material-ui/core"
import { colors } from "../../utils/colors"

const useStyles = makeStyles((theme) => {
    return {
        button: {
            "&:hover": {
                backgroundColor: colors.gray_300,
            },
            marginRight: theme.spacing(1),
            float: "left",
            position: "relative",
        },
    }
})

export const DialogButton = (props: {
    disabled?: boolean
    buttonText: string
    onClick?: () => void
    isCancelButton: boolean
}) => {
    const { disabled = false, buttonText, onClick, isCancelButton } = props
    const classes = useStyles()

    return (
        <div>
            {onClick !== undefined ? (
                isCancelButton ? (
                    <Button
                        className={classes.button}
                        size="large"
                        variant="outlined"
                        onClick={() => {
                            onClick()
                        }}
                    >
                        {buttonText}
                    </Button>
                ) : (
                    <Button
                        className={classes.button}
                        size="large"
                        variant="contained"
                        onClick={() => {
                            onClick()
                        }}
                        disabled={disabled}
                    >
                        {buttonText}
                    </Button>
                )
            ) : (
                <Button
                    className={classes.button}
                    size="large"
                    variant="contained"
                    disabled={disabled}
                    type="submit"
                >
                    {buttonText}
                </Button>
            )}
        </div>
    )
}
