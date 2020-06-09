import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {Note} from "./Note.component"
import React from "react"
import {NoteProps} from "./Note.component"

let container: HTMLElement | null = null

const createComponent = async (props: NoteProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<Note {...props}/>, container)
    })
}

describe('Note-Component', () => {

    beforeAll(async () => {
        await createComponent({} as NoteProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('Note')
    })
})