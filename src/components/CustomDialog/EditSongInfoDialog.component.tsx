import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    makeStyles,
    DialogContent,
    DialogActions,
    TextField,
    DialogTitle,
    DialogContentText,
} from "@material-ui/core"

import { useGetSongMetadata } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

const useStyles = makeStyles((theme) => {
    return {
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
        arranger: {
            marginBottom: theme.spacing(4),
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
            <DialogTitle>{t("Dialog.details")}</DialogTitle>
            <DialogContent>
                <TextField
                    id="song-info-dialog-song-name-textfield"
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
                    label={t("Dialog.nameOfSong")}
                    fullWidth={true}
                />
                <DialogContentText className={classes.arranger}>
                    {t("Song.arranger") + ": " + arrangerTextFieldInput}
                </DialogContentText>
                <TextField
                    id="song-info-dialog-composer-textfield"
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
                    fullWidth={true}
                />
                <TextField
                    id="song-info-dialog-song-speed-textfield"
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
                    fullWidth={true}
                    type="number"
                />
                <TextField
                    id="song-info-dialog-song-notes-textfield"
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
                    fullWidth={true}
                />
            </DialogContent>
            <DialogActions>
                {isLoadingPatch || isLoadingGet ? (
                    <CircularProgress aria-label="Loading" size={24} />
                ) : (
                    <DialogButton
                        disabled={!songNameTextFieldInput.trim()}
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.save")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
