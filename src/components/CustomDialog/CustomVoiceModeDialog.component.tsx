import React, { useCallback, useEffect, useState } from "react"
import {
    Box,
    DialogActions,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"

import { IVoice } from "../../models/IVoice"
import { colors } from "../../utils/colors"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { useBarsPerRow } from "../../utils/useBars"

import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { Song } from "../Song/Song.component"
import { ChordOptions } from "../BottomMenuButtons/BottomMenuButtons"

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
    songId: string
    baseVoice: IVoice
    newVoice: IVoice | undefined
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { handleOnCancel, handleOnSave, songId, baseVoice, newVoice } = props
    const { songInit } = useGetSong(songId)
    const [indexArray, setindexArray] = useState<("checked"|"notChecked"|"indeterminiate")[]>([]);

    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return baseVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }
    useEffect(() => {
        if(getBiggestChordInSong().showMenu){
            setindexArray(new Array(getBiggestChordInSong().value).fill("notChecked"))

        }
    }, []);

    const { song } = useSongContext()
    const barsPerRow = useBarsPerRow()
    console.log(indexArray)
    const getBiggestChordInSong = useCallback(
        () =>{
            var biggestChordLength = 0
            var chordName ="";
            baseVoice.bars.forEach(bar => {
                bar.chords.forEach(chord => {
                    if (biggestChordLength < chord.notes.length && chord.chordName!== null) {
                        biggestChordLength = chord.notes.length;
                        chordName = chord.chordName;
                    }
                })
            });
            console.log(chordName)
            return {showMenu: biggestChordLength!= 0 , biggestChordName: chordName, value: biggestChordLength}
        }, []
        );

    const changeComponentInterval = (index: number)=>{
        var array = indexArray
        array[index] = "checked";
        setindexArray(array);
        console.log(index)
    }

    return (
        <>
            <Box pl={6}>
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
                    <Grid item xs={10} className={classes.outercontainer}>
                        <Box className={classes.container}>
                            <ChordOptions
                                chord={getBiggestChordInSong().biggestChordName}
                                customMode= {true}
                                onChordNotesChange={()=> {}}
                                alwaysShow={getBiggestChordInSong().showMenu}
                                indexArray={indexArray}
                                changeComponentInterval={changeComponentInterval}
                            />
                            {//console.log(baseVoice.bars.filter(bars => bars.chords.some(chord => chord.chordName !== null)).length)
                            }
                            
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
