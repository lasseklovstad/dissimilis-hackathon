import React, { useState, useContext } from 'react';
import { SongContext } from './SongContextProvider.component';
import { IChordAndNotes, IBar } from '../../models/IBar';
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
    insertNewNoteOrChord: (noteIndex: number, barIndex: number, voiceIndex: number) => void,
}

export const SongToolsContext = React.createContext<ISongToolsContext>({
    selectedNoteLength: 8,
    setSelectedNoteLength: (number: 1 | 2 | 4 | 8) => { },
    selectedNoteKey: "C",
    setSelectedNoteKey: (string: string) => { },
    showPossiblePositions: false,
    setShowPossiblePositions: (show: boolean) => { },
    insertNewNoteOrChord: (noteIndex: number, barIndex: number, voiceIndex: number) => { },
});

const SongToolsContextProvider: React.FC = props => {
    const { song, editNote } = useContext(SongContext);

    const [selectedNoteLength, setSelectedNoteLength] = useState<1 | 2 | 4 | 8>(8);
    const [selectedNoteKey, setSelectedNoteKey] = useState<string>("C");
    const [showPossiblePositions, setShowPossiblePositions] = useState<boolean>(false);

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

    /*
    const changeEmptySpaces = (timeSignatureNumerator: number, barIndex: number, voiceIndex: number) => {
        console.log(selectedNoteLength);
        //Her må jeg først finne ut av hvor mye plass jeg har
        //Lage et nytt objekt av bars med riktige notesOrChords
        //Sende dette videre til en metode i songContext slik at den bytter ut notesOrChords til riktig nye
        const lengthAvailable = timeSignatureNumerator;
        let newBars = [];
        //For hver bar må man endre alle tomme notes til riktige størrelser dersom det fungerer
        //Må iterere over alle barene først
        for (let i = 0; i < song.voices[voiceIndex].bars.length; i++) {
            let lengthOfConsistentEmptyNotes: number = 0;
            //Må også her lage en kopi av hver bar før man legger inn ny informasjon
            let newBar: IBar = Object.assign({}, song.voices[voiceIndex].bars[i]);
            newBar.chordsAndNotes = [];
            for (let j = 0; j < song.voices[voiceIndex].bars[i].chordsAndNotes.length; j++) {
                //Her må man telle over hvor mange "" man har etter hverandre for hvor langt
                if (song.voices[voiceIndex].bars[i].chordsAndNotes[j].notes === [""]) {
                    lengthOfConsistentEmptyNotes += song.voices[voiceIndex].bars[i].chordsAndNotes[j].length;
                } else {
                    //Må her lage antall tomme takter som man kan plassere her
                    while (lengthOfConsistentEmptyNotes !== 0) {
                        if (lengthOfConsistentEmptyNotes < selectedNoteLength) {
                            newBar.chordsAndNotes.push({ length: lengthOfConsistentEmptyNotes, notes: [""] });
                        }
                    }
                }
            }
            newBars.push(newBar);
        }
    }
    */

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