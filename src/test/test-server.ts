import { setupServer } from "msw/node"
import { loginHandlers } from "./handlers/login-handlers"
import { userHandlers } from "./handlers/user-handlers"
import { songHandlers } from "./handlers/song-handlers"

export const server = setupServer(
    ...loginHandlers,
    ...userHandlers,
    ...songHandlers
)
