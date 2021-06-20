import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { LoginView } from "./LoginView"
import { TestWrapper } from "../../TestWrapper.komponent"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { rest } from "msw"
import { Token } from "../../utils/useApiServiceLogin"
import { sessionStorageMock } from "../../setupTests"

const mockUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
const mockReplaceHistory = jest.fn()

jest.mock("react-router", () => ({
    ...(jest.requireActual("react-router") as any),
    useHistory: () => ({
        replace: mockReplaceHistory,
        push: jest.fn(),
    }),
}))

const server = setupServer(
    rest.get(/login/i, (req, res, ctx) => {
        return res(ctx.status(204), ctx.set("location", mockUrl))
    }),
    rest.post<{ code: string }, Token>(/login/i, (req, res, ctx) => {
        return res(
            ctx.json({
                apiKey: "36476d21801ece54d1f967d89c01cdd5",
                userID: 5,
            })
        )
    })
)

describe("LoginView", () => {
    let location: any
    beforeAll(() => {
        // Enable the mocking in tests.
        server.listen({ onUnhandledRequest: "warn" })
    })

    afterEach(() => {
        // Reset any runtime handlers tests may use.
        window.location = location
        server.resetHandlers()
    })

    afterAll(() => {
        // Clean up once the tests are done.
        server.close()
    })
    beforeEach(() => {
        location = window.location
        delete window.location
        window.location = new URL(location.href) as any
        window.location.assign = jest.fn()
        window.location.replace = jest.fn()
        window.location.reload = jest.fn()
        sessionStorageMock.clear()
    })

    it("should login user and redirect", async () => {
        render(<LoginView />, { wrapper: TestWrapper })
        userEvent.click(
            screen.getByRole("button", {
                name: /Logg inn med microsoft/i,
            })
        )
        await waitFor(() => expect(window.location.href).toBe(mockUrl))
    })

    it("should login user and set sessionStorage items", async () => {
        window.location.search = "code=abc-123"
        render(<LoginView />, { wrapper: TestWrapper })
        await waitFor(() => {
            expect(mockReplaceHistory).toHaveBeenCalledWith("/dashboard")
        })
        expect(sessionStorageMock.getItem("apiKey")).toBe(
            "36476d21801ece54d1f967d89c01cdd5"
        )
        expect(sessionStorageMock.getItem("userId")).toBe("5")
    })

    it("should route user to /dashboard if already logged inn", () => {
        sessionStorageMock.setItem("apiKey", "MockApiKey")
        sessionStorageMock.setItem("userId", "10")
        render(<LoginView />, { wrapper: TestWrapper })
        expect(mockReplaceHistory).toHaveBeenCalledWith("/dashboard")
    })
})
