import { render, screen } from "@testing-library/react"
import { rest } from "msw"
import { IGroupIndex } from "../../../models/IGroup"
import { ISongShareData } from "../../../models/ISong"
import { server } from "../../../test/test-server"
import { waitDoneLoading } from "../../../test/test-utils"
import { ComponentTestWrapper } from "../../../TestWrapper.komponent"
import { SongProtectionLevel } from "../../../utils/useApiServiceSongs"
import { ShareSongDialog } from "./ShareSongDialog.component"

const mockNavigation = jest.fn()

jest.mock("react-router", () => ({
    ...(jest.requireActual("react-router") as any),
    useNavigate: () => mockNavigation,
}))

describe("SharSongDialog", () => {
    beforeEach(() => {
        server.use(
            rest.get<never, { songId: string }, ISongShareData>(
                "*/song/:songId/getProtectionLevelSharedWithAndTags",
                (req, res, ctx) => {
                    const { songId } = req.params
                    return res(
                        ctx.json({
                            groupTags: [],
                            organisationTags: [],
                            protectionLevel: SongProtectionLevel.Public,
                            sharedWithUsers: [],
                            songId: parseInt(songId, 10),
                        })
                    )
                }
            ),
            rest.get<never, never, IGroupIndex[]>(
                "*/organisations/groups",
                (req, res, ctx) => {
                    return res(ctx.json([]))
                }
            )
        )
    })

    it("Should render and show song is public", async () => {
        render(<ShareSongDialog songId={1} handleOnCloseClick={jest.fn()} />, {
            wrapper: ComponentTestWrapper,
        })
        await waitDoneLoading()
        screen.getByRole("heading", { name: /Share song/i })
        expect(
            screen.getByRole("checkbox", { name: /Share with everyone/i })
        ).toBeChecked()
    })
})
