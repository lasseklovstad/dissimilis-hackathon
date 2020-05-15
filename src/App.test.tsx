import React from 'react';
import App from './App';
import {act} from "react-dom/test-utils";
import {render} from "react-dom";


let container: HTMLElement | null = null;

const lagKomponent = async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    await act(async () => {
        await render(<App/>, container)
    })
};


describe('App', () => {
    beforeAll(async () => {
        await lagKomponent()
    });
    it('should display title', function () {
        expect(document.getElementById('app-tittle')?.textContent).toBe('Hello Dissimilis!')
    });
});
