import { sessionStorageMock } from "./setupTests"
import {
    render,
    screen,
    waitFor,
    getAllByRole,
    getByRole,
} from "@testing-library/react"
import React from "react"
import { App } from "./App"
import { TestWrapper } from "./TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import { resetSongDB, server } from "./test/test-server"

const waitDoneLoading = async () => {
    await waitFor(() =>
        expect(screen.queryAllByRole("progressbar")).toHaveLength(0)
    )
    await waitFor(() =>
        expect(screen.queryAllByLabelText("Loading")).toHaveLength(0)
    )
}

const renderDashboard = async () => {
    window.history.pushState({}, "Test page", "/dashboard")
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

const renderSongView = async () => {
    window.history.pushState({}, "Test page", "/song/1")
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

const login = () => {
    sessionStorageMock.setItem("apiKey", "MockApiKey")
    sessionStorageMock.setItem("userId", "10")
}

const logout = () => {
    sessionStorageMock.clear()
}

beforeAll(() => {
    // Enable the mocking in tests.
    server.listen({ onUnhandledRequest: "warn" })
})

afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers()
    logout()
    resetSongDB()
})

afterAll(() => {
    // Clean up once the tests are done.
    server.close()
})
beforeEach(() => {
    login()
})

describe("Dashboard", () => {
    it("Should show dashboard", async () => {
        await renderDashboard()
        screen.getByRole("heading", { name: /Nytt partitur/i })
        screen.getByRole("heading", { name: /Dine siste fem sanger/i })
        expect(
            screen.getByRole("button", { name: /Stairway to heaven/i })
        ).toHaveProperty("href", "http://localhost/song/1")
        expect(
            screen.getByRole("button", { name: /High way to hell/i })
        ).toHaveProperty("href", "http://localhost/song/2")
        expect(
            screen.getByRole("button", { name: /Ja vi elsker/i })
        ).toHaveProperty("href", "http://localhost/song/3")
        expect(
            screen.getByRole("button", { name: /What does the fox say/i })
        ).toHaveProperty("href", "http://localhost/song/4")
        expect(
            screen.getByRole("button", { name: /Cheese slicer/i })
        ).toHaveProperty("href", "http://localhost/song/5")
    })

    it("Should create 4/4 song", async () => {
        await renderDashboard()
        userEvent.click(screen.getByRole("button", { name: /4\/4-takt/i }))
        userEvent.type(
            await screen.findByLabelText("Navn på sang"),
            "Test sang"
        )
        userEvent.click(screen.getByRole("button", { name: "Opprett" }))
        await screen.findByLabelText("Loading")
        await waitDoneLoading()
        screen.getByRole("tab", { name: "Partitur" })
        expect(screen.getByLabelText("Navn på sang")).toHaveValue("Test sang")
        expect(screen.getByLabelText("Taktart")).toHaveTextContent("4/4")
    })

    it("Should delete song", async () => {
        await renderDashboard()
        const songToDelete = screen.getByRole("button", {
            name: /Stairway to heaven/i,
        })
        userEvent.click(screen.getAllByRole("button", { name: "Sang meny" })[0])
        userEvent.click(screen.getByRole("menuitem", { name: "Slett" }))
        userEvent.click(screen.getByRole("button", { name: "Slett sang" }))
        await waitDoneLoading()
        expect(songToDelete).not.toBeInTheDocument()
    })
})

fdescribe("SongView", () => {
    it("Should add default note C", async () => {
        await renderSongView()
        expect(screen.getByLabelText("Navn på sang")).toHaveValue(
            "Stairway to heaven"
        )
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("C"))
    })
    fit("Should add note D", async () => {
        await renderSongView()
        const selectNote = screen.getByRole("textbox", { name: "Velg note" })
        expect(selectNote).toHaveValue("C")
        userEvent.click(selectNote)
        userEvent.click(screen.getByRole("option", { name: "D" }))
        expect(selectNote).toHaveValue("D")
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]

        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("D"))
    })
    it("Should add chord D", async () => {
        await renderSongView()
        userEvent.click(screen.getByRole("button", { name: "Akkord" }))
        const selectNote = screen.getByRole("combobox", { name: "Velg akkord" })
        userEvent.click(selectNote)
        userEvent.click(await screen.findByRole("option", { name: "D" }))
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => {
            screen.debug(firstNote)
            return expect(firstNote).toHaveTextContent("D")
        })
    })
})
