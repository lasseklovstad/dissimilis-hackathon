import { render, screen } from "@testing-library/react"
import { TestWrapper } from "../../../TestWrapper.komponent"
import { LanguageDialog } from "./LanguageDialog.component"
import userEvent from "@testing-library/user-event"

describe("LanguageDialog", () => {
    it("should show fallback language English", () => {
        localStorage.setItem("userLanguage", "en-US")
        const mockClose = jest.fn()
        render(<LanguageDialog onClose={mockClose} />, { wrapper: TestWrapper })
        screen.getByRole("heading", { name: /Change language/i })
        expect(screen.getByLabelText(/Select language/i)).toHaveTextContent(
            "English"
        )
        userEvent.click(screen.getByRole("button", { name: /Cancel/i }))
        expect(mockClose).toHaveBeenCalledTimes(1)
    })
    it("should change language", () => {
        localStorage.setItem("userLanguage", "en-US")
        const mockClose = jest.fn()
        render(<LanguageDialog onClose={mockClose} />, { wrapper: TestWrapper })
        userEvent.click(screen.getByLabelText(/Select language/i))
        userEvent.click(screen.getByRole("option", { name: /Norsk/i }))
        userEvent.click(screen.getByRole("button", { name: /Save/i }))
        expect(localStorage.getItem("userLanguage")).toBe("no")
        expect(mockClose).toHaveBeenCalledTimes(1)
    })
})
