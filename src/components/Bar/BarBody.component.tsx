import React, { useContext, useState } from "react"
import {
    Box,
    makeStyles,
    Typography,
    ButtonBase,
    Menu,
    MenuItem,
} from "@material-ui/core"
import { Chord } from "@tonaljs/tonal"
import { colors } from "../../utils/colors"
import { IChordAndNotes } from "../../models/IBar"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"
import { SongContext } from "../../views/SongView/SongContextProvider.component"

const useStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    },
    toneAndChordBox: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
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
    },
})

const initialState = {
    mouseX: null,
    mouseY: null,
}

export type BarBodyProps = {
    barNumber: number
    chordsAndNotes: IChordAndNotes[]
    height?: number
    voiceId: number
    exportMode?: boolean
    rowsPerSheet?: number
}

/* Gets the chord based on notes. The package we use (tonaljs) uses the tone "B" instead of "H" so we need
to replace H with B to get the right chord. 
*/
const getChord = (notes: string[]): string => {
    const tempArray = notes.slice()
    const index = tempArray.indexOf("H")
    if (index !== -1) {
        tempArray[index] = "B"
    }

    if (tempArray.length === 1) {
        return notes[0]
    }
    const result = Chord.detect(tempArray.reverse())
    if (result.length === 0) return notes[0]
    return result[0].replace(/M/g, "").replace(/B/g, "H")
}

export const tangentToNumber = (tangent: string): number => {
    let result = -1
    switch (tangent) {
        case "C#":
            result = 4
            break
        case "D#":
            result = 5
            break
        case "F#":
            result = 1
            break
        case "G#":
            result = 2
            break
        case "A#":
            result = 3
            break
        default:
            result = 0
    }
    return result
}

export const getColor = (note: string): string => {
    let newColor = "transparent"
    switch (note) {
        case "C":
            newColor = colors.C
            break
        case "D":
            newColor = colors.D
            break
        case "E":
            newColor = colors.E
            break
        case "F":
            newColor = colors.F
            break
        case "G":
            newColor = colors.G
            break
        case "A":
            newColor = colors.A
            break
        case "H":
            newColor = colors.H
            break
        case "C#":
        case "D#":
        case "F#":
        case "G#":
        case "A#":
            newColor = colors.gray_500
            break
        default:
            newColor = "transparent"
    }
    return newColor
}

export const BarBody: React.FC<BarBodyProps> = (props) => {
    const classes = useStyles()

    const [positionArray, setPositionArray] = useState<number[]>([])
    const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
        mouseX: null | number
        mouseY: null | number
    }>(initialState)
    const [rightClicked, setRightClicked] = useState(-1)

    const {
        showPossiblePositions,
        insertNewNoteOrChord,
        availablePositions,
        selectPositionArray,
    } = useContext(SongToolsContext)
    const {
        song: { voices },
        getTimeSignature,
        deleteNote,
    } = useContext(SongContext)

    const tempArrayOfChordsLength = voices[0].bars[
        props.barNumber
    ].chordsAndNotes.map((val) => val.length)

    const tempArrayOfChords = voices[0].bars[
        props.barNumber
    ].chordsAndNotes.map((val) => getChord(val.notes))

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setRightClickCoordinates({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        })
    }

    const handleClose = (method?: string) => {
        if (method === "delete") {
            if (rightClicked >= 0) {
                const tempChordsAndNotes: IChordAndNotes[] = voices[
                    props.voiceId
                ].bars[props.barNumber].chordsAndNotes.slice()
                const newNote: IChordAndNotes = { length: 1, notes: [" "] }
                tempChordsAndNotes[rightClicked] = newNote
                for (
                    let i = rightClicked;
                    i <
                    voices[props.voiceId].bars[props.barNumber].chordsAndNotes[
                        rightClicked
                    ].length +
                        rightClicked -
                        1;
                    i++
                ) {
                    tempChordsAndNotes.splice(i, 0, newNote)
                }
                deleteNote(props.voiceId, props.barNumber, tempChordsAndNotes)
                setPositionArray([])
            }
        }
        setRightClickCoordinates(initialState)
    }

    const calculateFlexBasis = (length: number) => {
        let timeSignatureNumerator = getTimeSignature()[0]
        if (getTimeSignature()[1] === 4) timeSignatureNumerator *= 2

        let result
        const base = 100 / timeSignatureNumerator
        switch (length) {
            case 1:
                result = `${base}%`
                break
            case 2:
                result = `${base * 2}%`
                break
            case 3:
                result = `${base * 3}%`
                break
            case 4:
                result = `${base * 4}%`
                break
            case 5:
                result = `${base * 5}%`
                break
            case 6:
                result = `${base * 6}%`
                break
            case 7:
                result = `${base * 7}%`
                break
            case 8:
                result = `${base * 8}%`
                break
            default:
                result = "100%"
        }
        return result
    }

    // Displaying the chords from the master sheet in the song
    const chordsInBar = tempArrayOfChords.map((item, i) => {
        return (
            <Typography
                key={i}
                variant="body1"
                style={{
                    flexBasis: calculateFlexBasis(tempArrayOfChordsLength[i]),
                    textOverflow: "ellipsis",
                    paddingLeft: "4px",
                    position: "relative",
                    top: "-10px",
                    height: "0",
                }}
                className={classes.toneText}
            >
                {item}
            </Typography>
        )
    })

    const emptySpace = (i: number) => {
        if (
            showPossiblePositions &&
            availablePositions[props.voiceId][props.barNumber] !== undefined &&
            availablePositions[props.voiceId][props.barNumber].find((arr) =>
                arr.includes(i)
            )
        ) {
            return true
        }
        return false
    }

    return (
        <Box height={props.height || "100%"} display="flex" width="100%">
            {chordsInBar}
            {props.chordsAndNotes.map((note, i) => {
                return (
                    <Box
                        key={i}
                        onContextMenu={() => setRightClicked(i)}
                        flex={note.length}
                        flexDirection="column"
                    >
                        {note.notes.map((type, index) => {
                            const number = tangentToNumber(type)
                            return (
                                <>
                                    <Box
                                        key={index}
                                        className={classes.toneBox}
                                        onMouseEnter={() => {
                                            if (showPossiblePositions) {
                                                setPositionArray(
                                                    selectPositionArray(
                                                        props.voiceId,
                                                        props.barNumber,
                                                        i
                                                    )
                                                )
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (showPossiblePositions) {
                                                setPositionArray([])
                                            }
                                        }}
                                        style={{
                                            cursor: showPossiblePositions
                                                ? availablePositions[
                                                      props.voiceId
                                                  ][props.barNumber] !==
                                                      undefined &&
                                                  !availablePositions[
                                                      props.voiceId
                                                  ][
                                                      props.barNumber
                                                  ].find((arr) =>
                                                      arr.includes(i)
                                                  )
                                                    ? "context-menu"
                                                    : "pointer"
                                                : "default",
                                            backgroundColor: emptySpace(i)
                                                ? positionArray.includes(i)
                                                    ? colors.focus
                                                    : "transparent"
                                                : getColor(type),
                                            border: emptySpace(i)
                                                ? positionArray.includes(i)
                                                    ? "none"
                                                    : `1px solid${colors.gray_400}`
                                                : "none",
                                            opacity:
                                                showPossiblePositions &&
                                                !emptySpace(i)
                                                    ? "80%"
                                                    : "100%",
                                        }}
                                        tabIndex={!props.exportMode ? 1 : -1}
                                        component={ButtonBase}
                                        onClick={() => {
                                            if (
                                                showPossiblePositions &&
                                                availablePositions[
                                                    props.voiceId
                                                ][props.barNumber] !==
                                                    undefined &&
                                                availablePositions[
                                                    props.voiceId
                                                ][props.barNumber].find((arr) =>
                                                    arr.includes(i)
                                                ) != null
                                            ) {
                                                insertNewNoteOrChord(
                                                    i,
                                                    props.barNumber,
                                                    props.voiceId
                                                )
                                            }
                                        }}
                                        onContextMenu={handleClick}
                                    >
                                        <Typography
                                            className={classes.tangentText}
                                            variant="body2"
                                        >
                                            {number === 0 ? " " : number}
                                        </Typography>
                                    </Box>
                                    {!props.exportMode ? (
                                        <Menu
                                            keepMounted
                                            open={
                                                rightClickCoordinates.mouseY !==
                                                null
                                            }
                                            onClose={() => handleClose("")}
                                            anchorReference="anchorPosition"
                                            anchorPosition={
                                                rightClickCoordinates.mouseY !==
                                                    null &&
                                                rightClickCoordinates.mouseX !==
                                                    null
                                                    ? {
                                                          top:
                                                              rightClickCoordinates.mouseY,
                                                          left:
                                                              rightClickCoordinates.mouseX,
                                                      }
                                                    : undefined
                                            }
                                        >
                                            <MenuItem
                                                tabIndex={-1}
                                                onClick={() =>
                                                    handleClose("delete")
                                                }
                                            >
                                                Slett
                                            </MenuItem>
                                        </Menu>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )
                        })}
                    </Box>
                )
            })}
        </Box>
    )
}
