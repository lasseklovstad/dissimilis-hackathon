import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import colors from "../../utils/colors";
import { IChordAndNotes } from "../../models/IBar";

export type BarBodyProps = {
    chordsAndNotes: IChordAndNotes[],
}

export function getColor(color: string): string {
    let newColor = "transparent";
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
        case "1": case "2": case "3": case "4": case "5":
            newColor = colors.semitone;
            break;
        default:
            newColor = "transparent";
    }
    return newColor;
}
export const BarBody: React.FC<BarBodyProps> = props => {
    const classes = useStyles();

    const verifySemiTone = (tone: string) => {
        return tone === "1" || tone === "2" || tone === "3" || tone === "4" || tone === "5";
    }


    return (
        <Box style={{ height: "100%" }} className={classes.root}>
            {props.chordsAndNotes.map((note, i) => {
                return (
                    <Box key={i} className={classes.toneAndChordBox} style={{ flex: note.length }} >
                        {note.notes.map((type, index) => {
                            return (
                                <Box key={index} className={classes.toneBox} style={{ backgroundColor: getColor(type) }} >
                                    <Typography className={classes.tangentText} variant="h2">{verifySemiTone(type) ? type : ""}</Typography>
                                </Box>
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
    },
    tangentText: {
        color: colors.white,
        marginLeft: "4px",
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)"
    }

})

export default BarBody;
