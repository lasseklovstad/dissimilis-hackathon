import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DashboardLibraryButton, DashboardTopBarIcon } from "./DashboardButtons"
import { TestWrapper } from "../../TestWrapper.komponent"

describe("Kontrollklient-Iframe-Komponent", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(
            <TestWrapper>
                <DashboardTopBarIcon/>
                <DashboardLibraryButton
                    text={"Alle sanger"}
                    link="/library"/>
            </TestWrapper>
        )
    })

    it("Skal finne ikon-knappen med aria-label og alt-tekst oversatt med i18next", async () => {
        expect(screen.getByLabelText("Gå til startskjermen")).toBeInTheDocument()
        expect(screen.getByAltText("Bilde av Dissimilis' sommerfugl")).toBeInTheDocument()
    })

    it("Skal finne knappen 'Alle sanger' og knappen skal bli borte dersom man trykker på den", async () => {
        const libraryButton = screen.getByRole("button", { name: "Alle sanger" })
        expect(libraryButton).toBeInTheDocument()
        userEvent.click(libraryButton)
        waitFor(() => expect(libraryButton).not.toBeInTheDocument())
    })
})
