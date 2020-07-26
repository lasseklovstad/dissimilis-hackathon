import React, { useContext, useState } from "react";
import { Box, makeStyles, Typography, ButtonBase, Menu, MenuItem } from "@material-ui/core";
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
        if (result.length === 0) return notes[0];
        return result[0].replace(/[M]/g, '');
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
            newColor = colors.gray_500;
            break;
        default:
            newColor = "transparent";
    }
    return newColor;
}

const initialState = {
    mouseX: null,
    mouseY: null,
};


export const BarBody: React.FC<BarBodyProps> = props => {
    const classes = useStyles();
    const { showPossiblePositions, insertNewNoteOrChord, availablePositions, selectPositionArray } = useContext(SongToolsContext);
    const { song: { voices }, getTimeSignature, deleteNote } = useContext(SongContext);

    let tempArrayOfChordsLength: any = [];
    let tempArrayOfChords: any = [];
    for (let i = 0; i < voices[0].bars[props.barNumber].chordsAndNotes.length; i++) {
        tempArrayOfChords.push(getChord(voices[0].bars[props.barNumber].chordsAndNotes[i].notes));
        tempArrayOfChordsLength.push(voices[0].bars[props.barNumber].chordsAndNotes[i].length);
    }

    const [state, setState] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialState);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const [rightClicked, setRightClicked] = useState(-1);

    const handleClose = (method?: string) => {
        if (method === "delete") {

            if (rightClicked >= 0) {
                let tempChordsAndNotes: IChordAndNotes[] = voices[props.voiceId].bars[props.barNumber].chordsAndNotes.slice();;

                const newNote: IChordAndNotes = { length: 1, notes: [""] };
                tempChordsAndNotes[rightClicked] = newNote;
                for (let i = rightClicked; i < voices[props.voiceId].bars[props.barNumber].chordsAndNotes[rightClicked].length + rightClicked - 1; i++) {
                    tempChordsAndNotes.splice(i, 0, newNote);
                }



                deleteNote(props.voiceId, props.barNumber, tempChordsAndNotes);
                setPositionArray([])
            }


        }

        setState(initialState);
    };

    const calculateFlexBasis = (length: number) => {
        let timeSignatureNumerator = getTimeSignature()[0];
        if (getTimeSignature()[1] === 4) timeSignatureNumerator *= 2;

        let result;
        let base = 100 / timeSignatureNumerator;
        switch (length) {
            case 1:
                result = base + "%";
                break;
            case 2:
                result = base * 2 + "%";
                break;
            case 4:
                result = base * 4 + "%";
                break;
            case 8:
                result = base * 8 + "%";
                break;
            default:
                result = "100%";
        }
        return result;
    }

    const chordsInBar = tempArrayOfChords.map((item: any, i: any) => {
        return (
            <Typography key={i} variant="body1" style={{ flexBasis: calculateFlexBasis(tempArrayOfChordsLength[i]), overflow: "hidden", textOverflow: "ellipsis" }} className={classes.toneText}>{item}</Typography>
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
                        <Box onContextMenu={() => setRightClicked(i)} key={i} className={classes.toneAndChordBox} style={{ flex: note.length, height: !props.height ? "100%" : props.height - 24 + "px" }} flexDirection="column" >
                            {note.notes.map((type, index) => {
                                const number = tangentToNumber(type);
                                return (
                                    <>
                                        <Box
                                            key={index} className={classes.toneBox}
                                            onMouseEnter={() => { if (showPossiblePositions) { setPositionArray(selectPositionArray(props.voiceId, props.barNumber, i)); } }}
                                            onMouseLeave={() => { if (showPossiblePositions) { setPositionArray([]) } }}
                                            style={{ cursor: showPossiblePositions ? (!availablePositions[props.voiceId][props.barNumber].find(arr => arr.includes(i))) ? 'context-menu' : "pointer" : "default", backgroundColor: emptySpace(i) ? (positionArray.includes(i) ? colors.focus : "transparent") : getColor(type), outlineColor: "black", boxShadow: emptySpace(i) ? (positionArray.includes(i) ? "none" : "0 0 5px black") : "none" }}
                                            component={ButtonBase}
                                            onClick={() => {
                                                if (showPossiblePositions && availablePositions[props.voiceId][props.barNumber].find(arr => arr.includes(i)) != null) {
                                                    insertNewNoteOrChord(i, props.barNumber, props.voiceId)
                                                }
                                            }}
                                            onContextMenu={handleClick}
                                        >
                                            <Typography className={classes.tangentText} >{number === 0 ? "" : number}</Typography>
                                        </Box>
                                        <Menu
                                            keepMounted
                                            open={state.mouseY !== null}
                                            onClose={() => handleClose("")}
                                            anchorReference="anchorPosition"
                                            anchorPosition={
                                                state.mouseY !== null && state.mouseX !== null
                                                    ? { top: state.mouseY, left: state.mouseX }
                                                    : undefined
                                            }
                                        >
                                            <MenuItem onClick={() => handleClose("delete")}>Slett</MenuItem>
                                        </Menu>
                                    </>
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
        textAlign: "left",
    },
    tangentText: {
        color: colors.white,
        top: "50%",
        width: "100%",
        marginLeft: "8px",
    },
    toneText: {
        color: "#555555",
    }

})

export default BarBody;
