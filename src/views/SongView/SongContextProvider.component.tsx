import React, { useState } from 'react';
import SongContext from './SongContext';

//State handling skjer i denne komponenten 



const SongContextProvider: React.FC = props => {

    const [song, setSong] = useState({
        title: "Lisa gikk til skolen",
        instruments: [
            "Gitar",
            "Kontrabass",
            "Klarinett",
        ],
    });



    const addInstrument = (newInstrument: string) => {
        setSong({ ...song, instruments: [...song.instruments, newInstrument] });
    }


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