import React, { useContext } from "react";
import { Box, makeStyles, Typography, ButtonBase } from "@material-ui/core";
import colors from "../../utils/colors";
import { IChordAndNotes } from "../../models/IBar";
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component";
import { Chord } from "@tonaljs/tonal";
import { SongContext } from "../../views/SongView/SongContextProvider.component";


export type BarBodyProps = {
    barNumber: number,
    chordsAndNotes: IChordAndNotes[],
    height?: number,
    voiceId: number,
}


export function getChord(notes: string[]): string {
    let tempArray = notes.slice();
    const index = tempArray.indexOf("H");
    if (index !== -1) {
        tempArray[index] = "B";
    }

    if (tempArray.length === 1) {
        return notes[0];
    } else {
        const result = Chord.detect(tempArray);
        if (result.length === 0) return notes[0]
        return result[0];
    }
}

export function tangentToNumber(tangent: string): number {
    let result = -1;
    switch (tangent) {
        case "C#":
            result = 4
            break;
        case "D#":
            result = 5
            break;
        case "F#":
            result = 1
            break;
        case "G#":
            result = 2
            break;
        case "A#":
            result = 3
            break;
        default:
            result = 0
    }
    return result;
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
        case "C#": case "D#": case "F#": case "G#": case "A#":
            newColor = colors.semitone;
            break;
        default:
            newColor = "transparent";
    }
    return newColor;
}
export const BarBody: React.FC<BarBodyProps> = props => {
    const classes = useStyles();
    const { showPossiblePositions, selectedNoteLength, insertNewNoteOrChord, availa } = useContext(SongToolsContext);

    const { song: { voices } } = useContext(SongContext);


    let tempArrayOfChords: any = [];
    for (let i = 0; i < voices[0].bars[props.barNumber].chordsAndNotes.length; i++) {
        tempArrayOfChords.push(getChord(voices[0].bars[props.barNumber].chordsAndNotes[i].notes));

    }



    const chordsInBar = tempArrayOfChords.map((item: any, i: any) => {
        return (
            <Typography key={i} variant="body1" style={{ flexBasis: 100 / tempArrayOfChords.length + "%" }} className={classes.toneText}>{item}</Typography>
        )
    })




    return (

        <Box style={{ height: !props.height ? "100%" : props.height + "px" }} className={classes.root} >
            {chordsInBar}
            {
                props.chordsAndNotes.map((note, i) => {
                    return (
                        <Box key={i} className={classes.toneAndChordBox} style={{ flex: note.length, height: !props.height ? "100%" : props.height - 24 + "px" }} flexDirection="column" >
                            {note.notes.map((type, index) => {
                                const number = tangentToNumber(type);
                                return (
                                    <Box key={index} className={classes.toneBox} style={{ backgroundColor: showPossiblePositions ? colors.focus : getColor(type) }} component={ButtonBase} onClick={() => {
                                        if (getColor(type) >= "transparent" && showPossiblePositions && note.length === selectedNoteLength) {
                                            insertNewNoteOrChord(i, props.barNumber, props.voiceId)
                                        }
                                    }}>
                                        <Typography className={classes.tangentText} >{number === 0 ? "" : number}</Typography>
                                    </Box>
                                )
                            })}

                        </Box>
                    )
                })
            }
        </Box >

    )
}


const useStyles = makeStyles({
    root: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    },
    toneAndChordBox: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        margin: "0px 4px",
    },
    toneBox: {
        flex: 2,
        width: "100%",
        borderRadius: "5px",
        margin: "2px 0",
    },
    tangentText: {
        color: colors.white,
        marginLeft: "4px",
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)"
    },
    toneText: {
        color: "#555555",
    }

})

export default BarBody;
