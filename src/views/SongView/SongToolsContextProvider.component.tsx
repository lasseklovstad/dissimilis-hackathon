import React, { useState, useContext } from 'react';
import { SongContext } from './SongContextProvider.component';
import { IChordAndNotes } from '../../models/IBar';
import { notes } from '../../models/notes';
import { chords } from '../../models/chords';


interface ISongToolsContext {
    selectedNoteLength: 1 | 2 | 4 | 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => void,
    selectedNoteKey: string,
    setSelectedNoteKey: (string: string) => void,
    showPossiblePositions: boolean,
    setShowPossiblePositions: (show: boolean) => void,
    availablePositions: number[][][][],
    setAvailablePositions: (number: number[][][][]) => void,
    insertNewNoteOrChord: (noteIndex: number, barIndex: number, voiceIndex: number) => void,
    showAvailableSpace: () => void,
    selectPositionArray: (voiceIndex: number, barIndex: number, noteIndex: number) => number[]
}

export const SongToolsContext = React.createContext<ISongToolsContext>({
    selectedNoteLength: 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => { },
    selectedNoteKey: "C",
    setSelectedNoteKey: (string: string) => { },
    showPossiblePositions: false,
    setShowPossiblePositions: (show: boolean) => { },
    availablePositions: [],
    setAvailablePositions: (number: number[][][][]) => { },
    insertNewNoteOrChord: (noteIndex: number, barIndex: number, voiceIndex: number) => { },
    showAvailableSpace: () => { },
    selectPositionArray: (voiceIndex: number, barIndex: number, noteIndex: number) => []
});

const SongToolsContextProvider: React.FC = props => {
    const { song, editNote } = useContext(SongContext);

    const [selectedNoteLength, setSelectedNoteLength] = useState<1 | 2 | 4 | 8>(1);
    const [selectedNoteKey, setSelectedNoteKey] = useState<string>("C");
    const [showPossiblePositions, setShowPossiblePositions] = useState<boolean>(false);
    const [availablePositions, setAvailablePositions] = useState<number[][][][]>([]);

    const insertNewNoteOrChord = (noteIndex: number, barIndex: number, voiceIndex: number) => {
        let newNoteArray: string[] = ["C"];
        if (Object.keys(notes).includes(selectedNoteKey)) {
            newNoteArray = [Object.values(notes)[Object.keys(notes).indexOf(selectedNoteKey)]];
        } else {
            newNoteArray = Object.values(chords)[Object.keys(chords).indexOf(selectedNoteKey)];
        }
        const newNote: IChordAndNotes = { length: selectedNoteLength, notes: newNoteArray }

        //Have now the new note object, will make a copy of the new copy in which will replace the old bar
        const tempChordsAndNotes = [];
        for (let i = 0; i < song.voices[voiceIndex].bars[barIndex].chordsAndNotes.length; i++) {
            tempChordsAndNotes.push(song.voices[voiceIndex].bars[barIndex].chordsAndNotes[i]);
        }

        let selectedPosArray = selectPositionArray(voiceIndex, barIndex, noteIndex)

        if (selectedPosArray !== undefined) {
            for (let j = selectedPosArray.length - 1; j >= 0; j--) {
                if (selectedPosArray[j] === noteIndex) {
                    tempChordsAndNotes.splice(selectedPosArray[j], 1, newNote);
                } else {
                    tempChordsAndNotes.splice(selectedPosArray[j], 1);
                }
            }
        }

        editNote(voiceIndex, barIndex, tempChordsAndNotes);
        setShowPossiblePositions(false);
    }

    const selectPositionArray = (voiceIndex: number, barIndex: number, noteIndex: number) => {
        const availablePosArray = availablePositions[voiceIndex][barIndex];
        let selectedPosArray = availablePosArray.find(arr => arr.includes(noteIndex));
        availablePosArray.map(arr => { if (arr.includes(noteIndex)) { selectedPosArray = arr } });
        if (selectedPosArray === undefined || selectedPosArray === null) {
            return [];
        };
        return selectedPosArray;
    }

    const showAvailableSpace = () => {

        let returnArray = [] //This will return a list of noteIndexLists in which there is available space in the barIndex given. This again tells where it is space to the right, or left if length-index <= selectedKeyLength
        for (let voiceIndex = 0; voiceIndex < song.voices.length; voiceIndex++) {
            let voiceArray = [];
            for (let barIndex = 0; barIndex < song.voices[voiceIndex].bars.length; barIndex++) {
                let barArray = [];
                let availableConsistentLength = 0;
                for (let noteIndex = 0; noteIndex < song.voices[voiceIndex].bars[barIndex].chordsAndNotes.length; noteIndex++) {
                    if (song.voices[voiceIndex].bars[barIndex].chordsAndNotes[noteIndex].notes[0] === "") {
                        availableConsistentLength += 1;
                    } else {
                        availableConsistentLength = 0;
                    }
                    if (availableConsistentLength === selectedNoteLength) {
                        let possibleposition = [];
                        for (let i = noteIndex - selectedNoteLength; i < noteIndex; i++) {
                            possibleposition.push(i + 1);
                        }
                        barArray.push(possibleposition);
                        availableConsistentLength -= 1;
                    }
                }
                voiceArray.push(barArray);
            }
            returnArray.push(voiceArray);

        }
        setAvailablePositions(returnArray);
    }


    //Add all methods here
    const value = {
        selectedNoteLength,
        setSelectedNoteLength,
        selectedNoteKey,
        setSelectedNoteKey,
        showPossiblePositions,
        setShowPossiblePositions,
        availablePositions,
        setAvailablePositions,
        insertNewNoteOrChord,
        showAvailableSpace,
        selectPositionArray
    }

    return (
        <SongToolsContext.Provider value={value}>
            {props.children}
        </SongToolsContext.Provider>
    )
};

export default SongToolsContextProvider;