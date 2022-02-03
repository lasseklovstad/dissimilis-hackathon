import { rest } from "msw"
import { user } from "../data/user.mock"
import { IAdminStatuses, IUser } from "../../models/IUser"

const apiUrl = process.env.REACT_APP_API_URL
export const userHandlers = [
    rest.get<IAdminStatuses>(
        `${apiUrl}user/currentUser/adminStatuses`,
        (req, res, ctx) => {
            return res(
                ctx.json({
                    groupAdmin: true,
                    organisationAdmin: true,
                    systemAdmin: true,
                })
            )
        }
    ),
    rest.get<IUser>(`${apiUrl}user/currentUser`, (req, res, ctx) => {
        return res(ctx.json(user))
    }),
]
