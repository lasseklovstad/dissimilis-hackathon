import { ISong } from "../../models/ISong"

export const emptySong: ISong = {
    songId: 1,
    title: "Stairway to heaven",
    numerator: 4,
    denominator: 4,
    arrangerName: "Test Testesen",
    updatedOn: "2021-06-18T18:02:25.1719881+00:00",
    voices: [
        {
            songVoiceId: 1,
            songId: 1,
            title: "Main",
            isMain: true,
            partNumber: 1,
            bars: [
                {
                    barId: 1,
                    songVoiceId: 1,
                    songId: 1,
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
