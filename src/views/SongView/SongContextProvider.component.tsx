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
                                notes: [""]
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
                                notes: [""]
                            },
                            {
                                length: 1,
                                notes: [""]
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
                                notes: [""]
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
            const tempBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: [] }
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
    const copyAndAddEmptyBars = (index: number) => {
        let tempArray = [];
        const newBar: IBar = { repBefore: false, repAfter: false, chordsAndNotes: [] };
        for (let i = 1; i < song.voices.length; i++) {
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


            const tempArray = copyAndAddEmptyBars(indexOfOriginalBar);
            //If master sheet add the new copy of bar to the array
            //Else add the copied bar-array with an empty bar
            setSong({ ...song, voices: song.voices.map((voice, i) => i === 0 ? { ...voice, bars: copyOfArray } : { ...voice, bars: tempArray[i - 1] }) });
        }


    }





    //Add all methods here
    const value = {
        song,
        setSong,
        addVoice,
        deleteBar,
        getBar,
        duplicateBar,
    }


    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;