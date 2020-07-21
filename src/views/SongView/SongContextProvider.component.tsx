import React, { useState } from 'react';
import { IVoice } from '../../models/IVoice';
import { IBar } from '../../models/IBar';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addVoice: (voices: IVoice) => void,
    deleteBar: (index: number, voiceId: number) => void,
    getBar: (id: number, voiceId: number) => IBar | undefined,
    duplicateBar: (id: number, voiceId: number) => void,
    addEmptyBar: () => void,
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
    addEmptyBar: () => { }
});

const SongContextProvider: React.FC = props => {

    //Initial State.

    //For now, I'm just setting it static until we can retrieve the data from the server

    //This is just a temporary solution to show how it can be done

    //Each instrument will have their own bars when we get to that point
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
                                length: 1,
                                notes: ["H", "E", "F#"]
                            },
                            {
                                length: 1,
                                notes: ["H", "D#", "F#"],
                            },
                            {
                                length: 1,
                                notes: ["C", "E", "G", "H"]
                            },
                            {
                                length: 1,
                                notes: ["D", "F#", "A", "C"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["G", "A"]
                            },
                            {
                                length: 2,
                                notes: ["G"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        house: 1,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 1,
                                notes: ["A"]
                            },
                            {
                                length: 1,
                                notes: ["A"]
                            },
                            {
                                length: 1,
                                notes: ["A"]
                            },
                            {
                                length: 1,
                                notes: ["A"]
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
                                notes: [""]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 1,
                                notes: ["D"]
                            },
                            {
                                length: 1,
                                notes: ["D"]
                            },
                            {
                                length: 1,
                                notes: ["D"]
                            },
                            {
                                length: 1,
                                notes: ["D"]
                            },
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 2,
                                notes: ["E"]
                            },
                            {
                                length: 2,
                                notes: ["E"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 1,
                                notes: ["F"]
                            },
                            {
                                length: 1,
                                notes: ["F"]
                            },
                            {
                                length: 1,
                                notes: ["F"]
                            },
                            {
                                length: 1,
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
                                length: 1,
                                notes: ["C"]
                            },
                            {
                                length: 1,
                                notes: ["D"]
                            },
                            {
                                length: 1,
                                notes: ["E"]
                            },
                            {
                                length: 1,
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
                                notes: ["G"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["A"]
                            }
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
                                notes: [""]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["D"]
                            }
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

                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
                                notes: ["F"]
                            }
                        ],
                    },
                    {
                        repBefore: false,
                        repAfter: false,
                        chordsAndNotes: [
                            {
                                length: 4,
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
            let barInfo = song.voices[0].bars[i]
            const tempBar: IBar = { repBefore: barInfo.repBefore, repAfter: barInfo.repAfter, house: barInfo.house, chordsAndNotes: [{ length: 1, notes: [] }] }
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
        const newBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: [] };
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


    //Add all methods here
    const value = {
        song,
        setSong,
        addVoice,
        deleteBar,
        getBar,
        duplicateBar,
        addEmptyBar
    }

    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;