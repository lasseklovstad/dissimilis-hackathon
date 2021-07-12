import React, { useState } from "react"
import { TextField, IconButton, InputAdornment } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import { useHistory } from "react-router-dom"

export const SearchField = (props: { searchTermInit?: string }) => {
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView.search")
    const history = useHistory()
    const [searchTerm, setSeachTerm] = useState(props.searchTermInit || "")

    const handleOnClick = () => {
        history.push(`library?search=${searchTerm}`)
    }

    return (
        <TextField
            id="standard-basic"
            variant="outlined"
            fullWidth
            placeholder={searchPlaceholder}
            value={searchTerm}
            onFocus={() => {}}
            onBlur={() => {}}
            onChange={(event) => {
                setSeachTerm(event.target.value)
            }}
            onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                    handleOnClick()
                    ev.preventDefault()
                }
            }}
            InputProps={{
                inputProps: { "aria-label": searchPlaceholder },
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            type="submit"
                            aria-label={searchPlaceholder}
                            onClick={handleOnClick}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton
                            aria-label={t("TopBar.clearLabel")}
                            onClick={() => {
                                setSeachTerm("")
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}
