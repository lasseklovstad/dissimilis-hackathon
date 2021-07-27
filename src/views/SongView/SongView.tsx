import React, { MutableRefObject, useEffect, useRef } from "react"
import { Grid, makeStyles, Slide, useScrollTrigger } from "@material-ui/core"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { useBarsPerRow } from "../../utils/useBars"
import { Song } from "../../components/Song/Song.component"
import { useChords } from "../../utils/useChords"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { useSongContext } from "./SongContextProvider.component"
import { chords, notes } from "../../models/chords"
import { colors } from "../../utils/colors"
import { ChordType } from "../../models/IChordMenuOptions"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"
import { useVoice } from "../../utils/useVoice"

const useStyles = makeStyles({
    root: {
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
    },
    header: {
        backgroundColor: colors.gray_100,
        position: "sticky", // For Safari: -webkit-sticky
        zIndex: 100,
        top: "0",
        paddingTop: "24px",
        paddingLeft: "3.5vw",
        paddingRight: "3.5vw",
    },
    body: {
        marginLeft: "3.5vw",
        marginRight: "3.5vw",
    },
})

const heightOfBar = 185

export const SongView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { songId: songIdString } = useParams<{ songId: string }>()
    const songId = Number(songIdString)
    const { getSong, songInit } = useGetSong(songId)
    const barsPerRow = useBarsPerRow()
    const trigger = useScrollTrigger()
    const chordOptionsRef = useRef() as MutableRefObject<HTMLAnchorElement>

    const { song, dispatchSong, chordMenuOptions } = useSongContext()
    const { denominator, numerator, voices } = song!!
    const mainVoice = voices.find((voice) => voice.isMain)
    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return mainVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }

    useEffect(() => {
        if (songInit) {
            console.log("Jepp")
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit, dispatchSong])

    console.log("Song: ", song, "Voices: ", voices)

    const selectedVoice = useVoice(song!!.voices)

    const { songVoiceId: selectedVoiceId } = selectedVoice || {}

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <>
            <ErrorDialog
                isError={getSong.isError}
                error={getSong.error}
                title={t("Dialog.getSongError")}
            />

            {selectedVoiceId !== undefined && selectedVoice && (
                <Grid container className={classes.root}>
                    <Slide appear={false} direction="down" in={!trigger}>
                        <Grid container className={classes.header}>
                            <Grid item xs={12}>
                                <SongNavBar />
                            </Grid>
                            <Grid item xs={12}>
                                <CreateSongTab
                                    songId={songId}
                                    selectedVoiceId={selectedVoiceId}
                                />
                            </Grid>
                        </Grid>
                    </Slide>
                    <Grid item xs={12} className={classes.body}>
                        <Song
                            barsPerRow={barsPerRow}
                            voice={selectedVoice}
                            getChordNameFromMainVoice={
                                getChordNameFromMainVoice
                            }
                            timeSignature={{ denominator, numerator }}
                            heightOfBar={heightOfBar}
                            exportMode={false}
                            lastPage={true}
                        />
                    </Grid>
                </Grid>
            )}
            {selectedVoiceId && (
                <BottomBar
                    voiceId={selectedVoiceId}
                    chordDropdownContent={
                        chordMenuOptions?.chordType === ChordType.NOTE
                            ? notes
                            : chords
                    }
                    chordOptionsRef={chordOptionsRef}
                />
            )}
        </>
    )
}
