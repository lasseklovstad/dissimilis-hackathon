import { rest } from "msw"
import { songs } from "../data/songs.mock"
import { ISong, ISongMetadata, ISongPost } from "../../models/ISong"
import {
    addChordToBar,
    deleteChord,
    generateNewSong,
    generateNewVoice,
} from "../test-utils"
import { IVoice, IVoiceDuplicatePost, IVoicePost } from "../../models/IVoice"
import { IBar, IBarPost } from "../../models/IBar"
import { emptySong, songWithChords } from "../data/song.mock"
import { songsMetadata } from "../data/songsMetadata.mock"

const apiUrl = process.env.REACT_APP_API_URL

let songDB: ISong[] = [emptySong, songWithChords]
let songMetadataDB: ISongMetadata[] = songsMetadata
const getBarLength = (den: number, num: number) => {
    return (8 / den) * num
}

export const resetSongDB = () => (songDB = [emptySong, songWithChords])

export const songHandlers = [
    rest.post(`${apiUrl}song/search`, (req, res, ctx) => {
        return res(ctx.json(songs))
    }),
    rest.post<ISongPost, never, ISong>(`${apiUrl}song`, (req, res, ctx) => {
        const newSong = generateNewSong(req.body)
        songDB.push(newSong)
        return res(ctx.json(newSong), ctx.status(201))
    }),
    rest.get(`${apiUrl}song/:songId`, (req, res, ctx) => {
        const songId = req.params.songId
        const song = songDB.find((song) => song.songId.toString() === songId)
        return res(ctx.json(song))
    }),
    rest.get<ISongMetadata>(
        `${apiUrl}song/:songId/metadata`,
        (req, res, ctx) => {
            const songId = req.params.songId
            const song = songMetadataDB.find(
                (song) => song.songId.toString() === songId
            )
            return res(ctx.json(song))
        }
    ),
    rest.patch<ISongMetadata, { songId: string }, ISongMetadata>(
        `${apiUrl}song/:songId`,
        (req, res, ctx) => {
            const songId = req.params.songId
            const { title, composer, speed, songNotes } = req.body
            const song = songMetadataDB.find(
                (song) => song.songId.toString() === songId
            )
            if (song) {
                song.title = title
                song.composer = composer
                song.songNotes = songNotes
                song.speed = speed
                return res(ctx.json(song), ctx.status(200))
            }
            return res(ctx.status(404))
        }
    ),
    rest.delete(`${apiUrl}song/:songId`, (req, res, ctx) => {
        return res(ctx.status(204))
    }),
    rest.post<IVoiceDuplicatePost, never, IVoice>(
        `${apiUrl}song/:songId/voice/:voiceId/duplicate`,
        (req, res, ctx) => {
            const { songId, voiceId } = req.params
            const song = songDB.find(
                (song) => song.songId.toString() === songId
            )
            const voice = song?.voices.find(
                (voice) => voice.songVoiceId.toString() === voiceId
            )
            if (voice) {
                const newVoice: IVoice = {
                    ...voice,
                    songVoiceId: voiceId + 1,
                    voiceName: req.body.voiceName,
                    isMain: false,
                }
                return res(ctx.json(newVoice), ctx.status(201))
            } else {
                res(ctx.status(404))
            }
        }
    ),
    rest.post<IVoicePost, never, IVoice>(
        `${apiUrl}song/:songId/voice`,
        (req, res, ctx) => {
            const { songId } = req.params
            const song = songDB.find(
                (song) => song.songId.toString() === songId
            )
            if (song) {
                const newVoice = generateNewVoice(song, req.body)
                return res(ctx.json(newVoice), ctx.status(201))
            } else {
                res(ctx.status(404))
            }
        }
    ),
    rest.post<IBarPost, never, IBar>(
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
    rest.delete<IBarPost, never, IBar>(
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
    ),
]
