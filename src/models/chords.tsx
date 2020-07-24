import { ChordType, Chord } from '@tonaljs/tonal'
import { allNotes as noteArray } from './notes'

const chordNames = [
    "C", "Cm", "C7", "Cm7", "Cmaj7", "CmM7", "C6", "Cm6", "C6/9", "C5", "C9", "Cm9", "Cmaj9", "C11", "Cm11", "C13", "Cm13", "Cmaj13", "Cdim", "Cdim7", "Cm7b5", "Caug", "Caug7",
    "C#", "C#m", "C#7", "C#m7", "C#maj7", "C#mM7", "C#6", "C#m6", "C#6/9", "C#5", "C#9", "C#m9", "C#maj9", "C#11", "C#m11", "C#13", "C#m13", "C#maj13", "C#dim", "C#dim7", "C#m7b5", "C#aug", "C#aug7",
    "Db", "Dbm", "Db7", "Dbm7", "Dbmaj7", "DbmM7", "Db6", "Dbm6", "Db6/9", "Db5", "Db9", "Dbm9", "Dbmaj9", "Db11", "Dbm11", "Db13", "Dbm13", "Dbmaj13", "Dbdim", "Dbdim7", "Dbm7b5", "Dbaug", "Dbaug7",
    "D", "Dm", "D7", "Dm7", "Dmaj7", "DmM7", "D6", "Dm6", "D6/9", "D5", "D9", "Dm9", "Dmaj9", "D11", "Dm11", "D13", "Dm13", "Dmaj13", "Dadd", "D7-5", "D7+5", "Dsus7", "Ddim", "Ddim7", "Dm7b5", "Daug", "Daug7",
    "D#", "D#m", "D#7", "D#m7", "D#maj7", "D#mM7", "D#6", "D#m6", "D#6/9", "D#5", "D#9", "D#m9", "D#maj9", "D#11", "D#m11", "D#13", "D#m13", "D#maj13", "D#add", "D#7-5", "D#7+5", "D#sus", "D#dim", "D#dim7", "D#m7b5", "D#aug", "D#aug7",
    "Eb", "Ebm", "Eb7", "Ebm7", "Ebmaj7", "EbmM7", "Eb6", "Ebm6", "Eb6/9", "Eb5", "Eb9", "Ebm9", "Ebmaj9", "Eb11", "Ebm11", "Eb13", "Ebm13", "Ebmaj13", "Ebadd", "Eb7-5", "Eb7+5", "Ebsus", "Ebdim", "Ebdim7", "Ebm7b5", "Ebaug", "Ebaug7",
    "E", "Em", "E7", "Em7", "Emaj7", "EmM7", "E6", "Em6", "E6/9", "E5", "E9", "Em9", "Emaj9", "E11", "Em11", "E13", "Em13", "Emaj13", "Eadd", "E7-5", "E7+5", "Esus", "Edim", "Edim7", "Em7b5", "Eaug", "Eaug7",
    "F", "Fm", "F7", "Fm7", "Fmaj7", "FmM7", "F6", "Fm6", "F6/9", "F5", "F9", "Fm9", "Fmaj9", "F11", "Fm11", "F13", "Fm13", "Fmaj13", "Fadd", "F7-5", "F7+5", "Fsus", "Fdim", "Fdim7", "Fm7b5", "Faug", "Faug7",
    "F#", "F#m", "F#7", "F#m7", "F#maj7", "F#mM7", "F#6", "F#m6", "F#6/9", "F#5", "F#9", "F#m9", "F#maj9", "F#11", "F#m11", "F#13", "F#m13", "F#maj13", "F#add", "F#7-5", "F#7+5", "F#sus", "F#dim", "F#dim7", "F#m7b5", "F#aug", "F#aug7",
    "Gb", "Gbm", "Gb7", "Gbm7", "Gbmaj7", "GbmM7", "Gb6", "Gbm6", "Gb6/9", "Gb5", "Gb9", "Gbm9", "Gbmaj9", "Gb11", "Gbm11", "Gb13", "Gbm13", "Gbmaj13", "Gbadd", "Gb7-5", "Gb7+5", "Gbsus", "Gbdim", "Gbdim7", "Gbm7b5", "Gbaug", "Gbaug7",
    "G", "Gm", "G7", "Gm7", "Gmaj7", "GmM7", "G6", "Gm6", "G6/9", "G5", "G9", "Gm9", "Gmaj9", "G11", "Gm11", "G13", "Gm13", "Gmaj13", "Gadd", "G7-5", "G7+5", "Gsus", "Gdim", "Gdim7", "Gm7b5", "Gaug", "Gaug7",
    "G#", "G#m", "G#7", "G#m7", "G#maj7", "G#mM7", "G#6", "G#m6", "G#6/9", "G#5", "G#9", "G#m9", "G#maj9", "G#11", "G#m11", "G#13", "G#m13", "G#maj13", "G#add", "G#7-5", "G#7+5", "G#sus", "G#dim", "G#dim7", "G#m7b5", "G#aug", "G#aug7",
    "Ab", "Abm", "Ab7", "Abm7", "Abmaj7", "AbmM7", "Ab6", "Abm6", "Ab6/9", "Ab5", "Ab9", "Abm9", "Abmaj9", "Ab11", "Abm11", "Ab13", "Abm13", "Abmaj13", "Abadd", "Ab7-5", "Ab7+5", "Absus", "Abdim", "Abdim7", "Abm7b5", "Abaug", "Abaug7",
    "A", "Am", "A7", "Am7", "Amaj7", "AmM7", "A6", "Am6", "A6/9", "A5", "A9", "Am9", "Amaj9", "A11", "Am11", "A13", "Am13", "Amaj13", "Aadd", "A7-5", "A7+5", "Asus", "Adim", "Adim7", "Am7b5", "Aaug", "Aaug7",
    "A#", "A#m", "A#7", "A#m7", "A#maj7", "A#mM7", "A#6", "A#m6", "A#6/9", "A#5", "A#9", "A#m9", "A#maj9", "A#11", "A#m11", "A#13", "A#m13", "A#maj13", "A#add", "A#7-5", "A#7+5", "A#sus", "A#dim", "A#dim7", "A#m7b5", "A#aug", "A#aug7",
    "Bb", "Bbm", "Bb7", "Bbm7", "Bbmaj7", "BbmM7", "Bb6", "Bbm6", "Bb6/9", "Bb5", "Bb9", "Bbm9", "Bbmaj9", "Bb11", "Bbm11", "Bb13", "Bbm13", "Bbmaj13", "Bbadd", "Bb7-5", "Bb7+5", "Bbsus", "Bbdim", "Bbdim7", "Bbm7b5", "Bbaug", "Bbaug7",
    "B", "Bm", "B7", "Bm7", "Bmaj7", "BmM7", "B6", "Bm6", "B6/9", "B5", "B9", "Bm9", "Bmaj9", "B11", "Bm11", "B13", "Bm13", "Bmaj13", "Badd", "B7-5", "B7+5", "Bsus", "Bdim", "Bdim7", "Bm7b5", "Baug", "Baug7",
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
/*
export const chords = {
    "CM": ["C", "E", "G"],
    "DM": ["D", "F#", "A"],
    "D#M": ["D#", "G", "A#"],
    "EM": ["E", "G#", "B"],
    "FM": ["F", "A", "C"],
    "F#M": ["F#", "A#", "C#"],
    "GM": ["G", "H", "D"],
    "G#M": ["G#", "C", "D#"],
    "AM": ["A", "C#", "E"],
    "A#M": ["A#", "D", "F"],
    "HM": ["B", "D#", "F#"],
    "Cm": ["C", "D#", "G"],
    "C#m": ["C#", "E", "G#"],
    "Dm": ["D", "F", "A"],
    "D#m": ["D#", "F#", "A#"],
    "Em": ["E", "G", "H"],
    "Fm": ["F", "G#", "C"],
    "F#m": ["F#", "A", "C#"],
    "Gm": ["G", "A#", "D"],
    "G#m": ["G#", "H", "D#"],
    "Am": ["A", "C", "E"],
    "A#m": ["A#", "C#", "F"],
    "Hm": ["B", "D", "F#"],
}
*/
