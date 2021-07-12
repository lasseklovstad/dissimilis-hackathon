import { render, screen } from "@testing-library/react"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import React from "react"
import { waitDoneLoading } from "../../test/test-utils"
import { DashboardMenu } from "./DashboardMenu.component"

const renderDashboard = async () => {
    render(<DashboardMenu />, { wrapper: TestWrapper })
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

        userEvent.click(screen.getByLabelText("Select language"))
        userEvent.click(screen.getByRole("option", { name: "Norsk" }))

        userEvent.click(screen.getByRole("button", { name: "Save" }))
        await screen.findByRole("heading", { name: /Dine siste fem sanger/i })

        userEvent.click(screen.getByRole("button", { name: "Innstillinger" }))
        userEvent.click(screen.getByRole("menuitem", { name: "Endre språk" }))
        expect(screen.getByLabelText("Dialog")).toBeInTheDocument()
        userEvent.click(screen.getByLabelText("Dropdown meny"))

        userEvent.click(screen.getByRole("button", { name: "Norsk" }))
        userEvent.click(screen.getByRole("option", { name: "English" }))
        userEvent.click(screen.getByRole("button", { name: "Lagre" }))
        await screen.findByRole("heading", { name: /Your last five songs/i })
    })
})
