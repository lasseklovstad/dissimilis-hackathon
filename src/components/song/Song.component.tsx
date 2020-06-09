import React from "react"
import {Measure} from "../measure/Measure.component"
import {NotationTypeModel} from "../../model/notationType.model"
import {BarLine} from "../barLine/BarLine.component"
import {makeStyles} from "@material-ui/core/styles"
import {barLineRegex} from "../../util/note.util"

export type SongProps = {
    displayType: NotationTypeModel,
    song: string [],
    abcNoteValue: string,
    onAddChord: (chord: string, measureIndex: number, noteIndex: number) => void
}
const useStyle = makeStyles((theme) => ({
    root: () => {
        return {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
        }
    }

}))

export const Song: React.FC<SongProps> = props => {
    const classes = useStyle()

    const createMeasure = (el: string, index: number) => {
        if (el.match(barLineRegex)) {
            return <BarLine key={el + index}/>
        } else {
            return <Measure key={el + index} displayType={props.displayType} onAddChord={handleAddChord(index)}
                            measure={el}/>
        }
    }

    const handleAddChord = (measureIndex: number) => (chord: string, index: number) => {
        props.onAddChord(chord, measureIndex, index)
    }

    return <div className={classes.root}>
        {props.song.map((el, i) => createMeasure(el, i))}
    </div>
}


