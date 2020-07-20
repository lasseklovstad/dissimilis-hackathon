import React, { useState, useContext } from 'react';
import { SongContext } from './SongContextProvider.component';
import { IChordAndNotes } from '../../models/IBar';
import { notes } from '../../models/notes';
import { chords } from '../../models/chords';


//State handling skjer i denne komponenten 

interface ISongToolsContext {
    selectedNoteLength: 1 | 2 | 4 | 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => void,
    selectedNoteKey: string,
    setSelectedNoteKey: (string: string) => void,
    showPossiblePositions: boolean,
    setShowPossiblePositions: (show: boolean) => void,
    insertNewNoteOrChord: (noteIndex: number, chordsOrNotesIndex: number, barIndex: number, voiceIndex: number) => void,
}

export const SongToolsContext = React.createContext<ISongToolsContext>({
    selectedNoteLength: 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => { },
    selectedNoteKey: "C",
    setSelectedNoteKey: (string: string) => { },
    showPossiblePositions: false,
    setShowPossiblePositions: (show: boolean) => { },
    insertNewNoteOrChord: (noteIndex: number, chordsOrNotesIndex: number, barIndex: number, voiceIndex: number) => { }
});

const SongToolsContextProvider: React.FC = props => {
    const { editNote } = useContext(SongContext);

    const [selectedNoteLength, setSelectedNoteLength] = useState<1 | 2 | 4 | 8>(8);
    const [selectedNoteKey, setSelectedNoteKey] = useState<string>("C");
    const [showPossiblePositions, setShowPossiblePositions] = useState<boolean>(false);

    const insertNewNoteOrChord = (noteIndex: number, chordsOrNotesIndex: number, barIndex: number, voiceIndex: number) => {
        let newNoteArray: string[] = ["C"];
        if(Object.keys(notes).includes(selectedNoteKey)){
            newNoteArray = [Object.values(notes)[Object.keys(notes).indexOf(selectedNoteKey)]];
        } else {
            newNoteArray = Object.values(chords)[Object.keys(chords).indexOf(selectedNoteKey)];
        }
        const newNote: IChordAndNotes = { length: selectedNoteLength, notes: newNoteArray }
        

        editNote(voiceIndex, barIndex, noteIndex, newNote)
    }

    //Add all methods here
    const value = {
        selectedNoteLength,
        setSelectedNoteLength,
        selectedNoteKey,
        setSelectedNoteKey,
        showPossiblePositions,
        setShowPossiblePositions,
        insertNewNoteOrChord
    }

    return (
        <SongToolsContext.Provider value={value}>
            {props.children}
        </SongToolsContext.Provider>
    )
};

export default SongToolsContextProvider;