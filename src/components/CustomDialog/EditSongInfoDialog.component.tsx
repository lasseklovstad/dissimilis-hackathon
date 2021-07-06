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
    TextField,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"

const useStyles = makeStyles({
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

export const EditSongInfoDialog = (props: {
    songNameDefaultValue?: string
    arrangerDefaultValue?: string
    composerDefaultValue?: string
    songNotesDefaultValue?: string
    speedDefaultValue?: number
    handleOnSaveClick: (
        songName: string,
        arranger: string,
        composer: string,
        songNotes: string,
        speed: number
    ) => void
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
    speedLabelText: string
    characterLimit?: number
    numberLimit?: number
    isLoading?: boolean
}) => {
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [speedTextFieldInput, setSpeedTextFieldInput] = useState("")

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit
    const NUMBER_CHARACTER_LIMIT =
        props.numberLimit === undefined ? 256 : props.numberLimit

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
        if (props.speedDefaultValue) {
            setSpeedTextFieldInput(props.speedDefaultValue.toString())
        }
    }, [props.speedDefaultValue])

    return (
        <Dialog
            open={props.dialogOpen}
            onClose={() => props.handleClosed()}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}
        >
            <DialogContent
                style={{
                    padding: "40px",
                }}
            >
                <Fade in={props.dialogOpen}>
                    <div>
                        <form
                            className={classes.container}
                            onSubmit={(event) => {
                                event.preventDefault()
                                props.handleOnSaveClick(
                                    songNameTextFieldInput,
                                    arrangerTextFieldInput,
                                    composerTextFieldInput,
                                    songNotesTextFieldInput,
                                    parseInt(speedTextFieldInput)
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
                                        id="song-info-modal-song-speed-textfield"
                                        helperText={`${speedTextFieldInput.length}/${NUMBER_CHARACTER_LIMIT}`}
                                        autoFocus
                                        value={speedTextFieldInput}
                                        variant="filled"
                                        onChange={(e) => {
                                            e.target.value = Math.max(
                                                0,
                                                parseInt(e.target.value)
                                            ).toString()
                                            setSpeedTextFieldInput(
                                                e.target.value
                                            )
                                        }}
                                        label={props.speedLabelText}
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
