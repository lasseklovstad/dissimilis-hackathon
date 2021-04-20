import React from "react"
import { render, screen } from "@testing-library/react"
import { DashboardLibraryButton } from "./DashboardButtons"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"

describe("Kontrollklient-Iframe-Komponent", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(
            <TestWrapper>
                <DashboardLibraryButton
                    text={"Alle sanger"}
                    link="/library"/>
            </TestWrapper>
        )
    })

    it("Skal finne knappen 'Alle sanger' og knappen skal bli borte dersom man trykker på den", async () => {
        const libraryButton = screen.getByRole("button", { name: "Alle sanger" })
        expect(libraryButton).toBeInTheDocument()
        await userEvent.click(libraryButton)
        setTimeout(() => {
            expect(screen.queryByRole("button", {name: "Alle sanger"})).not.toBeInTheDocument()
            expect(libraryButton).toBeNull()
        }, 100)
    })
})
