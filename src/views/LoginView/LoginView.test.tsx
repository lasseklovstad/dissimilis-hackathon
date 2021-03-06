import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { LoginView } from "./LoginView"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import { login, logout } from "../../test/test-utils"
import { mockUrl } from "../../test/handlers/login-handlers"
import { sessionStorageMock } from "../../test/mock/storage.mock"

const mockNavigation = jest.fn()

jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom") as any),
    useNavigate: () => mockNavigation,
}))

describe("LoginView", () => {
    let location: any

    afterEach(() => {
        // Reset any runtime handlers tests may use.
        window.location = location
    })

    beforeEach(() => {
        location = window.location
        // @ts-ignore
        delete window.location
        window.location = new URL(location.href) as any
        window.location.assign = jest.fn()
        window.location.replace = jest.fn()
        window.location.reload = jest.fn()
        sessionStorageMock.clear()
    })

    it("should login user and redirect", async () => {
        logout()
        render(<LoginView />, { wrapper: TestWrapper })
        await userEvent.click(
            screen.getByRole("button", {
                name: /Sign in with Microsoft/i,
            })
        )
        await waitFor(() => expect(window.location.href).toBe(mockUrl))
    })

    it("should login user and set sessionStorage items", async () => {
        logout()
        window.location.search = "code=abc-123"
        render(<LoginView />, { wrapper: TestWrapper })
        await waitFor(() => {
            expect(mockNavigation).toHaveBeenCalledWith("/dashboard")
        })
        expect(sessionStorageMock.getItem("apiKey")).toBe(
            "36476d21801ece54d1f967d89c01cdd5"
        )
        expect(sessionStorageMock.getItem("userId")).toBe("5")
    })

    it("should route user to /dashboard if already logged inn", () => {
        login()
        render(<LoginView />, { wrapper: TestWrapper })
        expect(mockNavigation).toHaveBeenCalledWith("/dashboard")
    })
})
