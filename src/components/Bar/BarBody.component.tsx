import React, { useContext, useState } from "react";
import { Box, makeStyles, Typography, ButtonBase } from "@material-ui/core";
import colors from "../../utils/colors";
import { IChordAndNotes } from "../../models/IBar";
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component";
import { Chord } from "@tonaljs/tonal";
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { notes } from '../../models/notes';
import { chords } from "../../models/chords";


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
    const { showPossiblePositions, insertNewNoteOrChord, availablePositions, selectPositionArray, selectedNoteKey } = useContext(SongToolsContext);

    const { song: { voices } } = useContext(SongContext);

    let tempArrayOfChordsLength: any = [];
    let tempArrayOfChords: any = [];
    for (let i = 0; i < voices[0].bars[props.barNumber].chordsAndNotes.length; i++) {
        tempArrayOfChords.push(getChord(voices[0].bars[props.barNumber].chordsAndNotes[i].notes));
        tempArrayOfChordsLength.push(voices[0].bars[props.barNumber].chordsAndNotes[i].length);
    }

    const calculateFlexBasis = (length: number) => {
        //Hente ut [teller, nevner], ligger metode i songContext
        //if (getTimeSignature()[1] == 4) timeSignatureNumerator *= 2;

        let result;
        switch (length) {
            case 1:
                result = "12.5%";
                break;
            case 2:
                result = "25%";
                break;
            case 4:
                result = "50%";
                break;
            case 8:
                result = "100%";
                break;
            default:
                result = "100%";
        }
        return result;
    }

    const chordsInBar = tempArrayOfChords.map((item: any, i: any) => {
        return (
            <Typography key={i} variant="body1" style={{ flexBasis: calculateFlexBasis(tempArrayOfChordsLength[i]) }} className={classes.toneText}>{item}</Typography>
        )
    })

    const [positionArray, setPositionArray] = useState<number[]>([]);
    const emptySpace = (i: number) => {
        if (showPossiblePositions && availablePositions[props.voiceId][props.barNumber].find(arr => arr.includes(i))) {
            return true
        }
        return false;
    }

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
                                    <Box
                                        key={index} className={classes.toneBox}
                                        onMouseEnter={() => { if (showPossiblePositions) { setPositionArray(selectPositionArray(props.voiceId, props.barNumber, i)); } }}
                                        onMouseLeave={() => { if (showPossiblePositions) { setPositionArray([]) } }}
                                        style={{ backgroundColor: emptySpace(i) ? (positionArray.includes(i) ? colors.focus : "transparent") : getColor(type), outlineColor: "black", boxShadow: emptySpace(i) ? (positionArray.includes(i) ? "none" : "0 0 5px black") : "none" }}
                                        component={ButtonBase}
                                        onClick={() => {
                                            if (showPossiblePositions && availablePositions[props.voiceId][props.barNumber].find(arr => arr.includes(i)) != null) {
                                                insertNewNoteOrChord(i, props.barNumber, props.voiceId)
                                            }
                                        }}

                                    >

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
