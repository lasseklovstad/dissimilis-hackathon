import React, { useState } from "react"
import { TextField, IconButton, InputAdornment } from "@mui/material"
import { useTranslation } from "react-i18next"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"

export const SearchField = (props: {
    searchTermInit?: string
    handleOnSubmit: (searchTerm: string) => void
}) => {
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView.search")
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
                            size="large">
                            <SearchIcon />
                        </IconButton>
                        <IconButton
                            aria-label={t("TopBar.clearLabel")}
                            onClick={() => {
                                setSeachTerm("")
                            }}
                            size="large">
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
