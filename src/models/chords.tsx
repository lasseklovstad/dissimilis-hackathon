import { ChordType, Chord } from '@tonaljs/tonal'
import { allNotes as noteArray } from './notes'

const chordNames = [
    "C", "Cm", "C7", "Cm7", "Cmaj7", "Cm/ma7", "C6", "Cm6", "C6/9", "C5", "C9", "Cm9", "Cmaj9", "C9sus4", "Cm11", "C13", "Cm13", "Cmaj13", "Cdim", "Cdim7", "Cm7b5", "Caug", "Caug7",
    "C#", "C#m", "C#7", "C#m7", "C#maj7", "C#m/ma7", "C#6", "C#m6", "C#6/9", "C#5", "C#9", "C#m9", "C#maj9", "C#9sus4", "C#m11", "C#13", "C#m13", "C#maj13", "C#dim", "C#dim7", "C#m7b5", "C#aug", "C#aug7",
    "D", "Dm", "D7", "Dm7", "Dmaj7", "Dm/ma7", "D6", "Dm6", "D6/9", "D5", "D9", "Dm9", "Dmaj9", "D9sus4", "Dm11", "D13", "Dm13", "Dmaj13", "Ddim", "Ddim7", "Dm7b5", "Daug", "Daug7",
    "D#", "D#m", "D#7", "D#m7", "D#maj7", "D#m/ma7", "D#6", "D#m6", "D#6/9", "D#5", "D#9", "D#m9", "D#maj9", "D#9sus4", "D#m11", "D#13", "D#m13", "D#maj13", "D#dim", "D#dim7", "D#m7b5", "D#aug", "D#aug7",
    "E", "Em", "E7", "Em7", "Emaj7", "Em/ma7", "E6", "Em6", "E6/9", "E5", "E9", "Em9", "Emaj9", "E9sus4", "Em11", "E13", "Em13", "Emaj13", "Edim", "Edim7", "Em7b5", "Eaug", "Eaug7",
    "F", "Fm", "F7", "Fm7", "Fmaj7", "Fm/ma7", "F6", "Fm6", "F6/9", "F5", "F9", "Fm9", "Fmaj9", "F9sus4", "Fm11", "F13", "Fm13", "Fmaj13", "Fdim", "Fdim7", "Fm7b5", "Faug", "Faug7",
    "F#", "F#m", "F#7", "F#m7", "F#maj7", "F#m/ma7", "F#6", "F#m6", "F#6/9", "F#5", "F#9", "F#m9", "F#maj9", "F#9sus4", "F#m11", "F#13", "F#m13", "F#maj13", "F#dim", "F#dim7", "F#m7b5", "F#aug", "F#aug7",
    "G", "Gm", "G7", "Gm7", "Gmaj7", "Gm/ma7", "G6", "Gm6", "G6/9", "G5", "G9", "Gm9", "Gmaj9", "G9sus4", "Gm11", "G13", "Gm13", "Gmaj13", "Gdim", "Gdim7", "Gm7b5", "Gaug", "Gaug7",
    "G#", "G#m", "G#7", "G#m7", "G#maj7", "G#m/ma7", "G#6", "G#m6", "G#6/9", "G#5", "G#9", "G#m9", "G#maj9", "G#9sus4", "G#m11", "G#13", "G#m13", "G#maj13", "G#dim", "G#dim7", "G#m7b5", "G#aug", "G#aug7",
    "A", "Am", "A7", "Am7", "Amaj7", "Am/ma7", "A6", "Am6", "A6/9", "A5", "A9", "Am9", "Amaj9", "A9sus4", "Am11", "A13", "Am13", "Amaj13", "Adim", "Adim7", "Am7b5", "Aaug", "Aaug7",
    "A#", "A#m", "A#7", "A#m7", "A#maj7", "A#m/ma7", "A#6", "A#m6", "A#6/9", "A#5", "A#9", "A#m9", "A#maj9", "A#9sus4", "A#m11", "A#13", "A#m13", "A#maj13", "A#dim", "A#dim7", "A#m7b5", "A#aug", "A#aug7",
    "B", "Bm", "B7", "Bm7", "Bmaj7", "Bm/ma7", "B6", "Bm6", "B6/9", "B5", "B9", "Bm9", "Bmaj9", "B9sus4", "Bm11", "B13", "Bm13", "Bmaj13", "Bdim", "Bdim7", "Bm7b5", "Baug", "Baug7",
]

const fillChords = (): { name: string, notes: string[] }[] => {
    let chords = [];
    for (let i = 0; i < chordNames.length; i++) {
        let name: string = chordNames[i];
        let notes: string[] = Chord.get(name).notes;
        //Need to remove octaves
        for (let j = 0; j < notes.length; j++) {
            notes[j] = notes[j].replace(/[0-9]/g, '');
            let keyIndex = Object.keys(noteArray).indexOf(notes[j]);
            notes[j] = Object.values(noteArray)[keyIndex];
        }
        let obj = {
            name: name,
            notes: notes
        }
        chords.push(obj)
    }
    return chords;
}

//Chords is an array consisting of objects of chords
// [{name: "C", notes: ["C"]}]
export const chords = fillChords();
