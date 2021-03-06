import {
    render,
    screen,
    waitFor,
    fireEvent,
    within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderSongView = async (songId: number) => {
    window.history.pushState({}, "Test page", `/song/${songId}`)
    render(<App />, { wrapper: TestWrapper })
    await screen.findByRole("tab", { name: /song/i, selected: true })
    await waitDoneLoading()
}

const selectNote = async (note: string) => {
    await userEvent.click(screen.getByRole("button", { name: "Note" }))
    const selectNote = screen.getByRole("combobox", { name: "Select note" })
    await userEvent.click(selectNote)
    await userEvent.click(screen.getByRole("option", { name: note }))
    expect(selectNote).toHaveValue(note)
}

const selectChord = async (chord: string) => {
    await userEvent.click(screen.getByRole("button", { name: "Chord" }))
    const selectNote = screen.getByRole("combobox", { name: "Select chord" })
    await userEvent.click(selectNote)
    await userEvent.click(screen.getByRole("option", { name: chord }))
    expect(selectNote).toHaveValue(chord)
}

const selectChordDuration = async (duration: string) => {
    await userEvent.click(screen.getByLabelText("Note duration"))
    await userEvent.click(screen.getByRole("option", { name: duration }))
}

describe("SongView", () => {
    it("Should add default note C", async () => {
        await renderSongView(1)
        expect(screen.getByLabelText("Name of song")).toHaveValue(
            "Stairway to heaven"
        )
        const bar = screen.getByLabelText("Bar 1")
        const firstNote = within(bar).getAllByRole("button")[0]
        await userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("C"))
    })
    it("Should add note D", async () => {
        await renderSongView(1)
        await selectNote("D")
        const bar = screen.getByLabelText("Bar 1")
        const firstNote = within(bar).getAllByRole("button")[0]
        await userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("D"))
    })
    it("Should add chord D", async () => {
        await renderSongView(1)
        await selectChord("D")
        const bar = screen.getByLabelText("Bar 1")
        const firstNote = within(bar).getAllByRole("button")[0]
        await userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("A1D"))
    })

    it("Should change note length and add note C", async () => {
        await renderSongView(1)
        await selectChordDuration("Half note")
        const bar = screen.getByLabelText("Bar 1")
        const emptyNotes = within(bar).getAllByRole("button")
        await userEvent.click(emptyNotes[0])
        await waitFor(() =>
            expect(within(bar).getAllByRole("button")).toHaveLength(5)
        )
    })

    it("Should delete note with right click", async () => {
        await renderSongView(10)
        const bars = screen.getAllByLabelText(/Bar \d+/i)
        expect(bars).toHaveLength(4)
        const chord = within(bars[0]).getAllByRole("button")[0]
        expect(chord).toHaveTextContent("C")
        fireEvent.contextMenu(chord)
        await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }))
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    it("Should delete note with menu button", async () => {
        await renderSongView(10)
        const bars = screen.getAllByLabelText(/Bar \d+/i)
        expect(bars).toHaveLength(4)
        const chord = within(bars[0]).getAllByRole("button")[0]
        expect(chord).toHaveTextContent("C")
        await userEvent.click(chord) // Select chord
        await userEvent.click(
            screen.getByRole("button", { name: "Delete selected chord" })
        )
        await waitFor(() => expect(chord).toHaveTextContent(""))
    })

    it("Should create new voice with same notes as main voice", async () => {
        await renderSongView(10)
        const voiceMenu = screen.getByLabelText("Voice menu")
        await userEvent.click(voiceMenu)
        const newVoiceDialog = screen.getByRole("menuitem", {
            name: "New Voice",
        })
        await userEvent.click(newVoiceDialog)
        const title = screen.getByRole("heading")
        expect(title).toHaveTextContent("Add a new voice")
        await userEvent.type(
            screen.getByLabelText("Name of voice"),
            "Test Ny Stemme"
        )
        await userEvent.click(screen.getByRole("button", { name: "Create" }))
        await waitDoneLoading()
        await screen.findByRole("tab", {
            name: "Test Ny Stemme",
        })
    })
    it("Should create new blank voice", async () => {
        await renderSongView(10)
        const voiceMenu = screen.getByLabelText("Voice menu")
        await userEvent.click(voiceMenu)
        const newVoiceDialog = screen.getByRole("menuitem", {
            name: "New Voice",
        })
        await userEvent.click(newVoiceDialog)
        const title = screen.getByRole("heading")
        expect(title).toHaveTextContent("Add a new voice")
        await userEvent.type(
            screen.getByLabelText("Name of voice"),
            "Test Ny Stemme"
        )
        await userEvent.click(
            screen.getByRole("radio", {
                name: "Radio: New voice with empty bars and chord names",
            })
        )
        await userEvent.click(screen.getByRole("button", { name: "Create" }))
        await waitDoneLoading()
        await screen.findByRole("tab", {
            name: "Test Ny Stemme",
            selected: true,
        })
    })
})
