import React from 'react';



const SongContext = React.createContext<any>({
    title: "",
    instruments: [],
    setSong: () => { },
    addInstrument: () => { },
});

export default SongContext;