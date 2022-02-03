import { useMediaQuery } from "@mui/material"
import { IBar } from "./../models/IBar"
import { SongAction } from "./../views/SongView/SongContextProvider.component"
import {
    useCopyBars,
    useDeleteBars as useDeleteBarsApi,
} from "./useApiServiceSongs"

export const useBarsPerRow = () => {
    const xs = useMediaQuery("(max-width: 600px)")
    const xl = useMediaQuery("(min-width: 1920px)")
    const getBarPerRow = () => {
        if (xs) {
            return 1
        }
        if (xl) {
            return 4
        }
        return 2
    }

    return getBarPerRow()
}

export const useBars = (
    songId: number,
    dispatchSong: React.Dispatch<SongAction>,
    selectedBars:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined,
    setSelectedBars: React.Dispatch<
        React.SetStateAction<
            | {
                  fromPosition: number
                  toPosition: number
              }
            | undefined
        >
    >,
    barsClipboard:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined,
    setBarsClipboard: React.Dispatch<
        React.SetStateAction<
            | {
                  fromPosition: number
                  toPosition: number
              }
            | undefined
        >
    >
) => {
    const { postCopyBars } = useCopyBars(songId)

    const pasteBars = async (type: "pasteBefore" | "pasteAfter", bar: IBar) => {
        if (barsClipboard) {
            let body
            if (type === "pasteBefore") {
                body = {
                    fromPosition: barsClipboard.fromPosition,
                    copyLength:
                        barsClipboard.toPosition -
                        barsClipboard.fromPosition +
                        1,
                    toPosition: bar.position,
                }
            } else {
                body = {
                    fromPosition: barsClipboard.fromPosition,
                    copyLength:
                        barsClipboard.toPosition -
                        barsClipboard.fromPosition +
                        1,
                    toPosition: bar.position + 1,
                }
            }
            const { error, result } = await postCopyBars.run(body)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }
    const { postDeleteBars } = useDeleteBarsApi(songId)

    const deleteBars = async () => {
        if (selectedBars) {
            const { error, result } = await postDeleteBars.run({
                fromPosition: selectedBars.fromPosition,
                deleteLength:
                    selectedBars.toPosition - selectedBars.fromPosition + 1,
            })

            if (!error && result) {
                setSelectedBars(undefined)
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

    const barClicked = (bar: IBar) => {
        if (!selectedBars) {
            setSelectedBars({
                fromPosition: bar.position,
                toPosition: bar.position,
            })
        } else {
            if (bar.position > selectedBars.fromPosition) {
                setSelectedBars({
                    fromPosition: selectedBars.fromPosition,
                    toPosition: bar.position,
                })
            } else if (selectedBars.fromPosition === bar.position) {
                setSelectedBars(undefined)
            } else {
                setSelectedBars({
                    fromPosition: bar.position,
                    toPosition: bar.position,
                })
            }
        }
    }

    const copySelectedBars = () => {
        setBarsClipboard(selectedBars)
        setSelectedBars(undefined)
    }

    return { deleteBars, pasteBars, barClicked, copySelectedBars }
}
