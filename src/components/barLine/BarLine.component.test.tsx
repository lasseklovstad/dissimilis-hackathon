import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {BarLine} from "./BarLine.component"
import React from "react"
import {BarLineProps} from "./BarLine.component"

let container: HTMLElement | null = null

const createComponent = async (props: BarLineProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<BarLine {...props}/>, container)
    })
}

describe('BarLine-Component', () => {

    beforeAll(async () => {
        await createComponent({} as BarLineProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('BarLine')
    })
})