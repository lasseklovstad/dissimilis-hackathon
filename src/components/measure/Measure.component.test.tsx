import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {Measure} from "./Measure.component"
import React from "react"
import {MeasureProps} from "./Measure.component"

let container: HTMLElement | null = null

const createComponent = async (props: MeasureProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<Measure {...props}/>, container)
    })
}

describe('Measure-Component', () => {

    beforeAll(async () => {
        await createComponent({} as MeasureProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('Measure')
    })
})