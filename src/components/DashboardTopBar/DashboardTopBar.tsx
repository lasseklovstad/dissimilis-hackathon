import React, { useState } from "react"
import { Box, Grid, TextField, AppBar, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"

const useStyles = makeStyles(() => ({
    background: {
        background: "transparent",
        boxShadow: "none",
    },
}))

export const DashboardTopBar = (props: {
    onBlur: Function
    onChange: Function
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView:search")
    const [searchBarFocus, setSearchBarFocus] = useState(false)

    const handleOnFocus = () => {
        setSearchBarFocus(true)
    }

    const handleOnBlur = () => {
        setSearchBarFocus(false)
        props.onBlur()
    }

    const handleOnChange = (searchTerm: string) => {
        props.onChange(searchTerm)
    }

    return (
        <div>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Grid item sm={1} />
                        <Grid item xs={2}>
                            <DashboardTopBarIcon />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={searchBarFocus ? 2 : 5}
                            md={searchBarFocus ? 3 : 5}
                        />
                        <Grid
                            item
                            xs={12}
                            sm={searchBarFocus ? 6 : 3}
                            md={searchBarFocus ? 5 : 3}
                        >
                            <TextField
                                id="standard-basic"
                                label={searchPlaceholder}
                                variant="outlined"
                                type="search"
                                fullWidth
                                onFocus={handleOnFocus}
                                onBlur={handleOnBlur}
                                onChange={(event) =>
                                    handleOnChange(event.target.value)
                                }
                            />
                        </Grid>
                    </Grid>
                </Box>
            </AppBar>
        </div>
    )
}
