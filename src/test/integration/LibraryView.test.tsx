import { render, screen } from "@testing-library/react"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderLibrary = async () => {
    window.history.pushState({}, "Test page", "/library")
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

describe("Search", () => {
    it("Should search for songs by title", async () => {
        await renderLibrary()
        expect(
            screen.getByRole("button", { name: /Stairway to heaven/i })
        ).toHaveProperty("href", "http://localhost/song/1")
        userEvent.click(screen.getByLabelText("Søk"))
        userEvent.keyboard("heaven")
        userEvent.click(screen.getByRole("button", { name: "search" }))
        await waitDoneLoading()
        expect(
            screen.getByRole("button", { name: /Stairway to heaven/i })
        ).toHaveProperty("href", "http://localhost/song/1")
    })
})
