import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import colors from "../../utils/colors";
import { IChordAndTones } from "../../models/IBar";

export type BarBodyProps = {
    chordsAndTones: IChordAndTones[],
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
export const BarBody: React.FC<BarBodyProps> = props => {
    const classes = useStyles();


    return (
        <Box style={{ height: "100%" }} className={classes.root}>
            {props.chordsAndTones.map((note, i) => {
                return (
                    <Box key={i} className={classes.toneAndChordBox} style={{ flex: note.size }} >
                        {note.tones.map((slag, index) => {
                            return (
                                <Box key={index} className={classes.toneBox} style={{ backgroundColor: getColor(slag) }} ></Box>
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
        padding: "2px",
    },
    toneAndChordBox: {
        flex: 1,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        margin: "0px 4px"
    },
    toneBox: {
        flex: 1,
        width: "100%",
        height: "10px",
        borderRadius: "5px",
        margin: "2px 0",
    }

})

export default BarBody;
