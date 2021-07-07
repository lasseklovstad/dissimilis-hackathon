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
        history.push(`Library?search=${searchTerm}`)
    }

    return (
        <div>
            <TextField
                id="standard-basic"
                variant="outlined"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onFocus={() => {}}
                onBlur={() => {}}
                onChange={(event) => {
                    setSeachTerm(event.target.value)
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                type="submit"
                                aria-label="search"
                                onClick={handleOnClick}
                            >
                                <SearchIcon />
                            </IconButton>
                            <IconButton
                                aria-label="clear"
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
        </div>
    )
}
