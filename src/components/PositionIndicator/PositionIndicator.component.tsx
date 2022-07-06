import { Box, useTheme } from "@mui/material"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { getTimePerBar } from "../../utils/usePlaySong.util"

type PositionIndicatorProps = {
    height: number
    left: number
    barsPerRow: number
}

export const PositionIndicator = ({
    height,
    left,
    barsPerRow,
}: PositionIndicatorProps) => {
    const {
        song: { speed, numerator },
    } = useSongContext()
    const getOpacity = () => {
        if (left < 1) {
            return 0
        }
        return 100
    }
    const time = getTimePerBar(speed, numerator)

    const leftMargin = 64
    const rightMargin = 64
    const leftPixle =
        ((document.body.clientWidth - leftMargin - rightMargin) * left) / 100
    return (
        <Box
            sx={{
                backgroundColor: "black",
                border: "solid 2px black",
                borderRadius: "20px",
                boxShadow:
                    "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                width: "1px",
                height,
                zIndex: 1000,
                position: "relative",
                opacity: getOpacity(),
                left: `${leftMargin + leftPixle}px`,
                transition: `left ${left ? barsPerRow * time : 0}ms`,
                transitionTimingFunction: "linear",
            }}
        />
    )
}
