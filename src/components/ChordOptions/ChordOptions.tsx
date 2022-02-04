import { useGetChordIntervals } from "../../utils/useApiServiceGlobalNote.util"
import { useTranslation } from "react-i18next"
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import React from "react"

export const ChordOptions = (props: {
    chord: string
    selectedIntervalPositions: number[]
    addChordInterval: (intervalPosition: number) => void
    removeChordInterval: (intervalPosition: number) => void
}) => {
    const {
        chord,
        addChordInterval,
        removeChordInterval,
        selectedIntervalPositions,
    } = props
    const { chordIntervalsData } = useGetChordIntervals(chord)
    const { t } = useTranslation()

    if (!chordIntervalsData) {
        return null
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 8px",
                height: "auto",
            }}
        >
            <FormGroup row>
                {chordIntervalsData.intervalNames.map(
                    (interval, intervalPosition) => {
                        return (
                            <FormControlLabel
                                key={interval}
                                control={
                                    <Checkbox
                                        color="default"
                                        checked={selectedIntervalPositions.includes(
                                            intervalPosition
                                        )}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? addChordInterval(
                                                      intervalPosition
                                                  )
                                                : removeChordInterval(
                                                      intervalPosition
                                                  )
                                        }
                                        name={interval}
                                    />
                                }
                                label={t<string>(`BottomBar.${interval}`)}
                            />
                        )
                    }
                )}
            </FormGroup>
        </Box>
    )
}
