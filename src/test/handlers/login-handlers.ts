import { rest } from "msw"
import { Token } from "../../utils/useApiServiceLogin"

export const mockUrl =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"

const apiUrl = process.env.REACT_APP_API_URL
export const loginHandlers = [
    rest.get(`${apiUrl}login`, (req, res, ctx) => {
        return res(ctx.status(204), ctx.set("location", mockUrl))
    }),
    rest.options(`${apiUrl}login`, (req, res, ctx) => {
        return res(ctx.status(200))
    }),
    rest.post<{ code: string }, never, Token>(
        `${apiUrl}login`,
        (req, res, ctx) => {
            return res(
                ctx.json({
                    apiKey: "36476d21801ece54d1f967d89c01cdd5",
                    userID: 5,
                })
            )
        }
    ),
]
