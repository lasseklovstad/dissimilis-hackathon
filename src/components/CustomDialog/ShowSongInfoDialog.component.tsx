import React, { useEffect, useState } from "react"
import {
    makeStyles,
    DialogContent,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Grid,
} from "@material-ui/core"

import { useGetSongMetadata } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { colors } from "../../utils/colors"

const useStyles = makeStyles((theme) => {
    return {
        container: {
            width: "100%",
        },
        info: {
            color: colors.gray_500,
        },
        data: {
            color: colors.black,
        },
        row: {
            marginBottom: theme.spacing(2),
            width: "100%",
        },
    }
})

export const ShowSongInfoDialog = (props: {
    songId: number

    handleOnCancelClick: () => void
}) => {
    const {
        songId,

        handleOnCancelClick,
    } = props
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [speedTextFieldInput, setSpeedTextFieldInput] = useState<number>(0)
    const { t } = useTranslation()

    const { songMetadataFetched } = useGetSongMetadata(songId.toString())

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
        <>
            <DialogTitle>{t("Dialog.details")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid
                        container
                        justify="center"
                        className={classes.container}
                    >
                        <Grid container className={classes.row} xs={12} sm={12}>
                            <Grid item xs={12} sm={4} className={classes.info}>
                                {t("Dialog.nameOfSong") + ": "}
                            </Grid>
                            <Grid item xs={12} sm={8} className={classes.data}>
                                {songNameTextFieldInput}
                            </Grid>
                        </Grid>
                        <Grid container className={classes.row} xs={12} sm={12}>
                            <Grid item xs={12} sm={4} className={classes.info}>
                                {t("Song.arranger") + ": "}
                            </Grid>
                            <Grid item xs={12} sm={8} className={classes.data}>
                                {arrangerTextFieldInput}
                            </Grid>
                        </Grid>
                        <Grid container className={classes.row} xs={12} sm={12}>
                            <Grid item xs={12} sm={4} className={classes.info}>
                                {t("Song.composer") + ": "}
                            </Grid>
                            <Grid item xs={12} sm={8} className={classes.data}>
                                {composerTextFieldInput}
                            </Grid>
                        </Grid>
                        <Grid container className={classes.row} xs={12} sm={12}>
                            <Grid item xs={12} sm={4} className={classes.info}>
                                {t("Song.songSpeed") + ": "}
                            </Grid>
                            <Grid item xs={12} sm={8} className={classes.data}>
                                {speedTextFieldInput}
                            </Grid>
                        </Grid>
                        <Grid container className={classes.row} xs={12} sm={12}>
                            <Grid item xs={12} sm={4} className={classes.info}>
                                {t("Song.songNotes") + ": "}
                            </Grid>
                            <Grid item xs={12} sm={8} className={classes.data}>
                                {songNotesTextFieldInput}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={handleOnCancelClick}>
                    {t("Dialog.close")}
                </DialogButton>
            </DialogActions>
        </>
    )
}
