import { render, screen } from "@testing-library/react"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import React from "react"
import { waitDoneLoading } from "../test-utils"

const renderDashboard = async () => {
    window.history.pushState({}, "Test page", "/dashboard")
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

describe("Dashboard", () => {
    it("Should show dashboard with links", async () => {
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
            "Test sang 4/4"
        )
        userEvent.click(screen.getByRole("button", { name: "Opprett" }))
        await screen.findByLabelText("Loading")
        await waitDoneLoading()
        screen.getByRole("tab", { name: "Partitur" })
        expect(screen.getByLabelText("Navn på sang")).toHaveValue(
            "Test sang 4/4"
        )
        expect(screen.getByLabelText("Taktart")).toHaveTextContent("4/4")
    })

    it("Should create 3/4 song", async () => {
        await renderDashboard()
        userEvent.click(screen.getByRole("button", { name: /3\/4-takt/i }))
        userEvent.type(await screen.findByLabelText("Navn på sang"), "Test 3/4")
        userEvent.click(screen.getByRole("button", { name: "Opprett" }))
        await screen.findByLabelText("Loading")
        await waitDoneLoading()
        screen.getByRole("tab", { name: "Partitur" })
        expect(screen.getByLabelText("Navn på sang")).toHaveValue("Test 3/4")
        expect(screen.getByLabelText("Taktart")).toHaveTextContent("3/4")
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
    fit("Should change language in settings", async () => {
        await renderDashboard()
        userEvent.click(screen.getByRole("button", { name: "settings" }))
        userEvent.click(
            screen.getByRole("menuitem", { name: "MenuButton.changeLanguage" })
        )
        expect(screen.getByLabelText("dialog")).toBeInTheDocument()
        userEvent.click(screen.getByLabelText("dropdown"))
        expect(screen.getByLabelText("dialog")).toBeInTheDocument()
    })
})
/* describe("Topbar", () => {
    it("Should change language in settings", async () => {
        await renderDashboard()
        userEvent.click(screen.getByLabelText("settings"))
        userEvent.click(
            screen.getByRole("menuitem", { name: "MenuButton.changeLanguage" })
        )
        expect(screen.getByLabelText("dialog")).toBeInTheDocument()

        userEvent.click(screen.getByRole("button", { name: "Lagre" }))
    })
}) */
