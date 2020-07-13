import React, { useState } from 'react';

//State handling skjer i denne komponenten 

interface ISongContext {
    song: object, //Maybe a ISong when created?
    title: string,
    instruments: string[],
    setSong: Function,
    addInstrument: Function

}

export const SongContext = React.createContext<any>({
    song: {},
    title: "",
    instruments: [],
    setSong: () => { },
    addInstrument: () => { },
});



const SongContextProvider: React.FC = props => {

    //Initial State. 
    const [song, setSong] = useState({
        title: "Lisa gikk til skolen",
        instruments: [
            "Gitar",
            "Kontrabass",
            "Klarinett",
        ],
    });


    //Method to simplify change of state
    const addInstrument = (newInstrument: string) => {
        setSong({ ...song, instruments: [...song.instruments, newInstrument] });
    }





    //Add all methods here
    const value = {
        song,
        addInstrument,
        instruments: song.instruments,
    }


    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

export default SongContextProvider;