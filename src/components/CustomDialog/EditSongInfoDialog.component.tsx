import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    Grid,
    makeStyles,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
} from "@material-ui/core"

import { useGetSongMetadata } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomModalComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
        buttons: {
            marginBottom: theme.spacing(3.2),
            marginLeft: theme.spacing(3.2),
        },
        arranger: {
            marginBottom: theme.spacing(4),
        },
        title: {
            marginBottom: theme.spacing(1),
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
    }
})

export const EditSongInfoDialog = (props: {
    songId: number
    handleOnSaveClick: (
        songName: string,
        arranger: string,
        composer: string,
        songNotes: string,
        speed: number
    ) => void
    handleOnCancelClick: () => void
    characterLimit?: number
    numberMax?: number
    numberMin?: number
    isLoadingPatch?: boolean
}) => {
    const {
        songId,
        handleOnSaveClick,
        handleOnCancelClick,
        characterLimit = 250,
        numberMax = 256,
        numberMin = 0,
        isLoadingPatch,
    } = props
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [speedTextFieldInput, setSpeedTextFieldInput] = useState<number>(0)
    const { t } = useTranslation()

    const { getSongMetadata, songMetadataFetched } = useGetSongMetadata(
        songId.toString()
    )

    const isLoadingGet = getSongMetadata.loading

    useEffect(() => {
        if (
            songMetadataFetched?.title &&
            songMetadataFetched?.arrangerName &&
            songMetadataFetched?.composer &&
            songMetadataFetched?.songNotes &&
            songMetadataFetched?.speed
        ) {
            setSongNameTextFieldInput(songMetadataFetched.title)
            setArrangerTextFieldInput(songMetadataFetched.arrangerName)
            setComposerTextFieldInput(songMetadataFetched.composer)
            setSongNotesTextFieldInput(songMetadataFetched.songNotes)
            setSpeedTextFieldInput(songMetadataFetched.speed)
        }
    }, [songMetadataFetched])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(
                    songNameTextFieldInput,
                    arrangerTextFieldInput,
                    composerTextFieldInput,
                    songNotesTextFieldInput,
                    speedTextFieldInput
                )
            }}
        >
            <DialogContent
                style={{
                    padding: "40px",
                }}
            >
                <Grid container>
                    <Typography className={classes.title} variant="h2">
                        {t("MenuButton.details")}
                    </Typography>
                    <TextField
                        id="song-info-modal-song-name-textfield"
                        inputProps={{
                            maxLength: characterLimit,
                        }}
                        helperText={`${songNameTextFieldInput.length}/${characterLimit}`}
                        autoFocus
                        variant="filled"
                        value={songNameTextFieldInput}
                        onChange={(e) => {
                            setSongNameTextFieldInput(e.target.value)
                        }}
                        label={t("Modal.nameOfSong")}
                        style={{
                            width: "100%",
                        }}
                    />
                    <Typography className={classes.arranger}>
                        {t("Song.arranger") + ": " + arrangerTextFieldInput}
                    </Typography>
                    <TextField
                        id="song-info-modal-composer-textfield"
                        inputProps={{
                            maxLength: characterLimit,
                        }}
                        helperText={`${composerTextFieldInput.length}/${characterLimit}`}
                        className={classes.textFields}
                        value={composerTextFieldInput}
                        variant="filled"
                        onChange={(e) => {
                            setComposerTextFieldInput(e.target.value)
                        }}
                        label={t("Song.composer")}
                        style={{ width: "100%" }}
                    />
                    <TextField
                        id="song-info-modal-song-speed-textfield"
                        value={speedTextFieldInput}
                        className={classes.textFields}
                        helperText={t("Song.bpm")}
                        variant="filled"
                        onChange={(e) => {
                            e.target.value = Math.max(
                                numberMin,
                                Math.min(numberMax, parseInt(e.target.value))
                            ).toString()
                            setSpeedTextFieldInput(parseInt(e.target.value))
                        }}
                        label={t("Song.songSpeed")}
                        style={{ width: "100%" }}
                        type="number"
                    />
                    <TextField
                        id="song-info-modal-song-notes-textfield"
                        inputProps={{
                            maxLength: characterLimit,
                        }}
                        className={classes.textFields}
                        helperText={`${songNotesTextFieldInput.length}/${characterLimit}`}
                        multiline
                        value={songNotesTextFieldInput}
                        variant="filled"
                        onChange={(e) => {
                            setSongNotesTextFieldInput(e.target.value)
                        }}
                        label={t("Song.songNotes")}
                        style={{ width: "100%" }}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container className={classes.buttons}>
                    {isLoadingPatch || isLoadingGet ? (
                        <Grid container className={classes.loading}>
                            <CircularProgress aria-label="Loading" size={24} />
                        </Grid>
                    ) : (
                        <Grid item>
                            <DialogButton
                                disabled={!songNameTextFieldInput.trim()}
                                buttonText={t("Modal.save")}
                                isCancelButton={false}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <DialogButton
                            buttonText={t("Modal.cancel")}
                            onClick={() => {
                                handleOnCancelClick()
                                setSongNameTextFieldInput("")
                                setArrangerTextFieldInput("")
                            }}
                            isCancelButton
                        />
                    </Grid>
                </Grid>
            </DialogActions>
        </form>
    )
}
