import { render, screen } from "@testing-library/react"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import { waitDoneLoading } from "../../test/test-utils"
import { DashboardMenu } from "./DashboardMenu.component"

const mockNavigation = jest.fn()

jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom") as any),
    useNavigate: () => mockNavigation,
}))

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
        //expect(screen.getByLabelText("Dialog")).toBeInTheDocument()
        expect(screen.getByRole("dialog")).toBeInTheDocument()

        userEvent.click(screen.getByLabelText("Select language"))
        userEvent.click(screen.getByRole("option", { name: "Norsk" }))

        userEvent.click(screen.getByRole("button", { name: "Save" }))

        await screen.findByRole("button", { name: "Innstillinger" })
        userEvent.click(screen.getByRole("button", { name: "Innstillinger" }))
        userEvent.click(screen.getByRole("menuitem", { name: "Endre språk" }))
        userEvent.click(screen.getByLabelText("Språkvalg"))

        userEvent.click(screen.getByRole("option", { name: "English" }))
        userEvent.click(screen.getByRole("button", { name: "Lagre" }))
        await screen.findByRole("button", { name: "Settings" })
        userEvent.click(screen.getByRole("button", { name: "Settings" }))
    })
})
