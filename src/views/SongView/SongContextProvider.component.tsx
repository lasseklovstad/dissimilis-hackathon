import React, { useState } from 'react';
import { IVoice } from '../../models/IVoice';
import { IBar, IChordAndNotes } from '../../models/IBar';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addVoice: (voices: IVoice) => void,
    deleteBar: (index: number, voiceId: number) => void,
    getBar: (id: number, voiceId: number) => IBar | undefined,
    duplicateBar: (id: number, voiceId: number) => void,
    addEmptyBar: () => void,
    editNote: (voiceId: number, barId: number, noteId: number, newNote: IChordAndNotes) => void,
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
    editNote: (voiceId: number, barId: number, noteId: number, newNote: IChordAndNotes) => { },
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
                                notes: ["C"]
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
                                length: 2,
                                notes: ["G"]
                            },
                            {
                                length: 2,
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
                                length: 4,
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
                                notes: ["C"]
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
                                length: 4,
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
            const tempBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: [{length: 8, notes: [""]}] }
            newVoice.bars.push(tempBar);
        }
        setSong({ ...song, voices: [...song.voices, newVoice] });
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

    //Method to add an empty bar at a specific index to each of all voices except the master sheet/song
    const copyAndAddEmptyBars = (index: number, withoutMaster: 0 | 1) => {
        //withoutMaster is either 0 if mastersheet is included, or 1 if it is not
        let tempArray = [];
        const newBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: [{ length: 8, notes: [""] }] };
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

    const editNote = (voiceId: number, barId: number, noteId: number, newNote: IChordAndNotes) => {
        let newChordsOrNotes: IChordAndNotes[] = [];
        for (let i = 0; i < song.voices[voiceId].bars[barId].chordsAndNotes.length; i++) {
            if (i === noteId+1) {
                newChordsOrNotes.push(newNote);
            } else {
                newChordsOrNotes.push(song.voices[voiceId].bars[barId].chordsAndNotes[noteId])
            }
        }
        setSong({ ...song, voices: song.voices.map((voice, index) => voiceId === index ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, chordsAndNotes: newChordsOrNotes } : bar) } : voice) });
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
        editNote
    }

    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;