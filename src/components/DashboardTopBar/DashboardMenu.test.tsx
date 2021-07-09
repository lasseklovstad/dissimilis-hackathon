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
        userEvent.click(screen.getByRole("button", { name: "settings" }))
        userEvent.click(screen.getByRole("menuitem", { name: "Endre språk" }))
        expect(screen.getByLabelText("dialog")).toBeInTheDocument()
        userEvent.click(screen.getByLabelText("dropdown"))
        expect(screen.getByLabelText("dialog")).toBeInTheDocument()
    })
})
