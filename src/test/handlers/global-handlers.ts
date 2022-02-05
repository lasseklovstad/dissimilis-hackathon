import { rest } from "msw"
import { IOptions } from "../../models/IOptions"
import { IIntervals } from "../../models/IIntervals"

const apiUrl = process.env.REACT_APP_API_URL
export const globalHandlers = [
    rest.get<IOptions>(`${apiUrl}note/options`, (req, res, ctx) => {
        return res(
            ctx.json({
                singleNoteOptions: ["C", "D", "E", "F", "G", "A", "H"],
                chordOptions: ["C", "D", "E", "F", "G", "A", "H"],
            })
        )
    }),
    rest.get<IIntervals>(
        `${apiUrl}note/chord/intervalNames`,
        (req, res, ctx) => {
            return res(
                ctx.json({
                    intervalNames: ["Root", "Third", "Fifth"],
                })
            )
        }
    ),
]
