import { ButtonBase } from "@mui/material"
import { getNoteText, isEmptyNote } from "./Chord.util"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded"
import React, { useEffect, useState } from "react"
import { colors } from "../../utils/colors"
import { Note } from "./Note.component"

type ChordCheckboxProps = {
    note: string
    onChange: (checked: boolean) => Promise<boolean>
    showNoteText: boolean
    selected: boolean
}

export const ChordCheckbox = (props: ChordCheckboxProps) => {
    const { note, showNoteText, onChange, selected } = props
    const [checked, setChecked] = useState(selected)

    const handleClick = async () => {
        const success = await onChange(!checked)
        if (success) {
            setChecked(!checked)
        }
    }
    useEffect(() => {
        setChecked(selected)
    }, [selected])

    return (
        <ButtonBase
            disabled={isEmptyNote(note)}
            sx={{
                marginTop: "1px",
                borderRadius: "3px",
                display: "flex",
                flex: "1",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                boxShadow: `inset 0px 0px 0px 2px ${colors.gray_200}`,
            }}
            focusRipple
            onClick={handleClick}
        >
            <Note
                variant={checked ? "main" : "opaque"}
                note={note}
                highlight={false}
                outline
            >
                {!isEmptyNote(note) &&
                    (checked ? (
                        <CheckCircleRoundedIcon
                            sx={{
                                color: colors.black,
                                marginRight: "0.15rem",
                                fontSize: "1.25rem",
                            }}
                        />
                    ) : (
                        <RadioButtonUncheckedRoundedIcon
                            sx={{
                                color: colors.gray_400,
                                marginRight: "0.15rem",
                                verticalAlign: "middle",
                                fontSize: "1.25rem",
                            }}
                        />
                    ))}
                {getNoteText(note, showNoteText)}
            </Note>
        </ButtonBase>
    )
}
