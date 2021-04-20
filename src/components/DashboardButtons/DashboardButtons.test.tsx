import React from "react"
import { render, screen } from "@testing-library/react"
import { DashboardLibraryButton, DashboardTopBarIcon } from "./DashboardButtons"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import renderWithi18next from "../../renderWithi18next"

let container

describe("Kontrollklient-Iframe-Komponent", () => {
    container = renderWithi18next(<DashboardTopBarIcon />);
    beforeEach(() => {
        jest.clearAllMocks()
        render(
            <TestWrapper>
                container
                <DashboardLibraryButton
                    text={"Alle sanger"}
                    link="/library"/>
            </TestWrapper>
        )
    })

    it("Skal finne ikon-knappen med aria-label 'Go home' og med alt-text oversatt med i18next", async () => {
        expect(screen.getByLabelText("Go home")).toBeInTheDocument()
        const homeButtonSvg = screen.getByAltText("Bilde av Dissimilis' sommerfugl")
        expect(homeButtonSvg).toBeInTheDocument()
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
