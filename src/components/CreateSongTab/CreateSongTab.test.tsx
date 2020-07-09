import React from "react";
import { render, screen, findByText } from "@testing-library/react";
import CreateSongTab from "./CreateSongTab";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("CreateSongTab", () => {
    it("should create a new instrument", function () {
        render(<BrowserRouter><CreateSongTab /></BrowserRouter>);
        const addNewInstrumentButton = screen.getByRole("button", { name: /CreateSongTab:newInstrument/i });
        addNewInstrumentButton.click();


        const textInputField = screen.getByRole("textbox");
        userEvent.type(textInputField, "Guitar");

        const saveButton = screen.getByRole("button", { name: /CreateSongTab:save/i });

        expect(saveButton).toBeEnabled();

    });

    it("should not create a new instrument when field is empty", function () {
        render(<BrowserRouter><CreateSongTab /></BrowserRouter>);
        const addNewInstrumentButton = screen.getByRole("button", { name: /CreateSongTab:newInstrument/i });
        addNewInstrumentButton.click();

        const saveButton = screen.getByRole("button", { name: /CreateSongTab:save/i });

        expect(saveButton).toBeDisabled();
    });
});