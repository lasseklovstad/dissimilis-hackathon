import {render, unmountComponentAtNode} from "react-dom"
import {act} from "react-dom/test-utils"
import {Home} from "./Home.component"
import React from "react"
import {HomeProps} from "./Home.component"

let container: HTMLElement | null = null

const createComponent = async (props: HomeProps) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    await act(async () => {
        await render(<Home {...props}/>, container)
    })
}

describe('Home-Component', () => {

    beforeAll(async () => {
        await createComponent({} as HomeProps)
    })

    afterAll(() => {
        if (container) {
            unmountComponentAtNode(container)
            container.remove()
            container = null
        }
    })

    it('should include title', () => {
        expect(document.body.textContent).toContain('Home')
    })
})