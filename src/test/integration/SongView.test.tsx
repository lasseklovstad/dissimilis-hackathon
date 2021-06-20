import { getAllByRole, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderSongView = async () => {
    window.history.pushState({}, "Test page", "/song/1")
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
        await renderSongView()
        expect(screen.getByLabelText("Navn på sang")).toHaveValue(
            "Stairway to heaven"
        )
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("C"))
    })
    it("Should add note D", async () => {
        await renderSongView()
        selectNote("D")
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]

        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("D"))
    })
    it("Should add chord D", async () => {
        await renderSongView()
        selectChord("D")
        const bar = screen.getByLabelText("Takt")
        const firstNote = getAllByRole(bar, "button")[0]
        userEvent.click(firstNote)
        await waitFor(() => expect(firstNote).toHaveTextContent("A1D"))
    })

    it("Should change note length and add note C", async () => {
        await renderSongView()
        selectChordDuration("Halvnote")
        const bar = screen.getByLabelText("Takt")
        const emptyNotes = getAllByRole(bar, "button")
        userEvent.click(emptyNotes[0])
        await waitFor(() => expect(getAllByRole(bar, "button")).toHaveLength(5))
    })
})
