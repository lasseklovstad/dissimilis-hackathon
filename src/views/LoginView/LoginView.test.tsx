import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import LoginView from './LoginView'

describe('LoginView', () => {

    it('button should be showing on login page', async () => {
        render(<BrowserRouter> <LoginView /> </BrowserRouter>)


        expect(screen.getByRole('button')).not.toHaveAttribute('disabled')

    })

    it('textfield should be showing on login page', async () => {
        render(<BrowserRouter> <LoginView /> </BrowserRouter>)

        expect(screen.findAllByRole('textfield')).not.toBeDisabled

    })

})
