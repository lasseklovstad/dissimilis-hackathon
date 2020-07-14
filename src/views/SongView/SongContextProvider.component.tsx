import React, { useState } from 'react';
import { IBar } from '../../models/IBar';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addInstrument: (instrument: string) => void,
}


interface ISong {
    instruments: string[],
    title: string,
    bars: Array<IBar>,
};

export const SongContext = React.createContext<ISongContext>({
    song: {
        instruments: [],
        title: "",
        bars: [],
    },
    setSong: (song: ISong) => { },
    addInstrument: (instrument: string) => { },
});






const SongContextProvider: React.FC = props => {

    //Initial State. 

    //For now, I'm just setting it static until we can retrieve the data from the server

    //This is just a temporary solution to show how it can be done

    //Each instrument will have their own bars when we get to that point
    const [song, setSong] = useState<ISong>({
        title: "Lisa gikk til skolen",
        instruments: [
            "Gitar",
            "Kontrabass",
            "Klarinett",
        ],
        bars: [
            {
                barNumber: 1,
                barLineBefore: false,
                barLineAfter: false,
                repBefore: false,
                repAfter: false,
                chordsAndTones: [
                    {
                        size: 4,
                        tones: ["C"]
                    },
                    {
                        size: 1,
                        tones: ["C", "A", "H"]
                    },
                    {
                        size: 1,
                        tones: ["H", "A", "C"]
                    }
                ],
            },
            {
                barNumber: 2,
                barLineBefore: false,
                barLineAfter: true,
                repBefore: true,
                repAfter: false,
                chordsAndTones: [
                    {
                        size: 6,
                        tones: ["A"]
                    }
                ],
            },
            {
                barNumber: 3,
                barLineBefore: false,
                barLineAfter: true,
                repBefore: true,
                repAfter: false,
                chordsAndTones: [
                    {
                        size: 2,
                        tones: ["A", "H", "C"]
                    },
                    {
                        size: 2,
                        tones: ["C", "H", "D"]
                    },
                    {
                        size: 4,
                        tones: ["H"]
                    }
                ],
            },
            {
                barNumber: 4,
                barLineBefore: false,
                barLineAfter: true,
                repBefore: true,
                repAfter: false,
                chordsAndTones: [
                    {
                        size: 1,
                        tones: ["A", "H", "C"]
                    },
                    {
                        size: 1,
                        tones: ["C", "H", "D"]
                    },
                    {
                        size: 1,
                        tones: ["H"]
                    },
                    {
                        size: 1,
                        tones: ["C", "H", "D"]
                    },
                    {
                        size: 2,
                        tones: ["H"]
                    },
                    {
                        size: 2,
                        tones: ["C", "H", "D"]
                    },


                ],
            },
        ]
    });

    //Method to simplify change of state
    const addInstrument = (newInstrument: string) => {
        setSong({ ...song, instruments: [...song.instruments, newInstrument] });
    }

    /*
    const addBar = (instrument: string, bar: IBar) => {
        //Find the instrument

        //Add a new bar to the bar-array of that instrument
    }
    */





    //Add all methods here
    const value = {
        song,
        setSong,
        addInstrument,
    }


    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;