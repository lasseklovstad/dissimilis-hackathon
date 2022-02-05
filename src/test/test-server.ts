import { setupServer } from "msw/node"
import { loginHandlers } from "./handlers/login-handlers"
import { userHandlers } from "./handlers/user-handlers"
import { songHandlers } from "./handlers/song-handlers"
import { organisationHandlers } from "./handlers/organisation-handlers"
import { globalHandlers } from "./handlers/global-handlers"

export const server = setupServer(
    ...globalHandlers,
    ...loginHandlers,
    ...userHandlers,
    ...songHandlers,
    ...organisationHandlers
)
