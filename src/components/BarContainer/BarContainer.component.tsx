import React, { useContext } from "react"
import {
    makeStyles,
    Grid,
    Box,
    Button,
    Menu,
    MenuItem,
    IconButton,
} from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { parse } from "query-string"
import { colors } from "../../utils/colors"
import { Bar } from "../Bar/Bar.component"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { IBar } from "../../models/IBar"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"

export const BarContainer = (props: {
    bar: IBar
    voiceId: number
    onMenuClick: (anchorEl: HTMLElement, barNumber: number) => void
    exportMode: boolean
    rowsPerSheet?: number
    height?: number
    masterSheet?: boolean
}) => {
    const { bar, voiceId } = props

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onMenuClick(event.currentTarget, bar.barNumber)
    }

    return (
        <>
            {props.masterSheet && (
                <Box
                    width="0px"
                    display="flex"
                    position="relative"
                    bottom="-47px"
                    left="-32px"
                    alignItems="flex-end"
                >
                    <IconButton
                        aria-controls="menuBar"
                        aria-haspopup="true"
                        onClick={handleClick}
                        aria-label="Bar options"
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </Box>
            )}
            <Bar
                exportMode={props.exportMode}
                voiceId={props.voiceId}
                barNumber={bar.barNumber - 1}
                height={props.height || 160}
                repBefore={bar.repBefore}
                repAfter={bar.repAfter}
                house={bar.house || undefined}
                chordsAndNotes={bar.chordsAndNotes}
            />
        </>
    )
}
