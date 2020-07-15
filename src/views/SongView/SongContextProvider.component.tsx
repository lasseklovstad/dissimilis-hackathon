import React, { useState } from 'react';
import { IVoice } from '../../models/IVoice';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addVoice: (voices: IVoice) => void,
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
                        barNumber: 1,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
                        barNumber: 2,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
                        barNumber: 3,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
                        barNumber: 1,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
                        barNumber: 2,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
                        barNumber: 3,
                        repBefore: false,
                        repAfter: false,
                        chordsAndTones: [
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
        setSong({ ...song, voices: [...song.voices, newVoice] });
    }

    //Add all methods here
    const value = {
        song,
        setSong,
        addVoice,
    }


    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;