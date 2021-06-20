import { ISong, ISongPost } from "../models/ISong"
import { IBar, IBarPost, IChord } from "../models/IBar"
import { screen, waitFor } from "@testing-library/react"
import { sessionStorageMock } from "../setupTests"

export const generateNewSong = (song: ISongPost): ISong => {
    return {
        ...song,
        songId: 1000,
        arrangerName: "Test Testesen",
        updatedOn: "2021-06-18T18:02:25.1719881+00:00",
        voices: [
            {
                songVoiceId: 2000,
                songId: 1000,
                title: "Main",
                isMain: true,
                partNumber: 1,
                bars: [
                    {
                        barId: 3000,
                        songVoiceId: 2000,
                        songId: 1000,
                        position: 1,
                        repBefore: false,
                        repAfter: false,
                        house: null,
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

export const addChordToBar = (bar: IBar, newChord: IBarPost) => {
    const chords = bar.chords.reduce((allChords, currentChord) => {
        if (currentChord.position === newChord.position) {
            return [
                ...allChords,
                {
                    ...newChord,
                    chordId: 1,
                },
                {
                    ...currentChord,
                    position: currentChord.position + newChord.length,
                    length: currentChord.length - newChord.length,
                },
            ]
        }
        return [...allChords, currentChord]
    }, [] as IChord[])

    return { ...bar, chords }
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
