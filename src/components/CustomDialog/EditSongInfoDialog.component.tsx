import React, { useEffect, useState } from "react"
import {
    Button,
    CircularProgress,
    Grid,
    makeStyles,
    DialogContent,
    TextField,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"
import { useGetSongMetadata } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => {
    return {
        gridItem: {
            marginBottom: theme.spacing(4),
        },
        textFields: {
            marginBottom: theme.spacing(0.5),
        },
        button: {
            "&:hover": {
                backgroundColor: colors.gray_300,
            },
            marginRight: "8px",
            float: "left",
            position: "relative",
        },
        arranger: {
            marginBottom: theme.spacing(4),
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
    isLoadingPatch?: boolean
}) => {
    const classes = useStyles()
    const [songNameTextFieldInput, setSongNameTextFieldInput] = useState("")
    const [arrangerTextFieldInput, setArrangerTextFieldInput] = useState("")
    const [composerTextFieldInput, setComposerTextFieldInput] = useState("")
    const [songNotesTextFieldInput, setSongNotesTextFieldInput] = useState("")
    const [speedTextFieldInput, setSpeedTextFieldInput] = useState<number>(0)
    const { t } = useTranslation()

    const { songId } = props

    const { getSongMetadata, songMetadataFetched } = useGetSongMetadata(
        songId.toString()
    )

    const isLoadingGet = getSongMetadata.loading

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit
    const NUMBER_MAX = props.numberLimit === undefined ? 256 : props.numberLimit
    const NUMBER_MIN = 1

    useEffect(() => {
        if (songMetadataFetched?.title) {
            setSongNameTextFieldInput(songMetadataFetched.title)
        }
        if (songMetadataFetched?.arrangerName) {
            setArrangerTextFieldInput(songMetadataFetched.arrangerName)
        }
        if (songMetadataFetched?.composer) {
            setComposerTextFieldInput(songMetadataFetched.composer)
        }
        if (songMetadataFetched?.songNotes) {
            setSongNotesTextFieldInput(songMetadataFetched.songNotes)
        }
        if (songMetadataFetched?.speed) {
            setSpeedTextFieldInput(songMetadataFetched.speed)
        }
    }, [songMetadataFetched])

    return (
        <DialogContent
            style={{
                padding: "40px",
            }}
        >
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
                            speedTextFieldInput
                        )
                    }}
                >
                    <Grid container>
                        <Typography className={classes.title} variant="h2">
                            {props.headerText}
                        </Typography>
                        <Grid className={classes.gridItem} item xs={12}>
                            <TextField
                                id="song-info-modal-song-name-textfield"
                                inputProps={{
                                    maxLength: CHARACTER_LIMIT,
                                }}
                                helperText={`${songNameTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                autoFocus
                                variant="filled"
                                value={songNameTextFieldInput}
                                onChange={(e) => {
                                    setSongNameTextFieldInput(e.target.value)
                                }}
                                label={props.songNameLabelText}
                                style={{
                                    width: "100%",
                                }}
                            />
                            <Typography className={classes.arranger}>
                                {t("Song.arranger") +
                                    ": " +
                                    arrangerTextFieldInput}
                            </Typography>
                            <TextField
                                id="song-info-modal-composer-textfield"
                                inputProps={{
                                    maxLength: CHARACTER_LIMIT,
                                }}
                                helperText={`${composerTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                className={classes.textFields}
                                autoFocus
                                value={composerTextFieldInput}
                                variant="filled"
                                onChange={(e) => {
                                    setComposerTextFieldInput(e.target.value)
                                }}
                                label={props.composerLabelText}
                                style={{ width: "100%" }}
                            />
                            <TextField
                                id="song-info-modal-song-speed-textfield"
                                autoFocus
                                value={speedTextFieldInput}
                                className={classes.textFields}
                                helperText={t("Song.bpm")}
                                variant="filled"
                                onChange={(e) => {
                                    e.target.value = Math.max(
                                        NUMBER_MIN,
                                        Math.min(
                                            NUMBER_MAX,
                                            parseInt(e.target.value)
                                        )
                                    ).toString()
                                    setSpeedTextFieldInput(
                                        parseInt(e.target.value)
                                    )
                                }}
                                label={props.speedLabelText}
                                style={{ width: "100%" }}
                                type="number"
                            />
                            <TextField
                                id="song-info-modal-song-notes-textfield"
                                inputProps={{
                                    maxLength: CHARACTER_LIMIT,
                                }}
                                className={classes.textFields}
                                helperText={`${songNotesTextFieldInput.length}/${CHARACTER_LIMIT}`}
                                autoFocus
                                multiline
                                value={songNotesTextFieldInput}
                                variant="filled"
                                onChange={(e) => {
                                    setSongNotesTextFieldInput(e.target.value)
                                }}
                                label={props.songNotesLabelText}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                {props.isLoadingPatch || isLoadingGet ? (
                                    <Grid container className={classes.loading}>
                                        <CircularProgress size={24} />
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <Button
                                            className={classes.button}
                                            size="large"
                                            variant="contained"
                                            disabled={!songNameTextFieldInput}
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
                                            setSongNameTextFieldInput("")
                                            setArrangerTextFieldInput("")
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
        </DialogContent>
    )
}
