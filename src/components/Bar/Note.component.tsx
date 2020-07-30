import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { getColor } from "./BarBody.component";

export type NoteProps = {
    notes: string[],

}

export const Note: React.FC<NoteProps> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.notes.map((note) => {
                return <Box className={classes.box} style={{ backgroundColor: getColor(note) }} ></Box>
            })}

        </div>
    )
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    box: {
        borderRadius: "5px",
        flex: 1,
        margin: "2px",
    }
})

export default Note;