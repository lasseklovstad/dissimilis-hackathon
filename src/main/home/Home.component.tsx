import React, {useCallback, useEffect, useRef, useState} from "react"
import {Song} from "../../components/song/Song.component"
import {
    Fab,
    FormControl,
    FormControlLabel,
    IconButton,
    MenuItem,
    Select,
    Switch,
    Typography
} from "@material-ui/core"
import {SelectInputProps} from "@material-ui/core/Select/SelectInput"
import {NotationTypeModel} from "../../model/notationType.model"
import {MusicIcon} from "../../components/musicIcon/MusicIcon.component"
import {makeStyles} from "@material-ui/core/styles"
import {barLineRegex, getNote, noteAndChordRegex} from "../../util/note.util"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import {getNotes} from "../../util/chord.util"

export type HomeProps = {}

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}))

export const Home: React.FC<HomeProps> = props => {
    const classes = useStyles()
    const [displayType, setDisplayType] = useState<NotationTypeModel>("DISSIMILIS_NOTATION")
    const [song,] = useState('[| [C2E2G2] [C1E1G1] [C1E1G1] | _C/2 ^^D/2 z3 |]')
    const [noteValue, setNoteValue] = useState<'whole' | 'half' | 'quarter' | 'eighth'>('whole')
    const [abcSignature,] = useState('4/4')
    const [abcNoteLength,] = useState<'1/4' | '1/8'>('1/4')
    const [abcNoteValue, setAbcNoteValue] = useState('4')
    const [chordMode,setChordMode]=useState(true)

    const {songElements, addMeasure, removeMeasure, addChord} = useSong(song, abcNoteLength, abcNoteValue,chordMode)


    const handleChange: SelectInputProps['onChange'] = (ev) => {
        setDisplayType(ev.target.value as NotationTypeModel)
    }

    const getNoteColor = (value: string): 'primary' | 'default' => {
        return value === noteValue ? 'primary' : 'default'
    }

    const getTextColor = (value: string): 'white' | undefined => {
        return value === noteValue ? 'white' : undefined
    }

    const handleClickNoteValue = (value: 'whole' | 'half' | 'quarter' | 'eighth') => () => {
        setNoteValue(value)
        switch (value) {
            case "whole":
                setAbcNoteValue('4')
                break
            case "half":
                setAbcNoteValue('2')
                break
            case "quarter":
                setAbcNoteValue('')
                break
            case "eighth":
                setAbcNoteValue('/2')
                break
        }
    }


    return <React.Fragment>
        <FormControl style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '10px',
            alignItems: 'center',
            justifyContent: 'space-around'
        }}>
            <Select
                value={displayType}
                onChange={handleChange}
                label={'Visning'}
            >
                <MenuItem value={"CHORD_NOTATION"}>Akkorder</MenuItem>
                <MenuItem value={"DISSIMILIS_NOTATION"}>Farger</MenuItem>
            </Select>
            <FormControlLabel
                control={<Switch checked={chordMode} onChange={(ev,checked)=>setChordMode(checked)} name="chordmode" />}
                label="Akkordmodus"
            />

            <div className={classes.root}>
                <Fab size={"small"}
                     color={getNoteColor('whole')}
                     onClick={handleClickNoteValue('whole')}><MusicIcon color={getTextColor('whole')}
                                                                        navn={"whole-note"}/></Fab>
                <Fab size={"small"}
                     color={getNoteColor('half')}
                     onClick={handleClickNoteValue('half')}><MusicIcon color={getTextColor('half')} navn={"half-note"}/></Fab>
                <Fab size={"small"}
                     color={getNoteColor('quarter')}
                     onClick={handleClickNoteValue('quarter')}><MusicIcon color={getTextColor('quarter')}
                                                                          navn={"quarter-note"}/></Fab>
                <Fab size={"small"}
                     color={getNoteColor('eighth')}
                     onClick={handleClickNoteValue('eighth')}><MusicIcon color={getTextColor('eighth')}
                                                                         navn={"eighth-note"}/></Fab>
            </div>


        </FormControl>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={"h6"}>{abcSignature}</Typography>
            <Song displayType={displayType} song={songElements} abcNoteValue={abcNoteValue} onAddChord={addChord}/>
            <IconButton onClick={addMeasure}><AddIcon/></IconButton>
            <IconButton onClick={removeMeasure}><RemoveIcon/></IconButton>
        </div>
    </React.Fragment>
}

const useSong = (defaultSong: string, noteLength: string, selectedNoteValue: string, chordMode:boolean) => {
    const defaultSongElements = defaultSong.split(barLineRegex)
    const [songElements, setSongElements] = useState(defaultSongElements.slice(1, -1))
    const song = useRef(defaultSong)

    useEffect(() => {
        song.current = songElements.reduce((acc, value) => {
            return acc += value
        }, '')
    }, [songElements])

    useEffect(() => {
        setSongElements(elements => {
            return elements.map((element) => {
                if (!barLineRegex.test(element)) {
                    return cleanUpMeasure(element, selectedNoteValue)
                } else {
                    return element
                }
            })
        })
    }, [selectedNoteValue])

    const addMeasure = useCallback(() => {
        setSongElements(elements => {
            const newElements = elements.slice()
            const lastElement = newElements.pop()
            if (lastElement) {
                newElements.push('|')
                newElements.push(getEmptyMeasure(noteLength, selectedNoteValue))
                newElements.push(lastElement)
                return newElements
            } else {
                return elements
            }
        })
    }, [noteLength, selectedNoteValue])


    const removeMeasure = () => {
        setSongElements(elements => {
            const newElements = elements.slice()
            const lastElement = newElements.pop()
            if (lastElement && elements.length > 3) {
                newElements.pop()
                newElements.pop()
                newElements.push(lastElement)
                return newElements
            } else {
                return elements
            }
        })
    }

    const addChord = (chord: string, measureIndex: number, noteIndex: number) => {
        setSongElements(elements => {
            return elements.map((el,i)=>{
                if(i===measureIndex){
                    let measure=' '
                    let match
                    let currentIndex = 0
                    while(match = noteAndChordRegex.exec(el)){
                        if(currentIndex===noteIndex){
                            const noteLength = getNoteLength(match[0])
                            if(chordMode){
                                const notes = chord ? getNotes(chord)?.reduce((acc,note)=>acc+note+noteLength,''):('z'+noteLength+' ')
                                measure+=('['+notes+'] ')
                            }else{
                                const notes = chord ? (getNote(chord)+noteLength+' '):('z'+noteLength+' ')
                                measure+=('['+notes+'] ')
                            }

                        }else {
                            measure+=(match[0]+' ')
                        }
                        currentIndex++
                    }
                    console.log(measure)
                    return measure
                }else{
                    return el
                }
            })
        })
    }

    return {songElements, addMeasure, removeMeasure, addChord}
}

const getNoteLength =(note:string)=>{
    let length=''
    let match
    const regexp = /[_^]*[A-Za-z](\/?\d*)/g
    while(match = regexp.exec(note)){
        if(match[1]){
            length=match[1]
        }
    }
    return length
}

const getEmptyMeasure = (noteLength: string, selectedNoteValue: string): string => {
    let measure = ''
    const noteLengthNumber = parseInt(noteLength.split('/')[0]) / parseInt(noteLength.split('/')[1])
    let numberOfNotes = 4
    if (selectedNoteValue.indexOf('/') > -1) {
        const value = parseInt(selectedNoteValue.slice(1))
        numberOfNotes = value / noteLengthNumber
    } else if (selectedNoteValue !== '') {
        const value = parseInt(selectedNoteValue)
        numberOfNotes = 1 / (value * noteLengthNumber)
    }

    console.log(numberOfNotes)

    for (let i = 0; i < numberOfNotes; i++) {
        measure += ('z' + selectedNoteValue + ' ')
    }

    return measure
}

const cleanUpMeasure = (measure: string, noteLength: string) => {
    let newMeasure = measure
    if (noteLength === '2') {
        newMeasure = measure.replace(/\bz4\b/ig, 'z2 z2')
        newMeasure = newMeasure.replace(/(\bz\b) \1/ig, 'z2')
        newMeasure = newMeasure.replace(/(\bz\/2\b) \1 \1 \1/ig, 'z2')
    } else if (noteLength === '') {
        newMeasure = measure.replace(/\bz2\b/ig, 'z z')
        newMeasure = newMeasure.replace(/(\bz4\b)/ig, 'z z z z')
        newMeasure = newMeasure.replace(/(\bz3\b)/ig, 'z z z')
        newMeasure = newMeasure.replace(/(\bz\/2\b) \1/ig, 'z')
    } else if (noteLength === '/2') {
        newMeasure = measure.replace(/\bz\b/ig, 'z/2 z/2')
        newMeasure = newMeasure.replace(/(\bz2\b)/ig, 'z/2 z/2 z/2 z/2')
        newMeasure = newMeasure.replace(/(\bz4\b)/ig, 'z/2 z/2 z/2 z/2 z/2 z/2 z/2 z/2')
    } else if (noteLength === '4') {
        newMeasure = measure.replace(/(\bz2\b) \1/ig, 'z4')
        newMeasure = newMeasure.replace(/(\bz\b)( \1){3}/ig, 'z4')
        newMeasure = newMeasure.replace(/(\bz\/2\b)( \1){7}/ig, 'z4')
    }
    return newMeasure
}
