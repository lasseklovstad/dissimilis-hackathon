import { ISong, ISongPost } from "../models/ISong"
import { IBar, IBarPost, IChord } from "../models/IBar"
import { screen, waitFor } from "@testing-library/react"
import { IVoicePost, IVoice } from "../models/IVoice"
import { sessionStorageMock } from "./mock/storage.mock"

let chordId = 100

export const resetIndex = () => {
    chordId = 100
}

export const generateNewSong = (song: ISongPost): ISong => {
    return {
        ...song,
        songId: 1000,
        arrangerName: "Test Testesen",
        updatedOn: "2021-06-18T18:02:25.1719881+00:00",
        currentUserHasWriteAccess: true,
        voices: [
            {
                songVoiceId: 2000,
                songId: 1000,
                voiceName: "Main",
                isMain: true,
                voiceNumber: 1,
                bars: [
                    {
                        barId: 3000,
                        songVoiceId: 2000,
                        songId: 1000,
                        position: 1,
                        repBefore: false,
                        repAfter: false,
                        voltaBracket: null,
                        chords: [
                            {
                                chordId: null,
                                position: 0,
                                length: 8,
                                chordName: null,
                                notes: ["Z"],
                            },
                        ],
                    },
                ],
            },
        ],
    }
}

export const generateNewVoice = (song: ISong, voice: IVoicePost): IVoice => {
    return {
        songVoiceId: 2001,
        songId: song.songId,
        voiceName: voice.voiceName,
        isMain: false,
        voiceNumber: voice.voiceId,
        bars: [
            {
                barId: 3000,
                songVoiceId: 2001,
                songId: song.songId,
                position: 1,
                repBefore: false,
                repAfter: false,
                voltaBracket: null,
                chords: [
                    {
                        chordId: null,
                        position: 0,
                        length: 8,
                        chordName: null,
                        notes: ["Z"],
                    },
                ],
            },
        ],
    }
}

// Sort based on position
const compareChord = (a: IChord, b: IChord) => {
    if (a.position < b.position) {
        return -1
    }
    if (a.position > b.position) {
        return 1
    }
    return 0
}

export const addChordToBar = (
    bar: IBar,
    newChord: IBarPost,
    barLength: number
) => {
    chordId = chordId + 1
    const chords: IChord[] = [
        ...removeEmptyChords(bar.chords),
        { ...newChord, chordId },
    ].sort(compareChord)
    return { ...bar, chords: fillWithEmptyChords(chords, barLength) }
}

export const deleteChord = (bar: IBar, chordId: number, barLength: number) => {
    const chords = removeEmptyChords(bar.chords).filter(
        (chord) => chord.chordId !== chordId
    )
    return { ...bar, chords: fillWithEmptyChords(chords, barLength) }
}

const removeEmptyChords = (chords: IChord[]) => {
    return chords.filter((chord) => chord.notes[0] !== "Z")
}

const createEmptyChord = (position: number, length: number) => {
    return {
        position,
        notes: ["Z"],
        length,
        chordId: null,
        chordName: null,
    }
}

// Get an array of empty chords which will fill the space before currentChord
// and after previousChord
// If previousChord === undefined assume fra start of bar
const getEmptyBefore = (currentChord: IChord, previousChord?: IChord) => {
    const lastChordEnd = previousChord
        ? previousChord.position + previousChord.length
        : 0
    const lengthNeededBefore = currentChord.position - lastChordEnd

    if (lengthNeededBefore > 0) {
        return [
            createEmptyChord(
                currentChord.position - lengthNeededBefore,
                lengthNeededBefore
            ),
        ]
    }
    return []
}

// Get an array of empty chords which will fill the space after currentChord
const getEmptyAfter = (currentChord: IChord, barLength: number) => {
    const lengthNeededAfter =
        barLength - (currentChord.position + currentChord.length)

    if (lengthNeededAfter > 0) {
        return [
            createEmptyChord(barLength - lengthNeededAfter, lengthNeededAfter),
        ]
    }
    return []
}

const fillWithEmptyChords = (chords: IChord[], barLength: number) => {
    if (chords.length === 0) {
        return [createEmptyChord(0, barLength)]
    }

    return chords.reduce((allChords, currentChord, index, chordsArray) => {
        const numberOfChords = chordsArray.length
        const isLastChord = numberOfChords - 1 === index
        const isFirstChord = index === 0
        if (isFirstChord && isLastChord) {
            const emptyBefore = getEmptyBefore(currentChord)
            const emptyAfter = getEmptyAfter(currentChord, barLength)
            return [...emptyBefore, currentChord, ...emptyAfter]
        } else if (isFirstChord && !isLastChord) {
            const emptyBefore = getEmptyBefore(currentChord)
            return [...emptyBefore, currentChord]
        } else if (!isFirstChord && isLastChord) {
            const emptyAfter = getEmptyAfter(currentChord, barLength)
            return [...allChords, currentChord, ...emptyAfter]
        } else {
            // A Chord in the middle we only add empty notes before
            const previousChord = chordsArray[index - 1]
            const emptyBefore = getEmptyBefore(currentChord, previousChord)
            return [...allChords, ...emptyBefore, currentChord]
        }
    }, [] as IChord[])
}

export const waitDoneLoading = async () => {
    await waitFor(() =>
        expect(screen.queryAllByRole("progressbar")).toHaveLength(0)
    )
    await waitFor(() =>
        expect(screen.queryAllByLabelText("Loading")).toHaveLength(0)
    )
}

export const login = () => {
    sessionStorageMock.setItem("apiKey", "MockApiKey")
    sessionStorageMock.setItem("userId", "10")
}

export const logout = () => {
    sessionStorageMock.clear()
}
