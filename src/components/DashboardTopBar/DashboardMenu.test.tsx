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
        await userEvent.click(screen.getByRole("button", { name: "Settings" }))
        await userEvent.click(
            screen.getByRole("menuitem", { name: "Change language" })
        )
        //expect(screen.getByLabelText("Dialog")).toBeInTheDocument()
        expect(screen.getByRole("dialog")).toBeInTheDocument()

        await userEvent.click(screen.getByLabelText("Select language"))
        await userEvent.click(screen.getByRole("option", { name: "Norsk" }))

        await userEvent.click(screen.getByRole("button", { name: "Save" }))

        await screen.findByRole("button", { name: "Innstillinger" })
        await userEvent.click(
            screen.getByRole("button", { name: "Innstillinger" })
        )
        await userEvent.click(
            screen.getByRole("menuitem", { name: "Endre språk" })
        )
        await userEvent.click(screen.getByLabelText("Språkvalg"))

        await userEvent.click(screen.getByRole("option", { name: "English" }))
        await userEvent.click(screen.getByRole("button", { name: "Lagre" }))
        await screen.findByRole("button", { name: "Settings" })
        await userEvent.click(screen.getByRole("button", { name: "Settings" }))
    })
})
