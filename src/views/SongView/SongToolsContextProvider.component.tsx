import React, { useState, useContext } from 'react';
import { SongContext } from './SongContextProvider.component';
import { IChordAndNotes, IBar } from '../../models/IBar';
import { notes } from '../../models/notes';
import { chords } from '../../models/chords';


//State handling skjer c denne komponenten 

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
    showAvailableSpace: () => { }
});

const SongToolsContextProvider: React.FC = props => {
    const { song, editNote } = useContext(SongContext);

    const [selectedNoteLength, setSelectedNoteLength] = useState<1 | 2 | 4 | 8>(8);
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

        editNote(voiceIndex, barIndex, noteIndex, newNote);
        setShowPossiblePositions(false);
    }

    const showAvailableSpace = () => {

        let returnArray = [] //This will return a list of noteIndexLists in which there is available space in the barIndex given. This again tells where it is space to the right, or left if length-index <= selectedKeyLength
        for (let a = 0; a < song.voices.length; a++) {
            let voiceArray = [];
            for (let b = 0; b < song.voices[a].bars.length; b++) {
                let barArray = [];
                let availableConsistentLength = 0;
                for (let c = 0; c < song.voices[a].bars[b].chordsAndNotes.length; c++) {
                    if (song.voices[a].bars[b].chordsAndNotes[c].notes[0] === "") {
                        availableConsistentLength += 1;
                    } else {
                        availableConsistentLength = 0;
                    }
                    if (availableConsistentLength === selectedNoteLength) {
                        let possibleposition = [];
                        for (let d = c - selectedNoteLength; d < c; d++) {
                            possibleposition.push(d + 1);
                        }
                        barArray.push(possibleposition);
                        availableConsistentLength -= 1;
                    }
                }
                voiceArray.push(barArray);
            }
            returnArray.push(voiceArray);

        }
        console.log(returnArray)
        setAvailablePositions(returnArray);
    }

    const prewiewOfInsertion = () => {

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
        showAvailableSpace
    }

    return (
        <SongToolsContext.Provider value={value}>
            {props.children}
        </SongToolsContext.Provider>
    )
};

export default SongToolsContextProvider;