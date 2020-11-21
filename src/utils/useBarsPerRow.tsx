import { useMediaQuery } from "@material-ui/core"

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
