import React, { useState } from 'react';

//State handling skjer i denne komponenten 

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void, //Bør endres til Interface ISong når det er klart
    addInstrument: (instrument: string) => void,
}

interface ISong {
    instruments: string[],
    title: string,
}

export const SongContext = React.createContext<ISongContext>({
    song: {
        instruments: [],
        title: "",
    },
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
        setSong,
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