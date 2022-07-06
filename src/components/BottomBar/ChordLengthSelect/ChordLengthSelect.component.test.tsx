import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChordType } from "../../../models/IChordMenuOptions"
import { ComponentTestWrapper } from "../../../TestWrapper.komponent"
import { ChordLengthSelect } from "./ChordLengthSelect.component"

describe("ChordLengthSelect", () => {
    it("should render chord lengths for song in 4/4 and select whole note", async () => {
        const mockOnChange = jest.fn()
        render(
            <ChordLengthSelect
                chordMenuOptions={{
                    chordLength: 1,
                    chord: "C",
                    chordType: ChordType.NOTE,
                    playMetronome: false,
                }}
                onChordMenuOptionChange={mockOnChange}
                song={{ numerator: 4, denominator: 4 }}
            />,
            { wrapper: ComponentTestWrapper }
        )
        const input = screen.getByLabelText(/note duration/i)
        expect(input).toContainElement(screen.getByTitle(/Eighth note/i))
        await userEvent.click(input)
        expect(screen.getAllByRole("option")).toHaveLength(6)
        await userEvent.click(
            screen.getByRole("option", { name: /Whole note/i })
        )
        expect(mockOnChange).toHaveBeenCalled()
    })
    it("should render chord lengths for song in 3/4", async () => {
        const mockOnChange = jest.fn()
        render(
            <ChordLengthSelect
                chordMenuOptions={{
                    chordLength: 2,
                    chord: "C",
                    chordType: ChordType.NOTE,
                    playMetronome: false,
                }}
                onChordMenuOptionChange={mockOnChange}
                song={{ numerator: 2, denominator: 4 }}
            />,
            { wrapper: ComponentTestWrapper }
        )
        const input = screen.getByLabelText(/note duration/i)
        expect(input).toContainElement(screen.getByTitle(/Quarter note/i))
        await userEvent.click(input)
        expect(screen.getAllByRole("option")).toHaveLength(4)
    })

    it("should render chord lengths for song in 6/8", async () => {
        const mockOnChange = jest.fn()
        render(
            <ChordLengthSelect
                chordMenuOptions={{
                    chordLength: 2,
                    chord: "C",
                    chordType: ChordType.NOTE,
                    playMetronome: false,
                }}
                onChordMenuOptionChange={mockOnChange}
                song={{ numerator: 6, denominator: 8 }}
            />,
            { wrapper: ComponentTestWrapper }
        )
        const input = screen.getByLabelText(/note duration/i)
        expect(input).toContainElement(screen.getByTitle(/Quarter note/i))
        await userEvent.click(input)
        expect(screen.getAllByRole("option")).toHaveLength(5)
    })
})
