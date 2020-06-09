import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {Song} from "./Song.component"
import React from "react"
import {SongProps} from "./Song.component"

let container: HTMLElement | null = null

const createComponent = async (props: SongProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<Song {...props}/>, container)
    })
}

describe('Song-Component', () => {

    beforeAll(async () => {
        await createComponent({} as SongProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('Song')
    })
})