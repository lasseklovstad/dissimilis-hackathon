import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import colors from "../../utils/colors";

export type NoteProps = {
    color: string,
    size: 1 | 3,
    notes: string[],

}

function getColor(color: string): string {
    let newColor = "white";
    switch (color) {
        case "C":
            newColor = colors.C;
            break;
        case "D":
            newColor = colors.D;
            break;
        case "E":
            newColor = colors.E;
            break;
        case "F":
            newColor = colors.F;
            break;
        case "G":
            newColor = colors.G;
            break;
        case "A":
            newColor = colors.A;
            break;
        case "H":
            newColor = colors.H;
            break;
        default:
            newColor = "white";
    }
    return newColor;
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