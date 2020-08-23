/* eslint-disable func-names */
import React from "react"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import LoginView from "./LoginView"

describe("LoginView", () => {
    it("textfield should be showing on login page", function () {
        render(
            <BrowserRouter>
                {" "}
                <LoginView />{" "}
            </BrowserRouter>
        )
        expect(screen.findAllByRole("textfield")).not.toBeDisabled()
    })

    it("LoginButton should be showing on login page", function () {
        render(
            <BrowserRouter>
                {" "}
                <LoginView />{" "}
            </BrowserRouter>
        )
        const LoginButton = screen.getAllByRole("button", {
            name: /LoginView:login/i,
        })
        expect(LoginButton[0]).toBeEnabled()
    })
    it("LoginButton for Microsoft should be showing on login page", function () {
        render(
            <BrowserRouter>
                {" "}
                <LoginView />{" "}
            </BrowserRouter>
        )
        const LoginButtonMicrosoft = screen.getAllByRole("button", {
            name: /LoginView:loginWithMicrosoft/i,
        })
        expect(LoginButtonMicrosoft[0]).toBeEnabled()
    })
})
