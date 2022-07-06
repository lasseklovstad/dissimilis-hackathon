import {ITimeSignature} from "../../models/ITimeSignature";
import {BarNumber, TimeSignature} from "../SongViewComponents/SongView.component";
import {Box} from "@mui/material";

export const BarPrefix = (props: { index: number; timeSignature: ITimeSignature }) => {
    const {index, timeSignature} = props

    const getPrefixItem = () => {
        if (index === 0) {
            return <TimeSignature timeSignature={timeSignature}/>
        }
        return <BarNumber barNumber={index + 1}/>
    }
    const PrefixItem = getPrefixItem()

    return (
        <Box flexGrow={0} height="calc(100% - 25px)">
            {PrefixItem}
        </Box>
    )
}
