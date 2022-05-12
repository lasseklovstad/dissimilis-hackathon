import { render, screen } from "@testing-library/react"
import { TestWrapper } from "../../../TestWrapper.komponent"
import { LanguageDialog } from "./LanguageDialog.component"
import userEvent from "@testing-library/user-event"

describe("LanguageDialog", () => {
    it("should show fallback language English", async () => {
        localStorage.setItem("userLanguage", "en-US")
        const mockClose = jest.fn()
        render(<LanguageDialog onClose={mockClose} />, { wrapper: TestWrapper })
        screen.getByRole("heading", { name: /Change language/i })
        expect(screen.getByLabelText(/Select language/i)).toHaveTextContent(
            "English"
        )
        await userEvent.click(screen.getByRole("button", { name: /Cancel/i }))
        expect(mockClose).toHaveBeenCalledTimes(1)
    })
    it("should change language", async () => {
        localStorage.setItem("userLanguage", "en-US")
        const mockClose = jest.fn()
        render(<LanguageDialog onClose={mockClose} />, { wrapper: TestWrapper })
        await userEvent.click(screen.getByLabelText(/Select language/i))
        await userEvent.click(screen.getByRole("option", { name: /Norsk/i }))
        await userEvent.click(screen.getByRole("button", { name: /Save/i }))
        expect(localStorage.getItem("userLanguage")).toBe("no")
        expect(mockClose).toHaveBeenCalledTimes(1)
    })
})
