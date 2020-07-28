import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import BottomBar from './BottomBar.component';

describe('BottomBar', () => {

    it('Add tone button should be showing on bottombar', function () {
        render(<BrowserRouter> <BottomBar /> </BrowserRouter>);
        const addToneButton = screen.getAllByRole("button", { name: /BottomBar:addTone/i })
        expect(addToneButton[0]).toBeEnabled();

    });
    it('Add Bar button should be showing on login page', function () {
        render(<BrowserRouter> <BottomBar /> </BrowserRouter>);
        const addBarButton = screen.getAllByRole("button", { name: /BottomBar:addBar/i })
        expect(addBarButton[0]).toBeEnabled();
    });



})
