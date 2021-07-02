import React, { useEffect, useState } from "react"
import {
    Backdrop,
    Button,
    CircularProgress,
    Fade,
    Grid,
    makeStyles,
    Dialog,
    DialogContent,
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
        top: "-32%",
    },
    dialogContent: {
        padding: "40px",
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
    composerDefaultValue?: string
    songNotesDefaultValue?: string
    tempoDefaultValue?: number
    handleOnSaveClick: (songName: string, arranger: string) => void
    handleOnCancelClick: () => void
    dialogOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    songNameLabelText: string
    arrangerLabelText: string
    composerLabelText: string
    songNotesLabelText: string
    tempoLabelText: string
    characterLimit?: number
    numberCharacterLimit?: number
    isLoading?: boolean
}) => {
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [tempoTextFieldInput, setTempoTextFieldInput] = useState("") // May not be a textfield, as its inputs are numbers

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit
    const NUMBER_CHARACTER_LIMIT =
        props.numberCharacterLimit === undefined ? 25 : props.numberCharacterLimit

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

    useEffect(() => {
        if (props.composerDefaultValue) {
            setComposerTextFieldInput(props.composerDefaultValue)
        }
    }, [props.composerDefaultValue])

    useEffect(() => {
        if (props.songNotesDefaultValue) {
            setSongNotesTextFieldInput(props.songNotesDefaultValue)
        }
    }, [props.songNotesDefaultValue])

    useEffect(() => {
        if (props.tempoDefaultValue) {
            setTempoTextFieldInput(props.tempoDefaultValue.toString()) // May need to be changed
        }
    }, [props.tempoDefaultValue])

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
                        //className={classes.dialogContent}
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
                                        id="song-info-modal-composer-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${composerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={composerTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setComposerTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.composerLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        // Song related notes
                                        id="song-info-modal-song-notes-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${songNotesTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={songNotesTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setSongNotesTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.songNotesLabelText}
                                        style={{ width: "100%" }}
                                    />
                                    <TextField
                                        // tempo
                                        id="song-info-modal-song-speed-textfield"
                                        inputProps={{
                                            maxLength: CHARACTER_LIMIT,
                                        }}
                                        helperText={`${tempoTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={tempoTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            setTempoTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.tempoLabelText}
                                        style={{ width: "100%" }}
                                        type="number"
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
