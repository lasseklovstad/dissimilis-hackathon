import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"

export type ChordMenuAction =
    | {
          type: "UPDATE_OPTIONS"
          menuOptions: IChordMenuOptions
      }
    | {
          type: "UPDATE_CHORD_LENGTH"
          length: number
      }
    | {
          type: "UPDATE_CHORD"
          chord: string
          chordNotes: string[]
      }
    | {
          type: "UPDATE_CHORD_TYPE"
          chordType: ChordType.CHORD | ChordType.NOTE
          chordNotes: string[]
      }
    | {
          type: "UPDATE_CHORD_NOTES"
          chordNotes: string[]
      }

export const chordMenuReducer = (
    chordOptions: IChordMenuOptions,
    action: ChordMenuAction
) => {
    switch (action.type) {
        case "UPDATE_OPTIONS":
            return {
                chordLength: action.menuOptions.chordLength,
                chord: action.menuOptions.chord,
                chordType: action.menuOptions.chordType,
            }
        case "UPDATE_CHORD_LENGTH":
            return {
                ...chordOptions,
                chordLength: action.length,
            }
        case "UPDATE_CHORD":
            return {
                ...chordOptions,
                chord: action.chord,
                chordNotes: action.chordNotes,
            }
        case "UPDATE_CHORD_TYPE":
            return {
                ...chordOptions,
                chordType: action.chordType,
                chordNotes: action.chordNotes,
            }
        case "UPDATE_CHORD_NOTES":
            return {
                ...chordOptions,
                chordNotes: action.chordNotes,
            }
        default:
            return chordOptions
    }
}
