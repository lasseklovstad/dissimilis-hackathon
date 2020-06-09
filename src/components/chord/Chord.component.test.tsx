import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {Chord} from "./Chord.component"
import React from "react"
import {ChordProps} from "./Chord.component"

let container: HTMLElement | null = null

const createComponent = async (props: ChordProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<Chord {...props}/>, container)
    })
}

describe('Chord-Component', () => {

    beforeAll(async () => {
        await createComponent({} as ChordProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('Chord')
    })
})