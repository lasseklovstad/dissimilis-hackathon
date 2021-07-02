import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import {
    TextField,
    makeStyles,
    Paper,
    IconButton,
    InputBase,
    Divider,
    ButtonGroup
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { StringMap } from "i18next"
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';


const useStyles = makeStyles((theme) => ({
    background: {
        background: "transparent",
        boxShadow: "none",
        borderWidth: 10,
    },
}))


export const SearchField = (props: { 
    onClick?: () => void,  
    onChange: (txt: string) => void,
    searchTerm?: string}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView.search")

    return(
        <div>
            <TextField id="standard-basic"
            label={searchPlaceholder}
            variant="filled"
            type="search"
            onFocus={() => {
            }}
            onBlur={() => {
            }}
            onChange={(event) => props.onChange(event.target.value)}
            value={props.searchTerm} 
            InputProps={{ 
                disableUnderline: true, 
                endAdornment:
                <ButtonGroup>
                    <IconButton type="submit" 
                    aria-label="search">
                        <SearchIcon />
                    </IconButton>,
                    <IconButton
                    aria-label="clear">
                        <ClearIcon />
                    </IconButton>
                </ButtonGroup>}}/>
            
        </div>
/* 
        <TextField id="standard-basic"
        label={searchPlaceholder}
        variant="filled"
        type="search"
        fullWidth
        onFocus={() => {
        }}
        onBlur={() => {
        }}
        onChange={(event) => props.onChange(event.target.value)}
        value={props.searchTerm} 
        InputProps={{ disableUnderline: true }}/> */
        /* <TextField 
            id="standard-basic"
            label={searchPlaceholder}
            variant="outlined"
            type="search"
            fullWidth
            onFocus={() => {
            }}
            onBlur={() => {
            }}
            onChange={(event) =>
                props.onChange(event.target.value)
            }
            value={props.searchTerm}
        /> */
    )

} 


