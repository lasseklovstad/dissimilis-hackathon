import React, { useEffect, useState } from "react"
import {
    Backdrop,
    Button,
    CircularProgress,
    Fade,
    Grid,
    makeStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"

const useStyles = makeStyles({
    dummy: {
        position: "absolute",
        boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
        height: "auto",
        borderRadius: 1,
        backgroundColor: "white",
        "@media (max-width: 600px)": {
            width: "80%",
            padding: "48px",
        },
        outline: "none",
    },
    dialog: {
        //top: "-32%",
    },
    dialogContent: {
        //padding: "40px",
        //paddingTop: "40px", // Hvorfor har ikke denne noen effekt?!
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
    loading: {
        margin: "8px",
        marginRight: "16px",
        justifyContent: "center",
        alignContent: "center",
        minWidth: "64px",
        maxWidth: "64px",
    },
})

export const SongInfoDialog = (props: {
    songNameDefaultValue?: string
    arrangerDefaultValue?: string
    handleOnSaveClick: (songName: string, arranger: string) => void
    handleOnCancelClick: () => void
    dialogOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    songNameLabelText: string
    arrangerLabelText: string
    characterLimit?: number
    isLoading?: boolean
}) => {
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit

    useEffect(() => {
        if (props.songNameDefaultValue) {
            setSongNameTextFieldInput(props.songNameDefaultValue)
        }
    }, [props.songNameDefaultValue])

    useEffect(() => {
        if (props.arrangerDefaultValue) {
            setArrangerTextFieldInput(props.arrangerDefaultValue)
        }
    }, [props.arrangerDefaultValue])

    return (
        <Dialog
            open={props.dialogOpen}
            onClose={() => props.handleClosed()}
            //className={classes.dialog}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}
            style={{
                top: "-32%",
            }}
        >
            <DialogContent
                //className={classes.dialogContent}
                style={{
                    padding: "40px",
                }}
            >
                <Fade in={props.dialogOpen}>
                    <div
                        className={classes.dialogContent}
                    >
                        <form
                            className={classes.container}
                            onSubmit={(event) => {
                                event.preventDefault()
                                props.handleOnSaveClick(
                                    songNameTextFieldInput,
                                    arrangerTextFieldInput
                                )
                            }}
                        >
                            <Grid container>
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    {props.headerText}
                                </Typography>
                                <Grid
                                    item
                                    className={classes.insertName}
                                    xs={12}
                                >
                                    <TextField
                                        id="song-info-modal-song-name-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${songNameTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={songNameTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setSongNameTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.songNameLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        id="song-info-modal-arranger-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${arrangerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={arrangerTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setArrangerTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.arrangerLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        // Composer
                                        id="song-info-modal-arranger-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${arrangerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={arrangerTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setArrangerTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.arrangerLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        // Song related notes
                                        id="song-info-modal-arranger-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${arrangerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={arrangerTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setArrangerTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.arrangerLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        // speed
                                        id="song-info-modal-arranger-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${arrangerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={arrangerTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setArrangerTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.arrangerLabelText}
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
                                                <Button
                                                    className={classes.button}
                                                    size="large"
                                                    variant="contained"
                                                    disabled={
                                                        !songNameTextFieldInput
                                                    }
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
                                                    setSongNameTextFieldInput(
                                                        ""
                                                    )
                                                    setArrangerTextFieldInput(
                                                        ""
                                                    )
                                                }}
                                            >
                                                {props.cancelText}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Fade>
            </DialogContent>
        </Dialog>
    )
}
