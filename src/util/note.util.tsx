export const getNoteText = (note: string) => {
    switch (note.replace('_', '').replace('^', '')) {
        case "C":
            if (note.indexOf('^') > -1) {
                return '4'
            } else if (note.indexOf('_') > -1) {
                return 'H'
            } else {
                return note
            }
        case "D":
            if (note.indexOf('^') > -1) {
                return '5'
            } else if (note.indexOf('_') > -1) {
                return '4'
            } else {
                return note
            }
        case "E":
            if (note.indexOf('^') > -1) {
                return 'F'
            } else if (note.indexOf('_') > -1) {
                return '4'
            } else {
                return note
            }
        case "F":
            if (note.indexOf('^') > -1) {
                return '1'
            } else if (note.indexOf('_') > -1) {
                return 'E'
            } else {
                return note
            }
        case "G":
            if (note.indexOf('^') > -1) {
                return '2'
            } else if (note.indexOf('_') > -1) {
                return '1'
            } else {
                return note
            }
        case "A":
            if (note.indexOf('^') > -1) {
                return '3'
            } else if (note.indexOf('_') > -1) {
                return '2'
            } else {
                return note
            }
        case "B":
            if (note.indexOf('^') > -1) {
                return 'C'
            } else if (note.indexOf('_') > -1) {
                return '3'
            } else {
                return note
            }
    }
}

export const COLOR = {
    c: '#00ff00',
    d: '#be42c2',
    e: '#8d320d',
    f: '#fffc38',
    g: '#fb1826',
    a: '#3443e7',
    h: '#fd8c2f',
    default: '#3C3C3C'
}

export const getColor = (note: string) => {
    switch (note.replace('_', '').replace('^', '')) {
        case "C":
            if (note.indexOf('^') > -1) {
                return COLOR.default
            } else if (note.indexOf('_') > -1) {
                return COLOR.h
            } else {
                return COLOR.c
            }
        case "D":
            if (note.indexOf('^') > -1) {
                return COLOR.default
            } else if (note.indexOf('_') > -1) {
                return COLOR.default
            } else {
                return COLOR.d
            }
        case "E":
            if (note.indexOf('^') > -1) {
                return COLOR.f
            } else if (note.indexOf('_') > -1) {
                return COLOR.default
            } else {
                return COLOR.e
            }
        case "F":
            if (note.indexOf('^') > -1) {
                return COLOR.default
            } else if (note.indexOf('_') > -1) {
                return COLOR.e
            } else {
                return COLOR.f
            }
        case "G":
            if (note.indexOf('^') > -1) {
                return COLOR.default
            } else if (note.indexOf('_') > -1) {
                return COLOR.default
            } else {
                return COLOR.g
            }
        case "A":
            if (note.indexOf('^') > -1) {
                return COLOR.default
            } else if (note.indexOf('_') > -1) {
                return COLOR.default
            } else {
                return COLOR.a
            }
        case "B":
            if (note.indexOf('^') > -1) {
                return COLOR.c
            } else if (note.indexOf('_') > -1) {
                return COLOR.default
            } else {
                return COLOR.h
            }
    }
}