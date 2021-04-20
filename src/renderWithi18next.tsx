import React from "react";
import { I18nextProvider } from "react-i18next";
import { render } from "@testing-library/react";
import i18n from "./i18n";
import { TestWrapper } from "./TestWrapper.komponent"

const renderWithi18next = (Component: React.FunctionComponentElement<{ changeLanguage: (lng: any) => void; }>) => {
    const Comp = React.cloneElement(Component, {
        changeLanguage: (lng: any) => {
            i18n.changeLanguage(lng);
            rerender(<I18nextProvider i18n={i18n}>{Comp}</I18nextProvider>);
        }
    });
    const defaultRender = render(
        <TestWrapper>
        <I18nextProvider i18n={i18n}>{Comp}</I18nextProvider>
        </TestWrapper>
    );
    const { rerender } = defaultRender;
    return defaultRender;
};

export default renderWithi18next;
