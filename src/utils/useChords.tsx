import { getNotesFromChord } from "../models/commonChords"
import { IBar, IChord } from "../models/IBar"
import { ChordType, IChordMenuOptions } from "../models/IChordMenuOptions"
import { ISong } from "../models/ISong"
import { ChordMenuAction } from "../views/SongView/ChordMenuOptions.component"
import { useDeleteChord, useUpdateChord } from "./useApiServiceSongs"
import { useVoice } from "./useVoice"
import { SongAction } from "../context/song/songReducer"
import { useSelectedChordContext } from "../context/selectedChord/SelectedChordContextProvider.component"

export const useChords = (
    song: ISong | undefined,
    chordMenuOptions: IChordMenuOptions | undefined,
    dispatchChordMenuOptions: React.Dispatch<ChordMenuAction>,
    dispatchSong: React.Dispatch<SongAction>
) => {
    const { selectedChord, setSelectedChord } = useSelectedChordContext()

    const { updateChord } = useUpdateChord()
    const { deleteChord } = useDeleteChord()

    const handleChangeChord = (chord: string) => {
        if (selectedChord) {
            // makeChordUpdate(
            //     chord,
            //     chordMenuOptions!!.chordLength,
            //     selectedChordPosition!!,
            //     chordMenuOptions!!.chordType
            // )
        } else {
            const notes = getNotesFromChord(chord)
            dispatchChordMenuOptions({
                type: "UPDATE_CHORD",
                chord,
                chordNotes: notes as string[],
            })
        }
    }

    const makeChordUpdate = async (
        chord: string | null,
        length: number,
        position: number,
        chordType: ChordType,
        chordNotes?: string[]
    ) => {
        // const notes = chordNotes
        //     ? chordNotes
        //     : chordType === ChordType.NOTE
        //     ? [chord]
        //     : null
        // const chordName = chordType === ChordType.CHORD ? chord : null
        //
        // const { error, result } = await updateChord.run(selectedChord, {
        //     position,
        //     length,
        //     notes,
        //     chordName,
        // })
        //
        // if (!error && result) {
        //     const createdChord = result.data.chords.find(
        //         (c) => c.position === position
        //     )
        //     if (createdChord) {
        //         dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        //         dispatchChordMenuOptions({
        //             type: "UPDATE_OPTIONS",
        //             menuOptions: {
        //                 chordLength: length,
        //                 chord: chord,
        //                 chordType: chordType,
        //                 chordNotes: createdChord.notes,
        //             },
        //         })
        //         setValuesForSelectedChord(
        //             createdChord.chordId,
        //             result.data.barId,
        //             position
        //         )
        //     }
        // }
    }

    const handleChangeChordLength = (updatedChordLength: number) => {
        // if (selectedChordId && selectedVoiceId && selectedBarId) {
        //     const selectedBar = selectedVoice?.bars.find(
        //         (b) => b.barId === selectedBarId
        //     )
        //     const note = selectedBar?.chords.find(
        //         (b) => b.chordId === selectedChordId
        //     )
        //     if (selectedBar && note && note.length > updatedChordLength) {
        //         makeChordUpdate(
        //             chordMenuOptions!!.chord,
        //             updatedChordLength,
        //             note.position,
        //             chordMenuOptions!!.chordType
        //         )
        //     } else if (selectedBar) {
        //         updateChordLengthIfPossible(
        //             reduceChordsAndNotes(selectedBar),
        //             updatedChordLength
        //         )
        //     }
        // } else {
        //     dispatchChordMenuOptions({
        //         type: "UPDATE_CHORD_LENGTH",
        //         length: updatedChordLength,
        //     })
        // }
    }

    const reduceChordsAndNotes = (selectedBar: IBar) => {
        return selectedBar.chords.reduce((noter: IChord[], note) => {
            if (note.notes[0] === "Z") {
                const numberOfRests = note.length
                const rests = []
                for (let i = 0; i < numberOfRests; i++) {
                    rests.push({
                        length: 1,
                        notes: ["Z"],
                        position: note.position + i,
                        chordId: null,
                        chordName: "",
                    })
                }
                return [...noter, ...rests]
            }
            const numberOfChords = note.length
            const notes = []
            for (let i = 0; i < numberOfChords; i++) {
                notes.push(note)
            }
            return [...noter, ...notes]
        }, [])
    }

    const updateChordLengthIfPossible = (
        allChords: IChord[],
        updatedChordLength: number
    ) => {
        // let indexOfChord = allChords.findIndex(
        //     (c) => c.chordId === selectedChordId
        // )
        // let i = 0
        // while (i <= updatedChordLength) {
        //     const start = indexOfChord - i
        //     const end = start + updatedChordLength
        //     const interval = allChords.slice(start, end)
        //     const isOnlyRests =
        //         interval.findIndex(
        //             (currentChord) =>
        //                 currentChord.chordId !== selectedChordId &&
        //                 currentChord.notes[0] !== "Z"
        //         ) === -1
        //     if (isOnlyRests && interval.length === updatedChordLength) {
        //         makeChordUpdate(
        //             chordMenuOptions!!.chord,
        //             updatedChordLength,
        //             start,
        //             chordMenuOptions!!.chordType
        //         )
        //         break
        //     }
        //     i++
        // }
    }

    const handleNoteSelectedChange = (chordType: ChordType) => {
        // let chord
        // if (chordType === ChordType.NOTE) {
        //     chord = chordMenuOptions!!.chord?.includes("#")
        //         ? chordMenuOptions!!.chord.substring(0, 2)
        //         : chordMenuOptions!!.chord?.charAt(0) || null
        // } else {
        //     chord = chordMenuOptions!!.chord
        // }
        // if (selectedChordId && selectedVoiceId) {
        //     makeChordUpdate(
        //         chord,
        //         chordMenuOptions!!.chordLength,
        //         selectedChordPosition!!,
        //         chordType
        //     )
        // } else {
        //     const notes =
        //         chordType === ChordType.CHORD
        //             ? getNotesFromChord(chord)
        //             : [chord]
        //     dispatchChordMenuOptions({
        //         type: "UPDATE_OPTIONS",
        //         menuOptions: {
        //             chordLength: chordMenuOptions!!.chordLength,
        //             chord: chord,
        //             chordType: chordType,
        //             chordNotes: notes as string[],
        //         },
        //     })
        // }
    }

    const handleChordNotesChange = (clickedNote: string, checked: boolean) => {
        // if (!checked && chordMenuOptions!!.chordNotes.length > 1) {
        //     const updatedChordNotes = chordMenuOptions!!.chordNotes.filter(
        //         (note) => note !== clickedNote
        //     )
        //     makeChordUpdate(
        //         chordMenuOptions!!.chord,
        //         chordMenuOptions!!.chordLength,
        //         selectedChordPosition!!,
        //         ChordType.CHORD,
        //         updatedChordNotes
        //     )
        // }
        // if (checked) {
        //     const activeChordNotes = getNotesFromChord(chordMenuOptions!!.chord)
        //     let activeChordIndex = 0
        //     let insertIndex = 0
        //
        //     while (activeChordIndex < activeChordNotes.length) {
        //         if (activeChordNotes[activeChordIndex] === clickedNote) {
        //             break
        //         }
        //         if (
        //             activeChordNotes[activeChordIndex] ===
        //             chordMenuOptions!!.chordNotes[insertIndex]
        //         ) {
        //             insertIndex++
        //         }
        //         activeChordIndex++
        //     }
        //
        //     let updatedChordNotes = [...chordMenuOptions!!.chordNotes]
        //     updatedChordNotes.splice(insertIndex, 0, clickedNote)
        //
        //     makeChordUpdate(
        //         chordMenuOptions!!.chord,
        //         chordMenuOptions!!.chordLength,
        //         selectedChordPosition!!,
        //         ChordType.CHORD,
        //         updatedChordNotes
        //     )
        // }
    }

    const handleDeleteSelectedChord = async () => {
        if (selectedChord) {
            const { error, result } = await deleteChord.run(selectedChord)
            if (!error && result) {
                setSelectedChord(null)
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
    }

    return {
        handleChangeChord,
        handleChangeChordLength,
        handleChordNotesChange,
        handleDeleteSelectedChord,
        makeChordUpdate,
        handleNoteSelectedChange,
        deleteChord,
        reduceChordsAndNotes,
        updateChordLengthIfPossible,
    }
}
