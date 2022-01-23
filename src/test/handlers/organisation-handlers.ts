import { rest } from "msw"
import { IOrganisationIndex } from "../../models/IOrganisation"
import {
    GroupFilter,
    OrganisationFilter,
} from "../../utils/useApiServiceGroups"
import { IGroupIndex } from "../../models/IGroup"

const apiUrl = process.env.REACT_APP_API_URL
export const organisationHandlers = [
    rest.get<IGroupIndex[], { filterBy: GroupFilter }>(
        `${apiUrl}organisations/groups`,
        (req, res, ctx) => {
            return res(ctx.json([]))
        }
    ),
    rest.get<IOrganisationIndex[], { filterByRole: OrganisationFilter }>(
        `${apiUrl}organisations`,
        (req, res, ctx) => {
            return res(ctx.json([]))
        }
    ),
]
