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
                        length: 4,
                        notes: ["C"]
                    },
                    {
                        length: 1,
                        notes: ["C", "A", "H"]
                    },
                    {
                        length: 1,
                        notes: ["H", "A", "1"]
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
                        length: 6,
                        notes: ["2"]
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
                        length: 2,
                        notes: ["A", "H", "C"]
                    },
                    {
                        length: 2,
                        notes: ["C", "H", "D"]
                    },
                    {
                        length: 4,
                        notes: ["H"]
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
                        length: 1,
                        notes: ["A", "H", "C"]
                    },
                    {
                        length: 1,
                        notes: ["C", "H", "D"]
                    },
                    {
                        length: 1,
                        notes: ["H"]
                    },
                    {
                        length: 1,
                        notes: ["C", "H", "D"]
                    },
                    {
                        length: 2,
                        notes: ["H"]
                    },
                    {
                        length: 2,
                        notes: ["C", "H", "D"]
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