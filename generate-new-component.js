// Skript for å lage en ny komponent
// to input argumenter:
// navn: navn på komponent
// mappe: mappe komponenten skal ligge i relativt til ./src/
// test: optional, hvis tilstede inkluderes testfil
// Kør script: node generer-ny-komponent.js --test --mappe=felleskomponenter --navn=test

const fs = require('fs')
const path = require('path')

const getTestFilInnhold = (componentName) => {
    const propsNavn = componentName + "Props"
    return 'import {render, unmountComponentAtNode} from "react-dom"\n' +
        'import {act} from "react-dom/test-utils"\n' +
        'import {' + componentName + '} from "./' + componentName + '.component"\n' +
        'import React from "react"\n' +
        'import {'+propsNavn+'} from "./'+componentName+'.component"\n'+
        '\n' +
        'let container: HTMLElement | null = null\n' +
        '\n' +
        'const createComponent = async (props: ' + propsNavn + ') => {\n' +
        '    container = document.createElement("div")\n' +
        '    document.body.appendChild(container)\n' +
        '    await act(async () => {\n' +
        '        await render(<' + componentName + ' {...props}/>, container)\n' +
        '    })\n' +
        '}\n' +
        '\n' +
        'describe(\'' + componentName + '-Component\', () => {\n' +
        '\n' +
        '    beforeAll(async () => {\n' +
        '        await createComponent({} as '+propsNavn + ')\n'+
        '    })\n' +
        '\n' +
        '    afterAll(() => {\n' +
        '        if (container) {\n' +
        '            unmountComponentAtNode(container)\n' +
        '            container.remove()\n' +
        '            container = null\n' +
        '        }\n' +
        '    })\n' +
        '\n' +
        '    it(\'should include title\', () => {\n' +
        '        expect(document.body.textContent).toContain(\'' + componentName + '\')\n' +
        '    })\n' +
        '})'
}

const lagKomponentFil = (mappe, navnMedStorBokstav, includeTest) => {
    const filnavn = navnMedStorBokstav + '.component.tsx'
    const filnavnTest = navnMedStorBokstav + '.component.test.tsx'
    const propsNavn = navnMedStorBokstav + "Props"
    const filText = "import React from \"react\"\n" +
        "\n" +
        "export type " + propsNavn + " = {\n" +
        "}\n" +
        "\n" +
        "export const " + navnMedStorBokstav + " : React.FC<" + propsNavn + "> = props =>{\n" +
        "    return <React.Fragment>" + navnMedStorBokstav + "</React.Fragment>\n" +
        "}"
    const filbane = path.resolve(mappe, filnavn)
    const filbaneTest = path.resolve(mappe, filnavnTest)
    console.log("Lager fil: ", filbane)
    fs.writeFileSync(filbane, filText)
    if (includeTest) {
        fs.writeFileSync(filbaneTest, getTestFilInnhold(navnMedStorBokstav))
    }
}

const generer = () => {
    if (!process.env.npm_config_mappe) {
        throw new Error("Argument --mappe er obligatorisk men er ikke tilstede")
    } else if (!process.env.npm_config_navn) {
        throw new Error("Argument --navn er obligatorisk men er ikke tilstede")
    }

    const navn = process.env.npm_config_navn
    const includeTests = process.env.npm_config_test
    const navnMedStorBokstav = navn[0].toUpperCase() + navn.substring(1)
    const navnMedLitenBokstav = navn[0].toLowerCase() + navn.substring(1)
    const mappe = path.resolve('./src', process.env.npm_config_mappe)

    if (fs.existsSync(mappe)) {
        const nyMappe = path.resolve(mappe, navnMedLitenBokstav)
        if (fs.existsSync(nyMappe)) {
            throw new Error("Komponenten eksisterer fra før av")
        }
        fs.mkdir(nyMappe, (err) => {
            if (err) {
                throw new Error(err)
            } else {
                lagKomponentFil(nyMappe, navnMedStorBokstav.trim(), includeTests)
            }
        })

    } else {
        throw new Error("Mappen eksisterer ikke")
    }

}

generer()