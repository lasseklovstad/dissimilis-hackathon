import React, { useState } from "react"
import {
    Modal,
    makeStyles,
    Grid,
    Typography,
    TextField,
    Button,
    Fade,
    Backdrop,
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
    handleOnSaveClick: () => void
    handleOnCancelClick: () => void
    handleChange: (txt: string) => void
    modalOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    labelText: string
}) => {
    const classes = useStyles()
    const [textFieldInput, setTextFieldInput] = useState("")

    const CHARACTER_LIMIT = 250

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
                    <Grid container>
                        <Typography className={classes.title} variant="h2">
                            {props.headerText}
                        </Typography>
                        <Grid item className={classes.insertName} xs={12}>
                            <TextField
                                inputProps={{ maxLength: CHARACTER_LIMIT }}
                                helperText={`${textFieldInput.length}/${CHARACTER_LIMIT}`}
                                autoFocus
                                variant="filled"
                                onChange={(e) => {
                                    setTextFieldInput(e.target.value)
                                    props.handleChange(e.target.value)
                                }}
                                label={props.labelText}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                className={classes.button}
                                size="large"
                                variant="contained"
                                disabled={!textFieldInput}
                                onClick={() => props.handleOnSaveClick()}
                            >
                                {props.saveText}
                            </Button>
                            <Button
                                className={classes.button}
                                size="large"
                                variant="outlined"
                                onClick={() => props.handleOnCancelClick()}
                            >
                                {props.cancelText}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}
