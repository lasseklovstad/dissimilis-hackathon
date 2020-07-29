import React, { useContext } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import BottomBar from './BottomBar.component';
import { SongContext } from "../../views/SongView/SongContextProvider.component";


afterEach(cleanup);



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
    it('Note and Chord should be exclusively toggled', function () {

    const { addEmptyBar } = render(<SongContext.Provider value={song}>{addEmptyBar()}</SongContext.Provider> )




        /* render(<BrowserRouter><BottomBar /></BrowserRouter>);
        const addBarButton = screen.getByRole("button", { name: /BottomBar:addBar/i });
        addBarButton.click();

      */

       

        /* expect(addEmptyBar).toHaveBeenCalled()


          addBarButton.click();
         const value = voices[0].bars.length
         expect(value).toBe(2); */


    });


})
