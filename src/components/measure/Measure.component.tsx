import React from "react"
import {Chord} from "../chord/Chord.component"
import {Note} from "../note/Note.component"
import {makeStyles} from "@material-ui/core/styles"
import {getNotesLength, noteAndChordRegex, noteRegex} from "../../util/note.util"

export type MeasureProps = {
    displayType: 'DISSIMILIS_NOTATION' | 'CHORD_NOTATION',
    measure: string,
    onAddChord?: (chord: string, index:number) => void
}

const useStyle = makeStyles((theme) => ({
    root: () => {
        return {
            display: 'flex',
            alignItems: 'center',
            width: '400px',
            flexShrink: 0,
            '&>*': {
                padding: '2px'
            }
        }
    }

}))

export const Measure: React.FC<MeasureProps> = props => {
    const classes = useStyle()

    const getAllNotes = (measure: string) => {
        const arrayOfNotes = []
        let element
        let i = 0
        while (element = noteAndChordRegex.exec(measure)) {

            const chord = element[3] as string | undefined
            const note = element[0] as string


            if (chord) {
                const firstNoteInChord = element[4] || 'C'
                const notes = []

                while (element = noteRegex.exec(chord)) {
                    notes.push(<Note key={element[0] + i} chord={true} note={element[0]}/>)
                }
                arrayOfNotes.push(<div key={chord + i} style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    flexGrow: getNotesLength(firstNoteInChord),
                    flexBasis: 0
                }}>{notes}</div>)
            } else {
                arrayOfNotes.push(<Note key={note + i} note={note}/>)
            }
            i++
        }

        return arrayOfNotes

    }

    const getChords = (measure: string) => {
        const arrayOfNotes = []
        let element
        let i = 0
        while (element = noteAndChordRegex.exec(measure)) {

            const chord = element[3] as string | undefined
            const note = element[0] as string


            if (chord) {
                arrayOfNotes.push(<Chord key={chord + i} chord={chord} onSelectChord={handleChordChange(i)}/>)
            } else {
                arrayOfNotes.push(<Chord key={note + i} chord={note} onSelectChord={handleChordChange(i)}/>)
            }
            i++
        }

        return arrayOfNotes

    }

    const handleChordChange = (i: number) => (chord: string) => {
        props.onAddChord && props.onAddChord(chord,i)
    }

    return <div className={classes.root}>
        {props.displayType === "CHORD_NOTATION" ?
            getChords(props.measure) : getAllNotes(props.measure)}
    </div>
}