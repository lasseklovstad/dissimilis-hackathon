// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"
import { resetSongDB, server } from "./test/test-server"
import { login, logout, resetIndex } from "./test/test-utils"

class SessionStorageMock implements Storage {
    private store: any = {}

    readonly length: number = Object.getOwnPropertyNames(this.store).length

    clear() {
        this.store = {}
    }

    getItem(key: string) {
        return this.store[key] || null
    }

    setItem(key: string, value: string) {
        this.store[key] = value.toString()
    }

    removeItem(key: string) {
        delete this.store[key]
    }

    key(index: number): string | null {
        return Object.getOwnPropertyNames(this.store)[index]
    }
}

export const sessionStorageMock = new SessionStorageMock()
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock })
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
    login()
})
