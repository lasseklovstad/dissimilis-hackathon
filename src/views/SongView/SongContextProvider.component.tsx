import React, { useState } from 'react';
import { IBar } from '../../models/IBar';


//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addInstrument: (instrument: string) => void,
    deleteBar: (index: string) => void,
    getBar: (id: string) => IBar | undefined,
    duplicateBar: (id: string) => void,
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
    deleteBar: (index: string) => { },
    getBar: (id: string) => {
        throw new Error("getBar() in Song Context is not implemented")
    },
    duplicateBar: (id: string) => {
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
        instruments: [
            "Gitar",
            "Kontrabass",
            "Klarinett",
        ],
        bars: [
            {
                id: '_' + Math.random().toString(36).substr(2, 9),
                barNumber: 1,
<<<<<<< HEAD
                repBefore: false,
=======
                barLineBefore: false,
                barLineAfter: false,
                repBefore: true,
>>>>>>> ff48f7d9fafbdbd13feeb14c6cecfa4c87f2c42c
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
                id: '_' + Math.random().toString(36).substr(2, 9),
                barNumber: 2,
                repBefore: false,
                repAfter: false,
                chordsAndTones: [
                    {
                        length: 6,
                        notes: ["2"]
                    }
                ],
            },
            {
                id: '_' + Math.random().toString(36).substr(2, 9),
                barNumber: 3,
                repBefore: false,
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
                id: '_' + Math.random().toString(36).substr(2, 9),
                barNumber: 4,
                repBefore: false,
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
                        length: 1,
                        notes: ["C", "H", "D"]
                    },
                    {
                        length: 1,
                        notes: ["D", "H", "D"]
                    },
                ],
            },
        ]
    });

    //Method to simplify change of state
    const addInstrument = (newInstrument: string) => {
        setSong({ ...song, instruments: [...song.instruments, newInstrument] });
    }



    const getBar = (id: string) => {
        let returnBar = undefined;
        song.bars.forEach(bar => {
            if (bar.id === id) {
                returnBar = bar;
            }
        });
        return returnBar;
    }

    const deleteBar = (id: string) => {
        setSong({ ...song, bars: song.bars.filter((item) => item.id !== id) });
    }

    const duplicateBar = (id: string) => {
        const bar = getBar(id);

        if (bar !== undefined) {
            const indexOfOriginalBar = song.bars.indexOf(bar);

            let copyOfBar: IBar = Object.assign({}, bar);
            let copyOfArray = song.bars.slice();

            copyOfBar.id = '_' + Math.random().toString(36).substr(2, 9);

            copyOfArray.splice(indexOfOriginalBar, 0, copyOfBar);
            setSong({ ...song, bars: copyOfArray });
        }


    }





    //Add all methods here
    const value = {
        song,
        setSong,
        addInstrument,
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