import React, { useState } from "react";
import { render } from "react-dom";
import Note from "./Note.component";
import { Box, makeStyles } from "@material-ui/core";
import colors from "../../utils/colors";

export type BlockProps = {
    notes: string[][],
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

export const Block: React.FC<BlockProps> = props => {
    const classes = useStyles();

    const notes = [["C", "A", "H"], ["C"], ["A", "B", "C"]];

    return (
        <Box style={{ border: "1px solid black", height: "100%" }} className={classes.root} id="container for the shit">
            {props.notes.map((note) => {
                return (
                    <Box className={classes.boxKjorDa} id="note X?" >
                        {note.map((something) => {
                            return (
                                <Box className={classes.boxNy} style={{ backgroundColor: getColor(something) }} ></Box>
                            )
                        })}

                    </Box>
                )
            })}
        </Box>
    )
}


const useStyles = makeStyles({
    root: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-around",
        alignItems: "stretch",
        padding: "2px",
    },
    boxKjorDa: {
        flex: 1,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        margin: "0px 4px"
    },
    boxNy: {
        flex: 1,
        width: "100%",
        height: "10px",
        borderRadius: "5px",
        margin: "2px 0",
    }

})

export default Block;
