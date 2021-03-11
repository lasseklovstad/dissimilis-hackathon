import React, { useEffect, useState } from "react"
import {
    Backdrop,
    Button,
    CircularProgress,
    Fade,
    Grid,
    makeStyles,
    Modal,
    TextField,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"

const useStyles = makeStyles({
    modal: {
        position: "absolute",
        boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
        height: "auto",
        borderRadius: 2,
        backgroundColor: "white",
        padding: "40px",
        "@media (max-width: 600px)": {
            width: "80%",
            padding: "48px",
        },
        outline: "none",
    },
    insertName: {
        marginBottom: "24px",
    },
    button: {
        "&:hover": {
            backgroundColor: colors.gray_300,
        },
        marginRight: "8px",
        float: "left",
        position: "relative",
    },
    title: {
        marginBottom: "8px",
    },
    container: {
        width: "100%",
    },
})

export const InputModal = (props: {
    defaultValue?: string
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    modalOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    labelText: string
    characterLimit?: number
    isLoading?: boolean
}) => {
    const classes = useStyles()
    const [textFieldInput, setTextFieldInput] = useState("")

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit

    useEffect(() => {
        if (props.defaultValue) {
            setTextFieldInput(props.defaultValue)
        }
    }, [props.defaultValue])

    return (
        <Modal
            open={props.modalOpen}
            onClose={() => props.handleClosed()}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}
        >
            <Fade in={props.modalOpen}>
                <div
                    className={classes.modal}
                    style={{
                        top: "20%",
                        left: `50%`,
                        transform: `translate(-50%)`,
                    }}
                >
                    <form
                        className={classes.container}
                        onSubmit={(event) => {
                            event.preventDefault()
                            props.handleOnSaveClick(textFieldInput)
                        }}
                    >
                        <Grid container>
                            <Typography className={classes.title} variant="h2">
                                {props.headerText}
                            </Typography>
                            <Grid item className={classes.insertName} xs={12}>
                                <TextField
                                    inputProps={{ maxLength: CHARACTER_LIMIT }}
                                    helperText={`${textFieldInput.length}/${CHARACTER_LIMIT}`}
                                    autoFocus
                                    value={textFieldInput}
                                    variant="filled"
                                    onChange={(e) => {
                                        setTextFieldInput(e.target.value)
                                    }}
                                    label={props.labelText}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid container xs={12} >
                                {props.isLoading ? (
                                    <Grid item xs={2} >
                                        <CircularProgress style={{margin: 4}} size={24} />
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <Button
                                            className={classes.button}
                                            size="large"
                                            variant="contained"
                                            disabled={!textFieldInput}
                                            type="submit"
                                        >
                                            {props.saveText}
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item>
                                    <Button
                                        className={classes.button}
                                        size="large"
                                        variant="outlined"
                                        onClick={() => {
                                            props.handleOnCancelClick()
                                            setTextFieldInput("")
                                        }}
                                    >
                                        {props.cancelText}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Fade>
        </Modal>
    )
}
