import React, { useEffect, useRef, useState } from "react"

interface ISongToolsContext {
    selectedNoteLength: 1 | 2 | 4 | 8
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => void
    selectedNoteKey: string
    setSelectedNoteKey: (string: string) => void
    showPossiblePositions: boolean
    setShowPossiblePositions: (show: boolean) => void
    noteIsSelected: boolean
    setNoteIsSelected: (show: boolean) => void
    availablePositions: number[][][][]
    setAvailablePositions: (number: number[][][][]) => void
    insertNewNoteOrChord: (
        noteIndex: number,
        barIndex: number,
        voiceIndex: number
    ) => void
    calculateAvailableSpace: () => void
    selectPositionArray: (
        voiceIndex: number,
        barIndex: number,
        noteIndex: number
    ) => number[]
}

export const SongToolsContext = React.createContext<ISongToolsContext>({
    selectedNoteLength: 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => {},
    selectedNoteKey: "C",
    setSelectedNoteKey: (string: string) => {},
    showPossiblePositions: false,
    setShowPossiblePositions: (show: boolean) => {},
    noteIsSelected: false,
    setNoteIsSelected: (show: boolean) => {},
    availablePositions: [],
    setAvailablePositions: (number: number[][][][]) => {},
    insertNewNoteOrChord: (
        noteIndex: number,
        barIndex: number,
        voiceIndex: number
    ) => {},
    calculateAvailableSpace: () => {},
    selectPositionArray: (
        voiceIndex: number,
        barIndex: number,
        noteIndex: number
    ) => [],
})

export const SongToolsContextProvider: React.FC = (props) => {
    const [selectedNoteLength, setSelectedNoteLength] = useState<1 | 2 | 4 | 8>(
        1
    )
    const [selectedNoteKey, setSelectedNoteKey] = useState<string>("C")
    const [noteIsSelected, setNoteIsSelected] = useState<boolean>(false)
    const [showPossiblePositions, setShowPossiblePositions] = useState<boolean>(
        false
    )
    const [availablePositions, setAvailablePositions] = useState<
        number[][][][]
    >([])

    const isInitialMount = useRef(true)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        } else {
            calculateAvailableSpace()
        }
    }, [selectedNoteLength])

    /**
     * This method selects the right positions to replace based on the empty space clicked on.
     * It checks the availablePositionsArray (calculated by calculateAvailablePositions) for the list in which the noteindex has the lowest index of all possible possitionarrays.
     * This is because you want the new note to be placed where you click, or fill the entire right if not place from your click to the right.
     * @param voiceIndex
     * @param barIndex
     * @param noteIndex
     */
    const selectPositionArray = (
        voiceIndex: number,
        barIndex: number,
        noteIndex: number
    ) => {
        const availablePosArray = availablePositions[voiceIndex][barIndex] || []
        let selectedPosArray = availablePosArray.find((arr) =>
            arr.includes(noteIndex)
        )

        for (const arr of availablePosArray) {
            if (arr.includes(noteIndex)) {
                selectedPosArray = arr
            }
        }

        if (selectedPosArray === undefined || selectedPosArray === null) {
            return []
        }
        return selectedPosArray
    }

    /**
     * This method inserts a new note or chord
     * First it creates the new note
     * Then it takes a copy of the list of chords or notes in the bar
     * Further on it replaces the empty spaces with the new note
     * In the end it sends the new list of chordsAndNotes for the given bar to the method editNote()
     * @param noteIndex
     * @param barIndex
     * @param voiceIndex
     */
    const insertNewNoteOrChord = (
        noteIndex: number,
        barIndex: number,
        voiceIndex: number
    ) => {
        // let newNoteArray: string[] = ["C"]
        // if (noteIsSelected) {
        //     newNoteArray = [
        //         Object.values(notes)[
        //             Object.keys(notes).indexOf(selectedNoteKey)
        //         ],
        //     ]
        // } else {
        //     const newNoteObject = chords.find(
        //         (obj) => obj.name === selectedNoteKey
        //     )
        //     if (newNoteObject !== undefined) {
        //         newNoteArray = newNoteObject.notes
        //     } else newNoteArray = []
        // }
        // const newNote: IChordAndNotes = {
        //     length: selectedNoteLength,
        //     notes: newNoteArray,
        //     position: noteIndex,
        // }
        //
        // const tempChordsAndNotes = []
        // for (
        //     let i = 0;
        //     i < song.voices[voiceIndex].bars[barIndex].chordsAndNotes.length;
        //     i++
        // ) {
        //     tempChordsAndNotes.push(
        //         song.voices[voiceIndex].bars[barIndex].chordsAndNotes[i]
        //     )
        // }
        //
        // const selectedPosArray = selectPositionArray(
        //     voiceIndex,
        //     barIndex,
        //     noteIndex
        // )
        // if (selectedPosArray !== undefined) {
        //     for (let j = selectedPosArray.length - 1; j >= 0; j--) {
        //         if (selectedPosArray[j] === noteIndex) {
        //             tempChordsAndNotes.splice(selectedPosArray[j], 1, newNote)
        //         } else {
        //             tempChordsAndNotes.splice(selectedPosArray[j], 1)
        //         }
        //     }
        // }
        // // editNote(voiceIndex, barIndex, tempChordsAndNotes)
    }

    /**
     * This method returns an array consisting of an array of bars, one array for each voice.
     * This again includes a list of arrays, telling where it is space.
     * For example a halfnote which takes 4 places, can in an empty bar return the following list of positions (in a list for the voice it is placed in):
     * [[0,1,2,3], [1,2,3,4], [2,3,4,5], [3,4,5,6], [4,5,6,7]] - each list contains 4 indexes, as the halfnote takes 4 out of 8 places.
     * We have decided to use 8 as the denominator for each time signature as this makes it simpler for us, therefore allways 8 empty spaces in the bar.
     */
    const calculateAvailableSpace = () => {
        // const returnArray = []
        // for (
        //     let voiceIndex = 0;
        //     voiceIndex < song.voices.length;
        //     voiceIndex++
        // ) {
        //     const voiceArray = []
        //     for (
        //         let barIndex = 0;
        //         barIndex < song.voices[voiceIndex].bars.length;
        //         barIndex++
        //     ) {
        //         const barArray = []
        //         let availableConsistentLength = 0
        //         for (
        //             let noteIndex = 0;
        //             noteIndex <
        //             song.voices[voiceIndex].bars[barIndex].chordsAndNotes
        //                 .length;
        //             noteIndex++
        //         ) {
        //             if (
        //                 song.voices[voiceIndex].bars[barIndex].chordsAndNotes[
        //                     noteIndex
        //                 ].notes[0] === " "
        //             ) {
        //                 availableConsistentLength += 1
        //             } else {
        //                 availableConsistentLength = 0
        //             }
        //             if (availableConsistentLength === selectedNoteLength) {
        //                 const possibleposition = []
        //                 for (
        //                     let i = noteIndex - selectedNoteLength;
        //                     i < noteIndex;
        //                     i++
        //                 ) {
        //                     possibleposition.push(i + 1)
        //                 }
        //                 barArray.push(possibleposition)
        //                 availableConsistentLength -= 1
        //             }
        //         }
        //         voiceArray.push(barArray)
        //     }
        //     returnArray.push(voiceArray)
        // }
        // setAvailablePositions(returnArray)
    }

    /**
     * This is where all the methods given to other components through the context is declared
     */
    const value = {
        selectedNoteLength,
        setSelectedNoteLength,
        selectedNoteKey,
        setSelectedNoteKey,
        showPossiblePositions,
        setShowPossiblePositions,
        noteIsSelected,
        setNoteIsSelected,
        availablePositions,
        setAvailablePositions,
        insertNewNoteOrChord,
        calculateAvailableSpace,
        selectPositionArray,
    }

    return (
        <SongToolsContext.Provider value={value}>
            {props.children}
        </SongToolsContext.Provider>
    )
}
