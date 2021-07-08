import React, { useEffect, useState } from "react"
import {
    Backdrop,
    CircularProgress,
    Fade,
    Grid,
    makeStyles,
    Modal,
    TextField,
    Typography,
} from "@material-ui/core"
import { DialogButton } from "../CustomModalComponents/DialogButton.components"

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

    title: {
        marginBottom: "8px",
    },
    container: {
        width: "100%",
    },
    loading: {
        margin: "8px",
        marginRight: "16px",
        justifyContent: "center",
        alignContent: "center",
        minWidth: "64px",
        maxWidth: "64px",
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
                                    id="input-modal-textfield"
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
                            <Grid item xs={12}>
                                <Grid container>
                                    {props.isLoading ? (
                                        <Grid
                                            container
                                            className={classes.loading}
                                        >
                                            <CircularProgress size={24} />
                                        </Grid>
                                    ) : (
                                        <Grid item>
                                            <DialogButton
                                                disabled={!textFieldInput}
                                                buttonText={props.saveText}
                                                isCancelButton={false}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item>
                                        <DialogButton
                                            buttonText={props.cancelText}
                                            onClick={() => {
                                                props.handleOnCancelClick()
                                                setTextFieldInput("")
                                            }}
                                            isCancelButton
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Fade>
        </Modal>
    )
}
