// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"
import { server } from "./test/test-server"
import { login, logout, resetIndex } from "./test/test-utils"
import { resetSongDB } from "./test/handlers/song-handlers"

jest.setTimeout(50000)

beforeAll(() => {
    // Enable the mocking in tests.
    server.listen({ onUnhandledRequest: "warn" })
})

afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers()
    logout()
    resetSongDB()
    resetIndex()
})

afterAll(() => {
    // Clean up once the tests are done.
    server.close()
})
beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    login()
})
