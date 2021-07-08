import {
    getAllByRole,
    render,
    screen,
    waitFor,
    fireEvent,
    getByLabelText,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderSongView = async (songId: string) => {
    window.history.pushState({}, "Test page", `/song/${songId}`)
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

const selectNote = (note: string) => {
    userEvent.click(screen.getByRole("button", { name: "Note" }))
    const selectNote = screen.getByRole("textbox", { name: "Velg note" })
    userEvent.click(selectNote)
    userEvent.click(screen.getByRole("option", { name: note }))
    expect(selectNote).toHaveValue(note)
}

const selectChord = (chord: string) => {
    userEvent.click(screen.getByRole("button", { name: "Akkord" }))
    const selectNote = screen.getByRole("textbox", { name: "Velg akkord" })
    userEvent.click(selectNote)
    userEvent.click(screen.getByRole("option", { name: chord }))
    expect(selectNote).toHaveValue(chord)
}

const selectChordDuration = (duration: string) => {
    userEvent.click(screen.getByLabelText("Noteverdi"))
    userEvent.click(screen.getByRole("option", { name: duration }))
}

describe("SongView", () => {
    it("Should add default note C", async () => {
        await renderSongView("1")
        expect(screen.getByLabelText("Navn på sang")).toHaveValue(
            "Stairway to heaven"
        )
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("C"))
    })
    it("Should add note D", async () => {
        await renderSongView("1")
        selectNote("D")
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]

        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("D"))
    })
    it("Should add chord D", async () => {
        await renderSongView("1")
        selectChord("D")
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("A1D"))
    })

    it("Should change note length and add note C", async () => {
        await renderSongView("1")
        selectChordDuration("Halvnote")
        const bar = screen.getByLabelText("Takt")
        const emptyNotes = getAllByRole(bar, "button")
        userEvent.click(emptyNotes[0])
        await waitFor(() => expect(getAllByRole(bar, "button")).toHaveLength(5))
    })

    it("Should delete note with right click", async () => {
        await renderSongView("10")
        const bars = screen.getAllByLabelText("Takt")
        expect(bars).toHaveLength(4)
        const chord = getAllByRole(bars[0], "button")[0]
        expect(chord).toHaveTextContent("C")
        fireEvent.contextMenu(getAllByRole(bars[0], "button")[0])
        userEvent.click(screen.getByRole("menuitem", { name: "Slett" }))
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    it("Should delete note with menu button", async () => {
        await renderSongView("10")
        const bars = screen.getAllByLabelText("Takt")
        expect(bars).toHaveLength(4)
        const chord = getAllByRole(bars[0], "button")[0]
        expect(chord).toHaveTextContent("C")
        userEvent.click(chord) // Select chord
        userEvent.click(
            screen.getByRole("button", { name: "Slett valgt akkord" })
        )
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    fit("Should create new voice with same notes as main voice", async () => {
        await renderSongView("10")
        const voiceMenu = screen.getByLabelText("Stemme meny")
        userEvent.click(voiceMenu)
        const newVoiceDialog = screen.getByRole("menuitem", {
            name: "Ny stemme",
        })
        userEvent.click(newVoiceDialog)
        const title = screen.getByRole("heading")
        expect(title).toHaveTextContent("Legg til en stemme")
        userEvent.type(screen.getByLabelText("Navn på stemme"), "Test")
        userEvent.click(screen.getByRole("button", { name: "Opprett" }))
        await waitDoneLoading()
        expect(screen.getByRole("tab", { name: "Test" })).toBeInTheDocument()
    })
})
