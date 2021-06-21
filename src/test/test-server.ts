import { setupServer } from "msw/node"
import { rest } from "msw"
import { user } from "./data/user.mock"
import { songs } from "./data/songs.mock"
import { addChordToBar, deleteChord, generateNewSong } from "./test-utils"
import { ISong, ISongPost } from "../models/ISong"
import { emptySong, songWithChords } from "./data/song.mock"
import { IBar, IBarPost } from "../models/IBar"
import { Token } from "../utils/useApiServiceLogin"

const apiUrl = process.env.REACT_APP_API_URL

let songDB: ISong[] = [emptySong, songWithChords]

export const resetSongDB = () => (songDB = [emptySong, songWithChords])
export const mockUrl =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
export const server = setupServer(
    rest.get(`${apiUrl}login`, (req, res, ctx) => {
        return res(ctx.status(204), ctx.set("location", mockUrl))
    }),
    rest.options(`${apiUrl}login`, (req, res, ctx) => {
        return res(ctx.status(200))
    }),
    rest.post<{ code: string }, Token>(`${apiUrl}login`, (req, res, ctx) => {
        return res(
            ctx.json({
                apiKey: "36476d21801ece54d1f967d89c01cdd5",
                userID: 5,
            })
        )
    }),
    rest.get(`${apiUrl}user/currentUser`, (req, res, ctx) => {
        return res(ctx.json(user))
    }),
    rest.post(`${apiUrl}song/search`, (req, res, ctx) => {
        return res(ctx.json(songs))
    }),
    rest.post<ISongPost, ISong>(`${apiUrl}song`, (req, res, ctx) => {
        const newSong = generateNewSong(req.body)
        songDB.push(newSong)
        return res(ctx.json(newSong), ctx.status(201))
    }),
    rest.get(`${apiUrl}song/:songId`, (req, res, ctx) => {
        const songId = req.params.songId
        const song = songDB.find((song) => song.songId.toString() === songId)
        return res(ctx.json(song))
    }),
    rest.delete(`${apiUrl}song/:songId`, (req, res, ctx) => {
        return res(ctx.status(204))
    }),
    rest.post<IBarPost, IBar>(
        `${apiUrl}song/:songId/voice/:voiceId/bar/:barId/note`,
        (req, res, ctx) => {
            const { songId, voiceId, barId } = req.params

            const song = songDB.find(
                (song) => song.songId.toString() === songId
            )
            const voice = song?.voices.find(
                (voice) => voice.songVoiceId.toString() === voiceId
            )
            let bar = voice?.bars.find((bar) => bar.barId.toString() === barId)

            if (bar && song) {
                bar = addChordToBar(
                    bar,
                    req.body,
                    getBarLength(song.denominator, song.numerator)
                )
                return res(ctx.status(201), ctx.json(bar))
            } else {
                return res(ctx.status(404))
            }
        }
    ),
    rest.delete<IBarPost, IBar>(
        `${apiUrl}song/:songId/voice/:voiceId/bar/:barId/note/:noteId`,
        (req, res, ctx) => {
            const { songId, voiceId, barId, noteId } = req.params

            const song = songDB.find(
                (song) => song.songId.toString() === songId
            )
            const voice = song?.voices.find(
                (voice) => voice.songVoiceId.toString() === voiceId
            )
            let bar = voice?.bars.find((bar) => bar.barId.toString() === barId)

            if (bar && song) {
                bar = deleteChord(
                    bar,
                    parseInt(noteId),
                    getBarLength(song.denominator, song.numerator)
                )
                return res(ctx.status(201), ctx.json(bar))
            } else {
                return res(ctx.status(404))
            }
        }
    )
)

const getBarLength = (den: number, num: number) => {
    return (8 / den) * num
}
