import React, { useState, useEffect } from 'react';
import { IVoice } from '../../models/IVoice';
import { IBar, IChordAndNotes } from '../../models/IBar';
import { useGetSong } from '../../utils/useGetSong';
import { ISong } from '../../models/ISong';
import { useRouteMatch } from 'react-router-dom';

interface ISongContext {
    song: ISong,
    setSong: (song: ISong) => void,
    addVoice: (voices: IVoice) => void,
    deleteBar: (index: number, voiceId: number) => void,
    getBar: (id: number, voiceId: number) => IBar | undefined,
    duplicateBar: (id: number, voiceId: number) => void,
    addEmptyBar: () => void,
    editNote: (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => void,
    getTimeSignature: () => number[],
    toggleRepBefore: (barId: number) => void,
    toggleRepAfter: (barId: number) => void,
    changeTitle: (newTitle: string) => void,
    changeVoiceTitle: (voiceId: number, newTitle: string) => void,
    deleteNote: (voiceId: number, barId: number, newNote: IChordAndNotes[]) => void,
    addHouse: (barId: number) => void,
    deleteHouse: (barId: number) => void,
    isLoading: boolean,
    isSaving: boolean,
    setIsSaving: (newValue: boolean) => void,
}

export const SongContext = React.createContext<ISongContext>({
    song: {
        title: "",
        timeSignature: "4/4",
        voices: [],
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
    addEmptyBar: () => { },
    editNote: (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => { },
    getTimeSignature: () => [],
    toggleRepBefore: (barId: number) => { },
    toggleRepAfter: (barId: number) => { },
    changeTitle: (newTitle: string) => { },
    changeVoiceTitle: (voiceId: number, newTitle: string) => { },
    deleteNote: (voiceId: number, barId: number, newNote: IChordAndNotes[]) => { },
    addHouse: (barId: number) => { },
    deleteHouse: (barId: number) => { },
    isLoading: false,
    isSaving: false,
    setIsSaving: (newValue: boolean) => { }
});

const SongContextProvider: React.FC = props => {
    const [songId, setSongId] = useState<number>(1);
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const getSong = useGetSong(songId);
    let [song, setSong] = useState<ISong>({
        title: "",
        id: 0,
        timeSignature: "",
        voices: [
            {
                partNumber: 1,
                title: "",
                bars: [
                ]
            },
        ],
    });

    const match = useRouteMatch<MatchParams>("/song/:id")
    let id = match ? +match.params.id : 0
    if (id !== songId) {
        setSongId(id);
    }
    useEffect(() => {
        setIsloading(true);
        getSong().then(({ result }) => {
            if (result?.data) {
                setIsloading(false);
                setSong(result.data)
            }
            setIsloading(false);
        })
    }, [])

    //Method to simplify change of state
    const addVoice = (newVoice: IVoice) => {
        for (let i = 0; i < song.voices[0].bars.length; i++) {
            //I have to add as many empty notes as the timesignatureNumerator-value is if the denominator is 8
            const newChordsAndNotes = [];
            const newEmptyNote = { length: 1, notes: [" "] };
            let timeSignatureNumerator = getTimeSignature()[0];
            if (getTimeSignature()[1] === 4) timeSignatureNumerator *= 2;
            for (let i = 0; i < timeSignatureNumerator; i++) {
                newChordsAndNotes.push(newEmptyNote)
            }
            let barInfo = song.voices[0].bars[i]
            const tempBar: IBar = { barNumber: i + 1, repBefore: barInfo.repBefore, repAfter: barInfo.repAfter, house: barInfo.house, chordsAndNotes: newChordsAndNotes }
            newVoice.bars.push(tempBar);
        }
        song = { ...song, voices: [...song.voices, newVoice] }
        setSong(song)
    }

    const toggleRepBefore = (barId: number) => {
        //Map through all voices and for the ba which matches the id, toggle the bars repetition value
        song = { ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, repBefore: !bar.repBefore } : bar) } : voice) }
        setSong(song)
    }

    const toggleRepAfter = (barId: number) => {
        //Map through all voices and for the ba which matches the id, toggle the bars repetition value
        song = { ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, repAfter: !bar.repAfter } : bar) } : voice) }
        setSong(song)
    }

    //adds house to a bar
    const addHouse = (barId: number) => {
        //Checks if its the last bar in the song, and maps through all the bars, matching on barId, checking for house values on the chosen bar, along with the adjacent bars, ensuring that they are handled correctly
        if (barId === song.voices[0].bars.length - 1) {
            song = { ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, house: 2 } : (i === barId - 1 ? { ...bar, house: 1 } : (i === barId - 2 && (song.voices[0].bars[barId - 2].house === 1) ? { ...bar, house: undefined } : bar))) } : voice) }

        } else {
            song = { ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, house: 1 } : (i === barId + 1 ? { ...bar, house: 2 } : (i === barId + 2 && (song.voices[0].bars[barId + 2].house === 2) ? { ...bar, house: undefined } : bar))) } : voice) }
        }
        setSong(song)
    }

    //Function for removing house from a bar
    const deleteHouse = (barId: number) => {
        //Checks the housevalue and sets the value to undefined, along with checking adjacent bars and ensuring they are correct
        let barBase = song.voices[0].bars[barId].house;

        if (barBase === 1) {
            song = ({ ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId || i === barId + 1 ? { ...bar, house: undefined } : bar) } : voice) });
        }
        if (barBase === 2) {
            song = ({ ...song, voices: song.voices.map((voice, index) => true ? { ...voice, bars: voice.bars.map((bar, i) => i === barId || i === barId - 1 ? { ...bar, house: undefined } : bar) } : voice) });
        }
        setSong(song)
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
        deleteHouse(id)
        song = {
            ...song,
            voices: song.voices.map((voice) => { return { ...voice, bars: voice.bars.filter((bar, i) => i !== id) } })
        }

        for (let i = 0; i < song.voices.length; i++) {
            for (let j = id; j < song.voices[i].bars.length; j++) {
                song.voices[i].bars[j].barNumber = song.voices[i].bars[j].barNumber - 1;
            }
        }

        setSong(song);
    }

    //Method to get timeSignature from localstorage
    const getTimeSignature = () => {
        return [parseInt(song.timeSignature.split("/")[0]), parseInt(song.timeSignature.split("/")[1])];
    }

    //Method to add an empty bar at a specific index to each of all voices except the master sheet/song
    const copyAndAddEmptyBars = (index: number, withoutMaster: 0 | 1) => {
        //withoutMaster is either 0 if mastersheet is included, or 1 if it is not
        let tempArray = [];
        //I have to add as many empty notes as the timesignatureNumerator-value is if the denominator is 8
        const newChordsAndNotes = [];
        const newEmptyNote = { length: 1, notes: [" "] };
        let timeSignatureNumerator = getTimeSignature()[0];
        if (getTimeSignature()[1] === 4) timeSignatureNumerator *= 2;
        for (let i = 0; i < timeSignatureNumerator; i++) {
            newChordsAndNotes.push(newEmptyNote)
        }
        const newBar: IBar = { barNumber: index, repBefore: false, repAfter: false, chordsAndNotes: newChordsAndNotes };
        for (let i = withoutMaster; i < song.voices.length; i++) {
            let copyOfArray = song.voices[i].bars.slice();
            copyOfArray.splice(index, 0, newBar);
            tempArray.push(copyOfArray);
        }

        //Updating barNumbers for each element
        for (let i = 0; i < tempArray.length; i++) {
            for (let j = index; j < tempArray[i].length; j++) {
                tempArray[i][j].barNumber = j + 1;
            }
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
            const tempArray = copyAndAddEmptyBars(indexOfOriginalBar + 1, 1);

            //If master sheet add the new copy of bar to the array
            //Else add the copied bar-array with an empty bar
            song = { ...song, voices: song.voices.map((voice, i) => i === 0 ? { ...voice, bars: copyOfArray } : { ...voice, bars: tempArray[i - 1] }) };
            if (song.voices[0].bars[id].house === 1) {
                deleteHouse(id)
                addHouse(id + 1)
            }
            if (song.voices[0].bars[id].house === 2) {
                deleteHouse(id)
                addHouse(id - 1)
            }
            for (let i = id + 1; i < song.voices[0].bars.length; i++) {
                song.voices[0].bars[i].barNumber = song.voices[0].bars[i].barNumber + 1;
            }
            setSong(song);
        }
    }

    const addEmptyBar = () => {
        const tempArray = copyAndAddEmptyBars(song.voices[0].bars.length, 0);
        song = { ...song, voices: song.voices.map((voice, i) => true ? { ...voice, bars: tempArray[i] } : voice) };
        setSong(song);
    }

    const editNote = (voiceId: number, barId: number, newNotes: IChordAndNotes[]) => {
        setSong({ ...song, voices: song.voices.map((voice, index) => voiceId === index ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, chordsAndNotes: newNotes } : bar) } : voice) });
    }

    const changeTitle = (newTitle: string) => {
        song = { ...song, title: newTitle };
        setSong(song);
    }

    const changeVoiceTitle = (voiceId: number, newTitle: string) => {
        song = { ...song, voices: song.voices.map((voice, index) => voiceId === index ? { ...voice, title: newTitle } : voice) };
        setSong(song);
    }

    const deleteNote = (voiceId: number, barId: number, newNote: IChordAndNotes[]) => {
        song = { ...song, voices: song.voices.map((voice, index) => voiceId === index ? { ...voice, bars: voice.bars.map((bar, i) => i === barId ? { ...bar, chordsAndNotes: newNote } : bar) } : voice) };
        setSong(song);
    }

    //Add all methods here
    const value = {
        song,
        setSong,
        addVoice,
        deleteBar,
        getBar,
        duplicateBar,
        addEmptyBar,
        editNote,
        getTimeSignature,
        toggleRepBefore,
        toggleRepAfter,
        changeTitle,
        changeVoiceTitle,
        deleteNote,
        addHouse,
        deleteHouse,
        isLoading,
        isSaving,
        setIsSaving
    }

    return (
        <SongContext.Provider value={value}>
            {props.children}
        </SongContext.Provider>
    )
};

type MatchParams = {
    id: string
}

export default SongContextProvider;