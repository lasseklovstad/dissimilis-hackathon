import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {MusicIcon} from "./MusicIcon.component"
import React from "react"
import {MusicIconProps} from "./MusicIcon.component"

let container: HTMLElement | null = null

const createComponent = async (props: MusicIconProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<MusicIcon {...props}/>, container)
    })
}

describe('MusicIcon-Component', () => {

    beforeAll(async () => {
        await createComponent({} as MusicIconProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('MusicIcon')
    })
})