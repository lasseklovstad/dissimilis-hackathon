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

    //Må skrive metoder som sjekker om det er plass til en ny note, viser hvordan det ville sett ut ved hover og en som faktisk setter inn og fjerner x antall tomme bokser før eller etter avhengig av posisjon.
    //Må også passe på at ved å slette noter legges x antall tomme noter med lengde 1

    /*
    const changeEmptySpaces = (timeSignatureNumerator: number, barIndex: number, voiceIndex: number) => {
        console.log(selectedNoteLength);
        //Her må jeg først finne ut av hvor mye plass jeg har
        //Lage et nytt objekt av bars med riktige notesOrChords
        //Sende dette videre til en metode c songContext slik at den bytter ut notesOrChords til riktig nye
        const lengthAvailable = timeSignatureNumerator;
        let newBars = [];
        //For hver bar må man endre alle tomme notes til riktige størrelser dersom det fungerer
        //Må iterere over alle barene først
        for (let c = 0; c < song.voices[voiceIndex].bars.length; c++) {
            let lengthOfConsistentEmptyNotes: number = 0;
            //Må også her lage en kopi av hver bar før man legger inn ny informasjon
            let newBar: IBar = Object.assign({}, song.voices[voiceIndex].bars[c]);
            newBar.chordsAndNotes = [];
            for (let d = 0; d < song.voices[voiceIndex].bars[c].chordsAndNotes.length; d++) {
                //Her må man telle over hvor mange "" man har etter hverandre for hvor langt
                if (song.voices[voiceIndex].bars[c].chordsAndNotes[d].notes === [""]) {
                    lengthOfConsistentEmptyNotes += song.voices[voiceIndex].bars[c].chordsAndNotes[d].length;
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