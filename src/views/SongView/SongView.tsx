import React, { useEffect, useReducer, useState } from "react"
import { Grid, makeStyles } from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavBarCreateSong } from "../../components/NavBarCreateSong/NavBarCreateSong.component"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { Song } from "../../components/Song/Song.component"
import { useBarsPerRow } from "../../utils/useBarsPerRow"
import { useVoice } from "../../utils/useVoice"
import { ISong } from "../../models/ISong"
import { useGetSong, useUpdateNote, useUpdateSong } from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { SongContext, songReducer } from "./SongContextProvider.component"
import { IVoice } from "../../models/IVoice"

const useStyles = makeStyles({
    root: {
        marginLeft: "16px",
        marginTop: "32px",
        marginRight: "16px",
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
    },
})

const heightOfBar = 160

export const SongView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = useParams<{ songId: string }>()
    const { getSong, songInit } = useGetSong(songId)
    const barsPerRow = useBarsPerRow()
    const [selectedChord, setSelectedChord] = useState("C")
    const [selectedNoteLength, setSelectedNoteLength] = useState(1)
    const [isNoteSelected, setNoteIsSelected] = useState(true)
    const { putSong } = useUpdateSong(songId)
    const [selectedNoteId, setSelectedNoteId] = useState<number | undefined>(
        undefined
    )
    // Må legge til rette så jeg kan bruke valgt voice og valgt bar til dette api kallet
    // const {updateNote} = useUpdateNote(songId, songVoiceId, barId, selectedNoteId)

    const updateSelectedNoteId = (id: number | undefined) => {
        setSelectedNoteId(id)
    }

    const [song, dispatchSong] = useReducer(songReducer, {
        title: "",
        songId: 0,
        denominator: 4,
        numerator: 4,
        voices: [],
    } as ISong)

    const { denominator, numerator, voices } = song
    const selectedVoiceId = useVoice(voices)
    const selectedVoice = voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )

    const handleChangeChord = () => {
        if(selectedNoteId) {
            
        // const { error, result } = await postChord.run({
        //     position:
        //         positionArray.length > 0 ? positionArray[0] : position,
        //     length: selectedNoteLength,
        //     notes,
        // } as IChordAndNotes)

        // if (!error && result) {
        //     dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        // } 
        }
        // selectedChord holder informasjon om hvilken chord som er valgt
        // selectedNoteId holder informasjon om hvilken note som er valgt
    }

    // Denne skal oppdatere sangen
    useEffect(() => {
        
    }, [selectedChord])

    useEffect(() => {
        if (songInit) {
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit])

    const handleTitleBlur = async (title: string) => {
        if (title !== song.title) {
            const { error, result } = await putSong.run({ title })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

    const handleAddVoice = (voice: IVoice) => {
        dispatchSong({ type: "ADD_VOICE", voice })
        history.push(`?voice=${voice.songVoiceId}`)
    }

    const handleDeleteVoice = (voice: IVoice) => {
        dispatchSong({ type: "DELETE_VOICE", songVoiceId: voice.songVoiceId })
    }

    const handleUpdateVoice = (voice: IVoice) => {
        dispatchSong({ type: "UPDATE_VOICE", voice })
    }

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <>
            <ErrorDialog
                isError={getSong.isError}
                error={getSong.error}
                title={t("Modal:getSongError")}
            />

            {selectedVoiceId !== undefined && selectedVoice && (
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <NavBarCreateSong
                            title={song.title}
                            onTitleBlur={handleTitleBlur}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CreateSongTab
                            onDeleteVoice={handleDeleteVoice}
                            onUpdateVoice={handleUpdateVoice}
                            onAddVoice={handleAddVoice}
                            songId={songId}
                            voices={song.voices}
                            selectedVoice={selectedVoiceId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SongContext.Provider
                            value={{
                                dispatchSong,
                                selectedChord,
                                selectedNoteLength,
                                isNoteSelected,
                            }}
                        >
                            <Song
                                barsPerRow={barsPerRow}
                                voice={selectedVoice}
                                timeSignature={{ denominator, numerator }}
                                heightOfBar={heightOfBar}
                                exportMode={false}
                                setSelectedNoteId={updateSelectedNoteId}
                                selectedNoteId={selectedNoteId}
                            />
                        </SongContext.Provider>
                    </Grid>
                </Grid>
            )}

            {selectedVoiceId && (
                <BottomBar
                    noteIsSelected={isNoteSelected}
                    onNoteSelectedChange={(selected) =>
                        setNoteIsSelected(selected)
                    }
                    selectedChord={selectedChord}
                    onChordChange={(chord) => setSelectedChord(chord)}
                    selectedNoteLength={selectedNoteLength}
                    onNoteLengthChange={(length) =>
                        setSelectedNoteLength(length)
                    }
                    timeSignature={{ denominator, numerator }}
                    addBar={(bar) => dispatchSong({ type: "ADD_BAR", bar })}
                    songId={songId}
                    voiceId={selectedVoiceId}
                    selectedNoteId={selectedNoteId}
                />
            )}
        </>
    )
}
