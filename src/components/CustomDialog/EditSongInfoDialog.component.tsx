import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogContent,
    DialogActions,
    TextField,
    DialogTitle,
    DialogContentText,
} from "@mui/material"
import { useGetSongMetadata } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"

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
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [speedTextFieldInput, setSpeedTextFieldInput] = useState<number>(0)
    const { t } = useTranslation()

    const { getSongMetadata, songMetadataFetched } = useGetSongMetadata(songId)

    const isLoadingGet = getSongMetadata.loading

    useEffect(() => {
        if (songMetadataFetched) {
            const {
                title,
                arrangerName,
                arrangerEmail,
                composer,
                songNotes,
                speed,
            } = songMetadataFetched
            setSongNameTextFieldInput(title || "")
            setArrangerTextFieldInput(arrangerName || arrangerEmail || "")
            setComposerTextFieldInput(composer || "")
            setSongNotesTextFieldInput(songNotes || "")
            setSpeedTextFieldInput(speed || 0)
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
                    margin="normal"
                    value={songNameTextFieldInput}
                    onChange={(e) => {
                        setSongNameTextFieldInput(e.target.value)
                    }}
                    label={t("Dialog.nameOfSong")}
                    fullWidth
                />
                <DialogContentText sx={{ m: 1 }}>
                    {t("Song.arranger") + ": " + arrangerTextFieldInput}
                </DialogContentText>
                <TextField
                    id="song-info-dialog-composer-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    margin="normal"
                    helperText={`${composerTextFieldInput.length}/${characterLimit}`}
                    value={composerTextFieldInput}
                    variant="filled"
                    onChange={(e) => {
                        setComposerTextFieldInput(e.target.value)
                    }}
                    label={t("Song.composer")}
                    fullWidth
                />
                <TextField
                    id="song-info-dialog-song-speed-textfield"
                    value={speedTextFieldInput}
                    helperText={t("Song.bpm")}
                    variant="filled"
                    margin="normal"
                    onChange={(e) => {
                        e.target.value = Math.max(
                            numberMin,
                            Math.min(numberMax, parseInt(e.target.value))
                        ).toString()
                        setSpeedTextFieldInput(parseInt(e.target.value))
                    }}
                    label={t("Song.songSpeed")}
                    fullWidth
                    type="number"
                />
                <TextField
                    id="song-info-dialog-song-notes-textfield"
                    inputProps={{
                        maxLength: characterLimit,
                    }}
                    helperText={`${songNotesTextFieldInput.length}/${characterLimit}`}
                    multiline
                    margin="normal"
                    value={songNotesTextFieldInput}
                    variant="filled"
                    onChange={(e) => {
                        setSongNotesTextFieldInput(e.target.value)
                    }}
                    label={t("Song.songNotes")}
                    fullWidth
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
