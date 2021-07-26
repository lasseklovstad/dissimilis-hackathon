import React from "react"
import {
    Box,
    CircularProgress,
    DialogActions,
    Grid,
    makeStyles,
    Typography,
    withStyles,
} from "@material-ui/core"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import { Delete } from "@material-ui/icons"

import ToggleButton from "@material-ui/lab/ToggleButton"
import { useTranslation } from "react-i18next"
import { ChordType } from "../../models/IChordMenuOptions"

import { IVoice } from "../../models/IVoice"
import { colors } from "../../utils/colors"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { useBarsPerRow } from "../../utils/useBars"

import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { Song } from "../Song/Song.component"
import { ChordOptions } from "../BottomMenuButtons/BottomMenuButtons"

const useStyles = makeStyles((theme) => {
    return {
        root: {
            marginBottom: "200px",
            "@media (max-width: 1080px)": {
                marginBottom: "250px",
            },
            width: "auto",
        },
        body: {
            marginLeft: "3.5vw",
            marginRight: "3.5vw",
        },
        loading: {
            margin: theme.spacing(1),
            marginRight: theme.spacing(2),
            justifyContent: "center",
            alignContent: "center",
            minWidth: "64px",
            maxWidth: "64px",
        },
        container: {
            boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            backgroundColor: colors.white,
            marginBottom: "8px",
            marginLeft: "24px",
            marginRight: "24px",
        },
        flexelement: {
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            "& .Mui-selected": {
                color: colors.black,
            },
        },
        focusElement: {
            "&:focus": {
                boxShadow: `0 0 0 4px ${colors.focus}`,
            },
        },

        outercontainer: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            "@media (max-width: 960px)": {
                flexDirection: "column",
                marginBottom: "16px",
            },
        },

        positioningContainer: {
            width: "100%",
            position: "fixed",
            bottom: 0,
            left: 0,
            marginBottom: "24px",
        },

        input: {
            padding: "18px 10px 10px 18px",
            height: "28px",
            "&:focus": {
                outline: "none !important",
            },
        },
        removeDefaultStyling: {
            "& .MuiOutlinedInput-notchedOutline": {
                border: "0",
            },
        },
        selectIcon: {
            right: 14,
        },
    }
})

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        color: colors.black,
        margin: theme.spacing(1),
        border: "none",
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-child": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}))(ToggleButtonGroup)

export const CustomVoiceDialog = (props: {
    handleOnSave: () => void
    handleOnCancel: () => void
    songId: string
    baseVoice: IVoice
    newVoice: IVoice | undefined
}) => {
    const { t } = useTranslation()
    const { chordMenuOptions } = useSongContext()
    const classes = useStyles()
    const { handleOnCancel, handleOnSave, songId, baseVoice, newVoice } = props
    const { songInit /* , getSong  */ } = useGetSong(songId)

    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return baseVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }
    const { song } = useSongContext()
    const barsPerRow = useBarsPerRow()

    return (
        <>
            <Box m={2}>
                <Typography variant="h1">{newVoice?.voiceName}</Typography>
            </Box>
            <Grid item xs={12} className={classes.body}>
                <Song
                    barsPerRow={barsPerRow}
                    voice={song.voices[0]}
                    getChordNameFromMainVoice={getChordNameFromMainVoice}
                    timeSignature={{
                        numerator: songInit?.numerator || 4,
                        denominator: songInit?.denominator || 4,
                    }}
                    heightOfBar={185}
                    lastPage={false}
                />
            </Grid>
            <Grid
                container
                className={`mui-fixed ${classes.positioningContainer}`}
            >
                <Grid container justify="center">
                    <Grid
                        item
                        xs={12}
                        sm={10}
                        className={classes.outercontainer}
                    >
                        <div className={classes.container}>
                            <ChordOptions
                                chord={"Em"}
                                onChordNotesChange={() => {}}
                                alwaysShow={true}
                            />
                        </div>
                        <DialogActions>
                            {false ? (
                                <div className={classes.loading}>
                                    <CircularProgress size={24} />
                                </div>
                            ) : (
                                <DialogButton
                                    onClick={handleOnSave}
                                    variant="contained"
                                >
                                    LAGRE
                                </DialogButton>
                            )}

                            <DialogButton
                                onClick={handleOnCancel}
                                variant="contained"
                            >
                                AVBRYT
                            </DialogButton>
                        </DialogActions>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
