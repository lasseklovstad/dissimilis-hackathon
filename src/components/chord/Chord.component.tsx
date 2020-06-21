import React, {useState} from "react"
import {TextField} from "@material-ui/core"
import {FilledInputProps} from "@material-ui/core/FilledInput"
import {getNotesLength} from "../../util/note.util"
import {getChord} from "../../util/chord.util"

export type ChordProps = {
    onSelectChord?: (notes: string) => void,
    chord: string | undefined
}

export const Chord: React.FC<ChordProps> = props => {

    const [chord, setChord] = useState<string>(getChord(props.chord) || '')

    const onBlur = () => {
        props.onSelectChord && props.onSelectChord(chord)
    }

    const onChange: FilledInputProps['onChange'] = (ev) => {
        setChord(ev.target.value)
    }

    return <React.Fragment>
            <TextField fullWidth variant={"outlined"} style={{
                flexBasis: 0,
                flexGrow: props.chord ? getNotesLength(props.chord) : 1,
                marginBottom: '5px'
            }} value={chord} onChange={onChange} onBlur={onBlur}/>
    </React.Fragment>
}