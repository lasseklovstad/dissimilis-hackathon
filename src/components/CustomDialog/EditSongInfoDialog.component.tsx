import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    makeStyles,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    DialogTitle,
    DialogContentText,
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
        setSongNameTextFieldInput(songMetadataFetched?.title || "")
        setArrangerTextFieldInput(songMetadataFetched?.arrangerName || "")
        setComposerTextFieldInput(songMetadataFetched?.composer || "")
        setSongNotesTextFieldInput(songMetadataFetched?.songNotes || "")
        setSpeedTextFieldInput(songMetadataFetched?.speed || 0)
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
            <DialogTitle>{t("MenuButton.details")}</DialogTitle>
            <DialogContent>
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
                <DialogContentText className={classes.arranger}>
                    {t("Song.arranger") + ": " + arrangerTextFieldInput}
                </DialogContentText>
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
            </DialogContent>
            <DialogActions>
                {isLoadingPatch || isLoadingGet ? (
                    <CircularProgress aria-label="Loading" size={24} />
                ) : (
                    <DialogButton
                        disabled={!songNameTextFieldInput.trim()}
                        buttonText={t("Modal.save")}
                        isCancelButton={false}
                    />
                )}
                <DialogButton
                    buttonText={t("Modal.cancel")}
                    onClick={() => {
                        handleOnCancelClick()
                        setSongNameTextFieldInput("")
                        setArrangerTextFieldInput("")
                        setComposerTextFieldInput("")
                        setSongNotesTextFieldInput("")
                        setSpeedTextFieldInput(0)
                    }}
                    isCancelButton
                />
            </DialogActions>
        </form>
    )
}
