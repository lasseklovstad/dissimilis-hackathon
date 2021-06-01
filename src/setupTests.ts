// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"

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
