import { render, screen, waitFor } from "@testing-library/react"
import { rest } from "msw"
import { IGroupIndex } from "../../../models/IGroup"
import { ISongShareData } from "../../../models/ISong"
import { server } from "../../../test/test-server"
import {
    generateSearchPagination,
    waitDoneLoading,
} from "../../../test/test-utils"
import { ComponentTestWrapper } from "../../../TestWrapper.komponent"
import {
    ChangeSongProtectionLevel,
    ChangeSongProtectionLevelPayload,
    SongProtectionLevel,
} from "../../../models/SongProtectionLevel"
import { ShareSongDialog } from "./ShareSongDialog.component"
import userEvent from "@testing-library/user-event"
import { IUser } from "../../../models/IUser"
import { IMyGroupUsersPayload } from "../../../models/IMyGroupUsersPayload"
import { ISearchWithPagination } from "../../../models/ISearchWithPagination"
import { user } from "../../../test/data/user.mock"

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
                    return res(
                        ctx.json([
                            {
                                createdOn: "2021-07-28T14:29:36.0576693+00:00",
                                groupId: 1,
                                groupName: "Sandefjord",
                                organisationId: 1,
                                organisationName: "Norway",
                            },
                        ])
                    )
                }
            ),
            rest.post<
                ChangeSongProtectionLevelPayload,
                { songId: string },
                ChangeSongProtectionLevel
            >("*/song/:songId/changeProtectionLevel", (req, res, ctx) => {
                const { songId } = req.params
                return res(
                    ctx.json({
                        protectionLevel: req.body.protectionLevel,
                        songId: parseInt(songId, 10),
                    })
                )
            }),
            rest.patch<{ tagIds: number[] }, { songId: string }, IGroupIndex[]>(
                "*/song/:songId/Tag/Group",
                (req, res, ctx) => {
                    return res(
                        ctx.json(
                            req.body.tagIds.map((groupId) => ({
                                groupId,
                                groupName: "Sandefjord",
                            }))
                        )
                    )
                }
            ),
            rest.post<never, { songId: string }, IUser[]>(
                "*/song/:songId/shareSong/User",
                (req, res, ctx) => {
                    const email = req.url.searchParams.get("userEmail")
                    if (email === user.email) {
                        return res(ctx.json([user]))
                    } else {
                        return res(ctx.status(404))
                    }
                }
            ),
            rest.post<
                IMyGroupUsersPayload,
                never,
                ISearchWithPagination<IUser, IMyGroupUsersPayload>
            >("*/user/myGroupUsers", (req, res, ctx) => {
                return res(ctx.json(generateSearchPagination([user], req.body)))
            })
        )
    })

    it("Should render and show song is public and change to private", async () => {
        render(<ShareSongDialog songId={1} handleOnCloseClick={jest.fn()} />, {
            wrapper: ComponentTestWrapper,
        })
        await waitDoneLoading()
        screen.getByRole("heading", { name: /Share song/i })
        const switchButton = screen.getByRole("checkbox", {
            name: /Share with everyone/i,
        })
        expect(switchButton).toBeChecked()
        userEvent.click(switchButton)
        await waitDoneLoading()
        expect(switchButton).not.toBeChecked()
        // Should not be able to add groups if private song
        expect(screen.queryByRole("textbox", { name: /Groups/i })).toBeNull()
    })

    it("Should share song with group Sandefjord", async () => {
        render(<ShareSongDialog songId={1} handleOnCloseClick={jest.fn()} />, {
            wrapper: ComponentTestWrapper,
        })
        await waitDoneLoading()
        const groupInput = screen.getByRole("textbox", {
            name: /Groups/i,
        })
        expect(groupInput).toHaveValue("")
        userEvent.click(groupInput)
        userEvent.click(screen.getByRole("option", { name: /sandefjord/i }))
        const combobox = screen.getByRole("combobox")
        await waitFor(() => expect(combobox).toHaveTextContent(/sandefjord/i))
    })

    it("Should share with user", async () => {
        render(<ShareSongDialog songId={1} handleOnCloseClick={jest.fn()} />, {
            wrapper: ComponentTestWrapper,
        })
        await waitDoneLoading()
        userEvent.click(screen.getByRole("button", { name: /add person/i }))
        userEvent.type(
            screen.getByRole("textbox", { name: /email/i }),
            "test",
            { skipAutoClose: true }
        )
        userEvent.click(
            await screen.findByRole("option", {
                name: /test\.testesen@ciber\.no/i,
            })
        )
        userEvent.click(screen.getByRole("button", { name: /add person/i }))
        await screen.findByRole("listitem")
        expect(
            screen.getByRole("list", { name: /People with edit rights/i })
        ).toHaveTextContent("Test Testersen")
    })
})
