import { render, screen } from "@testing-library/react"
import { App } from "../../App"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import React from "react"
import { waitDoneLoading } from "../../test/test-utils"

const renderDashboard = async () => {
    window.history.pushState({}, "Test page", "/dashboard")
    render(<App />, { wrapper: TestWrapper })
    await waitDoneLoading()
}

describe("DashboardMenu", () => {
    it("Should change language in settings", async () => {
        await renderDashboard()
        userEvent.click(screen.getByRole("button", { name: "Settings" }))
        userEvent.click(
            screen.getByRole("menuitem", { name: "Change language" })
        )
        expect(screen.getByLabelText("Dialog")).toBeInTheDocument()
        userEvent.click(screen.getByLabelText("Dropdown menu"))

        //userEvent.click(screen.getByLabelText("Norsk"))
        userEvent.click(screen.getByRole("button", { name: "English" }))
        userEvent.click(screen.getByRole("option", { name: "Norsk" }))
        userEvent.click(screen.getByRole("button", { name: "Save" }))
        //await screen.getByLabelText("Dialog")
        await screen.findByRole("heading", { name: /Dine siste fem sanger/i })

        userEvent.click(screen.getByRole("button", { name: "Innstillinger" }))
        userEvent.click(screen.getByRole("menuitem", { name: "Endre språk" }))
        expect(screen.getByLabelText("Dialog")).toBeInTheDocument()
        userEvent.click(screen.getByLabelText("Dropdown meny"))

        userEvent.click(screen.getByRole("button", { name: "Norsk" }))
        userEvent.click(screen.getByRole("option", { name: "English" }))
        userEvent.click(screen.getByRole("button", { name: "Lagre" }))
        //await screen.getByLabelText("Dialog")
        await screen.findByRole("heading", { name: /Your last five songs/i })
    })
})
