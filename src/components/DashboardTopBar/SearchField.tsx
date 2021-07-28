import React, { useState } from "react"
import { TextField, IconButton, InputAdornment } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import { useHistory } from "react-router-dom"

export const SearchField = (props: {
    searchTermInit?: string
    handleOnSubmit: (searchTerm: string) => void
}) => {
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView.search")
    const history = useHistory()
    const { searchTermInit, handleOnSubmit } = props
    const [searchTerm, setSeachTerm] = useState(searchTermInit || "")

    return (
        <TextField
            id="standard-basic"
            variant="outlined"
            fullWidth
            autoFocus={!!searchTerm}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => {
                setSeachTerm(event.target.value)
            }}
            onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                    handleOnSubmit(searchTerm)
                    ev.preventDefault()
                }
            }}
            InputProps={{
                inputProps: {
                    "aria-label": searchPlaceholder,
                },
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            type="submit"
                            aria-label={searchPlaceholder}
                            onClick={() => {
                                handleOnSubmit(searchTerm)
                            }}
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
