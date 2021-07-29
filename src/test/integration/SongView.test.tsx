import {
    getAllByRole,
    render,
    screen,
    waitFor,
    fireEvent,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderSongView = async (songId: number) => {
    window.history.pushState({}, "Test page", `/song/${songId}`)
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

const selectNote = (note: string) => {
    userEvent.click(screen.getByRole("button", { name: "Note" }))
    const selectNote = screen.getByRole("textbox", { name: "Select note" })
    userEvent.click(selectNote)
    userEvent.click(screen.getByRole("option", { name: note }))
    expect(selectNote).toHaveValue(note)
}

const selectChord = (chord: string) => {
    userEvent.click(screen.getByRole("button", { name: "Chord" }))
    const selectNote = screen.getByRole("textbox", { name: "Select chord" })
    userEvent.click(selectNote)
    userEvent.click(screen.getByRole("option", { name: chord }))
    expect(selectNote).toHaveValue(chord)
}

const selectChordDuration = (duration: string) => {
    userEvent.click(screen.getByLabelText("Note duration"))
    userEvent.click(screen.getByRole("option", { name: duration }))
}

describe("SongView", () => {
    it("Should add default note C", async () => {
        await renderSongView("1")
        expect(screen.getByLabelText("Name of song")).toHaveValue(
            "Stairway to heaven"
        )
        const bar = screen.getByLabelText("Bar")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("C"))
    })
    it("Should add note D", async () => {
        await renderSongView("1")
        selectNote("D")
        const bar = screen.getByLabelText("Bar")
        const firstNote = getAllByRole(bar, "button")[0]

        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("D"))
    })
    it("Should add chord D", async () => {
        await renderSongView("1")
        selectChord("D")
        const bar = screen.getByLabelText("Bar")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("A1D"))
    })

    it("Should change note length and add note C", async () => {
        await renderSongView("1")
        selectChordDuration("Half note")
        const bar = screen.getByLabelText("Bar")
        const emptyNotes = getAllByRole(bar, "button")
        userEvent.click(emptyNotes[0])
        await waitFor(() => expect(getAllByRole(bar, "button")).toHaveLength(5))
    })

    it("Should delete note with right click", async () => {
        await renderSongView("10")
        const bars = screen.getAllByLabelText("Bar")
        expect(bars).toHaveLength(4)
        const chord = getAllByRole(bars[0], "button")[0]
        expect(chord).toHaveTextContent("C")
        fireEvent.contextMenu(getAllByRole(bars[0], "button")[0])
        userEvent.click(screen.getByRole("menuitem", { name: "Delete" }))
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    it("Should delete note with menu button", async () => {
        await renderSongView("10")
        const bars = screen.getAllByLabelText("Bar")
        expect(bars).toHaveLength(4)
        const chord = getAllByRole(bars[0], "button")[0]
        expect(chord).toHaveTextContent("C")
        userEvent.click(chord) // Select chord
        userEvent.click(
            screen.getByRole("button", { name: "Delete selected chord" })
        )
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    it("Should create new voice with same notes as main voice", async () => {
        await renderSongView("10")
        const voiceMenu = screen.getByLabelText("Voice menu")
        userEvent.click(voiceMenu)
        const newVoiceDialog = screen.getByRole("menuitem", {
            name: "New Voice",
        })
        userEvent.click(newVoiceDialog)
        const title = screen.getByRole("heading")
        expect(title).toHaveTextContent("Add a new voice")
        userEvent.type(screen.getByLabelText("Name of voice"), "Test Ny Stemme")
        userEvent.click(screen.getByRole("button", { name: "Create" }))
        await waitDoneLoading()
        await screen.findByRole("tab", { name: "Test Ny Stemme" })
    })
    it("Should create new blank voice", async () => {
        await renderSongView("10")
        const voiceMenu = screen.getByLabelText("Voice menu")
        userEvent.click(voiceMenu)
        const newVoiceDialog = screen.getByRole("menuitem", {
            name: "New Voice",
        })
        userEvent.click(newVoiceDialog)
        const title = screen.getByRole("heading")
        expect(title).toHaveTextContent("Add a new voice")
        userEvent.type(screen.getByLabelText("Name of voice"), "Test Ny Stemme")
        userEvent.click(
            screen.getByRole("radio", {
                name: "Radio: New voice with empty bars and chord names",
            })
        )
        userEvent.click(screen.getByRole("button", { name: "Create" }))
        await waitDoneLoading()
        await screen.findByRole("tab", { name: "Test Ny Stemme" })
    })
})
