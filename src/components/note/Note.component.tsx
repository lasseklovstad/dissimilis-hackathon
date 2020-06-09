import React from "react"
import {Paper, Typography} from "@material-ui/core"
import {COLOR, getColor, getNotesLength, getNoteText} from "../../util/note.util"

export type NoteProps = {
    note: string,
    chord?:boolean
}

export const Note: React.FC<NoteProps> = props => {
       return <React.Fragment>
        <Paper variant={"outlined"} style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            flexBasis: 0,
            flexGrow: !props.chord ? getNotesLength(props.note) : 1,
            backgroundColor: getColor(props.note),
            color: getColor(props.note) === COLOR.default ? 'white' : "black",
            marginBottom: '5px'
        }}>
            <Typography variant={"h6"}>{getNoteText(props.note)}</Typography>
        </Paper>
    </React.Fragment>
}