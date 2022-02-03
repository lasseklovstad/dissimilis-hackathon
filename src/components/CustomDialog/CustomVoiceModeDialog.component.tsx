import React, { useCallback, useEffect, useState } from "react"
import { Box, DialogActions, Grid, Typography } from "@mui/material"

import makeStyles from "@mui/styles/makeStyles"

import { useTranslation } from "react-i18next"

import { IVoice } from "../../models/IVoice"
import { colors } from "../../utils/colors"
import {
    useAddComponentInterval,
    useRemoveComponentInterval,
} from "../../utils/useApiServiceSongs"
import { useBarsPerRow } from "../../utils/useBars"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { Song } from "../Song/Song.component"
import { ChordOptions } from "../BottomMenuButtons/BottomMenuButtons"
import { useSongContext } from "../../views/SongView/SongContextProvider.component"

const useStyles = makeStyles(() => {
    return {
        body: {
            marginLeft: "3.5vw",
            marginRight: "3.5vw",
        },
        container: {
            boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.1)",
            backgroundColor: colors.white,
            marginBottom: "8px",
        },
        buttonContainer: {
            marginBottom: "8px",
            padding: "0",
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
        removeDefaultStyling: {
            "& .MuiOutlinedInput-notchedOutline": {
                border: "0",
            },
        },
        confirmOrCancelButtons: {
            height: "56px",
        },
        confirmButton: {
            backgroundColor: colors.teal_100,
            marginRight: 8,
        },
    }
})

export const CustomVoiceDialog = (props: {
    handleOnSave: () => void
    handleOnCancel: () => void
    baseVoice: IVoice
    newVoice: IVoice
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { song } = useSongContext()
    const { handleOnCancel, handleOnSave, baseVoice, newVoice } = props
    const [voice, setVoice] = useState(baseVoice)
    const [indexArray, setIndexArray] = useState<boolean[]>([])
    const { addInterval } = useAddComponentInterval(
        newVoice.songId,
        newVoice.songVoiceId
    )
    const { removeInterval } = useRemoveComponentInterval(
        newVoice.songId,
        newVoice.songVoiceId
    )

    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return baseVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }

    const barsPerRow = useBarsPerRow()
    const getBiggestChordInSong = useCallback(() => {
        let biggestChordLength = 0
        let chordName = ""
        baseVoice.bars.forEach((bar) => {
            bar.chords.forEach((chord) => {
                if (
                    biggestChordLength <
                        chord.notes.filter((note) => note !== "X").length &&
                    chord.chordName !== null
                ) {
                    biggestChordLength = chord.notes.length
                    chordName = chord.chordName
                }
            })
        })
        return {
            showMenu: biggestChordLength !== 0,
            biggestChordName: chordName,
            value: biggestChordLength,
        }
    }, [baseVoice.bars])

    useEffect(() => {
        if (getBiggestChordInSong().showMenu) {
            setIndexArray(new Array(getBiggestChordInSong().value).fill(false))
        }
    }, [getBiggestChordInSong])

    const changeComponentInterval = async (index: number) => {
        var array = indexArray
        if (array[index]) {
            const { error, result } = await removeInterval.run({
                intervalPosition: index,
                deleteChordsOnLastIntervalRemoved: true,
            })
            if (!error && result) {
                array[index] = false
                setVoice(mergeOrignalVoiceWithUpdatedVoice(voice, result.data))
            }
        } else {
            const { error, result } = await addInterval.run({
                intervalPosition: index,
                sourceVoiceId: baseVoice.songVoiceId,
            })
            if (!error && result) {
                array[index] = true
                setVoice(mergeOrignalVoiceWithUpdatedVoice(voice, result.data))
            }
        }
        setIndexArray(array)
    }

    const mergeOrignalVoiceWithUpdatedVoice = (
        originalVoice: IVoice,
        updatedVoice: IVoice
    ): IVoice => {
        return {
            ...originalVoice,
            bars: originalVoice.bars.map((bar, barIndex) => {
                return {
                    ...bar,
                    chords: bar.chords.map((chord, chordIndex) => {
                        const selectedChord =
                            updatedVoice.bars[barIndex].chords[chordIndex]
                        return { ...chord, selectedNotes: selectedChord?.notes }
                    }),
                }
            }),
        }
    }

    return (
        <>
            <Box pl={6}>
                <Typography variant="h1">{newVoice?.voiceName}</Typography>
            </Box>
            <Grid item xs={12} className={classes.body}>
                <Song
                    barsPerRow={barsPerRow}
                    voice={voice}
                    getChordNameFromMainVoice={getChordNameFromMainVoice}
                    timeSignature={{
                        numerator: song?.numerator || 4,
                        denominator: song?.denominator || 4,
                    }}
                    heightOfBar={185}
                    lastPage={false}
                />
            </Grid>
            <Grid
                container
                className={`mui-fixed ${classes.positioningContainer}`}
            >
                <Grid container justifyContent="center">
                    <Grid item xs={10} className={classes.outercontainer}>
                        <Box className={classes.container}>
                            <ChordOptions
                                chord={getBiggestChordInSong().biggestChordName}
                                customMode
                                onChordNotesChange={() => {}}
                                alwaysShow={getBiggestChordInSong().showMenu}
                                indexArray={indexArray}
                                changeComponentInterval={
                                    changeComponentInterval
                                }
                            />
                        </Box>
                        <DialogActions className={classes.buttonContainer}>
                            <DialogButton
                                className={`${classes.confirmOrCancelButtons} ${classes.confirmButton}`}
                                onClick={handleOnSave}
                                variant="contained"
                            >
                                {t("Dialog.save")}
                            </DialogButton>
                            <DialogButton
                                className={classes.confirmOrCancelButtons}
                                onClick={handleOnCancel}
                                variant="contained"
                            >
                                {t("Dialog.cancel")}
                            </DialogButton>
                        </DialogActions>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
