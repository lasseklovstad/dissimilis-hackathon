import React, { useState, useContext } from 'react';
import { IVoice } from '../../models/IVoice';
import { IBar, IChordAndNotes } from '../../models/IBar';
import useLocalStorage from '@rehooks/local-storage';
import { SongToolsContext } from './SongToolsContextProvider.component';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addVoice: (voices: IVoice) => void,
    deleteBar: (index: number, voiceId: number) => void,
    getBar: (id: number, voiceId: number) => IBar | undefined,
    duplicateBar: (id: number, voiceId: number) => void,
    addEmptyBar: () => void,
    editNote: (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => void,
    getTimeSignature: () => number[],
    toggleRepBefore: (barId: number) => void,
    toggleRepAfter: (barId: number) => void,
    changeTitle: (newTitle: string) => void,
}

interface ISong {
    title: string,
    voices: IVoice[]
};


export const SongContext = React.createContext<ISongContext>({
    song: {
        title: "",
        voices: []
    },
    setSong: (song: ISong) => { },
    addVoice: (voice: IVoice) => { },
    deleteBar: (index: number, voiceId: number) => { },
    getBar: (id: number, voiceId: number) => {
        throw new Error("getBar() in Song Context is not implemented")
    },
    duplicateBar: (id: number, voiceId: number) => {
        throw new Error("duplicateBar() in Song Context is not implemented")
    },
    addEmptyBar: () => { },
    editNote: (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => { },
    getTimeSignature: () => [],
    toggleRepBefore: (barId: number) => { },
    toggleRepAfter: (barId: number) => { },
    changeTitle: (newTitle: string) => { },
});

const SongContextProvider: React.FC = props => {

    //This is where the song JSON is placed. 
    /*The length of notes is allways considered as a fraction of 8.
    * Wholenote has length 8
    * Halfnote has length 4
    * 1/4note has length 2
    * 1/8note has length 1
    */
    //In the JSON the sum of each length in a chordsAndNotes-list shoould allways be 8. The empty note is [""]
    const [song, setSong] = useState<ISong>({
        title: "Lisa gikk til skolen",
        voices: [
            {
                title: "master",
                priority: 1,
                bars: [
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["D", "F", "A", "C"]
                            },
                            {
                                length: 2,
                                notes: ["D"]
                            },
                            {
                                length: 2,
                                notes: ["E"]
                            },
                            {
                                length: 2,
                                notes: ["F"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["G", "A"]
                            },
                            {
                                length: 4,
                                notes: ["G"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["A"]
                            },
                            {
                                length: 2,
                                notes: ["A"]
                            },
                            {
                                length: 2,
                                notes: ["A"]
                            },
                            {
                                length: 2,
                                notes: ["A"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["G"]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["D"]
                            },
                            {
                                length: 2,
                                notes: ["D"]
                            },
                            {
                                length: 2,
                                notes: ["D"]
                            },
                            {
                                length: 2,
                                notes: ["D"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["E"]
                            },
                            {
                                length: 4,
                                notes: ["E"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["F"]
                            },
                            {
                                length: 2,
                                notes: ["F"]
                            },
                            {
                                length: 2,
                                notes: ["F"]
                            },
                            {
                                length: 2,
                                notes: ["F"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["C"]
                            }
                        ],
                    },
                ]
            },
            {
                title: "Gitar",
                priority: 2,
                bars: [
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["D", "F", "A", "C"]
                            },
                            {
                                length: 2,
                                notes: ["D"]
                            },
                            {
                                length: 2,
                                notes: ["E"]
                            },
                            {
                                length: 2,
                                notes: ["F"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["G"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["A"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["G"]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["D"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["E"]
                            },

                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["F"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 8,
                                notes: ["C"]
                            }
                        ],
                    },
                ]
            },
        ],

    });

    //Method to simplify change of state
    const addVoice = (newVoice: IVoice) => {
        for (let i = 0; i < song.voices[0].bars.length; i++) {
            //I have to add as many empty notes as the timesignatureNumerator-value is if the denominator is 8
            const newChordsAndNotes = [];
            const newEmptyNote = { length: 1, notes: [""] };
            let timeSignatureNumerator = getTimeSignature()[0];
            if (getTimeSignature()[1] == 4) timeSignatureNumerator *= 2;
            for (let i = 0; i < timeSignatureNumerator; i++) {
                newChordsAndNotes.push(newEmptyNote)
            }
            let barInfo = song.voices[0].bars[i]
            const tempBar: IBar = { repBefore: barInfo.repBefore, repAfter: barInfo.repAfter, house: barInfo.house, chordsAndNotes: newChordsAndNotes }
            newVoice.bars.push(tempBar);
        }
        setSong({ ...song, voices: [...song.voices, newVoice] });
    }

    const toggleRepBefore = (barId: number) => {
        //Map through all voices and for the ba which matches the id, toggle the bars repetition value
        setSong({ ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, repBefore: !bar.repBefore } : bar) } : voice) });
    }
    const toggleRepAfter = (barId: number) => {
        //Map through all voices and for the ba which matches the id, toggle the bars repetition value
        setSong({ ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, repAfter: !bar.repAfter } : bar) } : voice) });
    }











    const getBar = (id: number, voiceId: number) => {
        let returnBar = undefined;
        song.voices[voiceId].bars.forEach((bar, i) => {
            if (i === id) {
                returnBar = bar;
            }
        });
        return returnBar;
    }


    const deleteBar = (id: number, voiceId: number) => {
        setSong({ ...song, voices: song.voices.map((voice) => true ? { ...voice, bars: voice.bars.filter((bar, i) => i !== id) } : voice) });
    }

    //Method to get timeSignature from localstorage
    const timeSignature = useLocalStorage('timeSignature')[0];
    const getTimeSignature = () => {
        let timeSignatureNumerator: string = "";
        let timeSignatureDenominator: string = "";
        if (timeSignature !== null) {
            timeSignatureNumerator = timeSignature[0];
            timeSignatureDenominator = timeSignature[1];
        }
        return [parseInt(timeSignatureNumerator), parseInt(timeSignatureDenominator)];
    }

    //Method to add an empty bar at a specific index to each of all voices except the master sheet/song
    const copyAndAddEmptyBars = (index: number, withoutMaster: 0 | 1) => {
        //withoutMaster is either 0 if mastersheet is included, or 1 if it is not
        let tempArray = [];

        //I have to add as many empty notes as the timesignatureNumerator-value is if the denominator is 8
        const newChordsAndNotes = [];
        const newEmptyNote = { length: 1, notes: [""] };
        let timeSignatureNumerator = getTimeSignature()[0];
        if (getTimeSignature()[1] == 4) timeSignatureNumerator *= 2;
        for (let i = 0; i < timeSignatureNumerator; i++) {
            newChordsAndNotes.push(newEmptyNote)
        }

        const newBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: newChordsAndNotes };
        for (let i = withoutMaster; i < song.voices.length; i++) {
            let copyOfArray = song.voices[i].bars.slice();
            copyOfArray.splice(index + 1, 0, newBar);
            tempArray.push(copyOfArray);
        }
        return tempArray;
    }

    const duplicateBar = (id: number, voiceId: number) => {
        const bar = getBar(id, voiceId);
        if (bar !== undefined) {
            const indexOfOriginalBar = song.voices[voiceId].bars.indexOf(bar);

            let copyOfBar: IBar = Object.assign({}, bar);
            let copyOfArray = song.voices[voiceId].bars.slice();

            copyOfArray.splice(indexOfOriginalBar, 0, copyOfBar);

            const tempArray = copyAndAddEmptyBars(indexOfOriginalBar, 1);
            //If master sheet add the new copy of bar to the array
            //Else add the copied bar-array with an empty bar
            setSong({ ...song, voices: song.voices.map((voice, i) => i === 0 ? { ...voice, bars: copyOfArray } : { ...voice, bars: tempArray[i - 1] }) });
        }
    }

    const addEmptyBar = () => {
        const tempArray = copyAndAddEmptyBars(song.voices[0].bars.length, 0);
        setSong({ ...song, voices: song.voices.map((voice, i) => true ? { ...voice, bars: tempArray[i] } : voice) });
    }

    const editNote = (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => {
        setSong({ ...song, voices: song.voices.map((voice, index) => voiceId === index ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, chordsAndNotes: newNotes } : bar) } : voice) });
    }

    const changeTitle = (newTitle: string) => {
        setSong({ ...song, title: newTitle });
    }



    //Add all methods here
    const value = {
        song,
        setSong,
        addVoice,
        deleteBar,
        getBar,
        duplicateBar,
        addEmptyBar,
        editNote,
        getTimeSignature,
        toggleRepBefore,
        toggleRepAfter,
        changeTitle,
    }

    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;