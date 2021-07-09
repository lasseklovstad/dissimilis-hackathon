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
    ariaLabel?: string
}) => {
    const {
        disabled = false,
        buttonText,
        onClick,
        isCancelButton,
        ariaLabel = buttonText,
    } = props
    const classes = useStyles()

    return (
        <div>
            {onClick !== undefined ? (
                isCancelButton ? (
                    <Button
                        className={classes.button}
                        size="large"
                        aria-label={ariaLabel}
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
                        aria-label={ariaLabel}
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
                    aria-label={ariaLabel}
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
