import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { TextField, Button, Popper, Box, Grid } from '@material-ui/core';
import { colors } from '../../utils/colors';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { SongToolsContext } from '../../views/SongView/SongToolsContextProvider.component';
import { useTranslation } from 'react-i18next';
import { getColor, tangentToNumber } from '../Bar/BarBody.component';



export type AddButtonProps = {
    text: string,
    link?: string,
    onClick?: Function,
    selected?: boolean
};
export type ButtonProps = {
    text: string,
    link?: string,
    onClick?: Function
};
export type AutocompleteProps = {
    icon: React.ReactNode,
    notesOrChords: string[],
    noOptionsText: string
};


export const MenuButtonWithAddIcon: FunctionComponent<AddButtonProps> = (props) => {
    const styles = useStyles();
    return (
        <Button
            variant="outlined"
            size="large"
            className={styles.addbutton}
            style={{ backgroundColor: props.selected ? colors.gray_200 : colors.white }}
            startIcon={<AddIcon />}
            onClick={() => props.onClick && props.onClick()}
        >
            <Typography>{props.text}</Typography>
        </Button>
    );
}

export const MenuButton: FunctionComponent<ButtonProps> = (props) => {
    const styles = useStyles();
    return (
        <Button
            variant="outlined"
            size="large"
            className={styles.addbutton}
            onClick={() => props.onClick && props.onClick()}
        >
            <Typography>{props.text}</Typography>
        </Button>
    );
}

const customPopperPlacement = function (props: any) {
    return (<Popper {...props} placement='top' />)
}
const filterOptions = createFilterOptions({ matchFrom: 'start' });

export const DropdownAutocomplete: FunctionComponent<AutocompleteProps> = (props) => {
    const styles = useStyles();
    const [options, setOptions] = useState(props.notesOrChords);
    const { selectedNoteKey, setSelectedNoteKey, noteIsSelected } = useContext(SongToolsContext);
    useEffect(() => {
        setOptions(props.notesOrChords);
    }, [props.notesOrChords]);
    const showValue = selectedNoteKey;
    if (!options.includes(selectedNoteKey)) {
        setSelectedNoteKey(options[0]);
    }
    const { t } = useTranslation();


    return (
        <Autocomplete
            value={
                showValue
            }
            filterOptions={filterOptions}
            onChange={(event, value: any) => {
                if (value !== null) {
                    setSelectedNoteKey(value as string);
                }
            }}
            openText={t("BottomBar:open")}
            PopperComponent={customPopperPlacement}
            options={options}
            closeIcon={false}
            className={styles.dropdown}
            noOptionsText={props.noOptionsText}
            renderInput={(params) => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps, className: styles.dropdown }} />}
            renderOption={(options) => (
                <React.Fragment>
                    <Grid container>
                        <Grid item xs={9}>
                            <Typography>{options}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {noteIsSelected ?
                                (<Box style={{ height: "24px", width: "24px", backgroundColor: getColor(options), borderRadius: "5px", verticalAlign: "center" }}>{tangentToNumber(options) !== 0 ? <Typography style={{ color: colors.white, textAlign: "center" }}>{tangentToNumber(options)}</Typography> : <></>}</Box>)
                                :
                                (<></>)
                            }
                        </Grid>
                    </Grid>
                </React.Fragment>)}
        />
    );
}

export default MenuButton;

const useStyles = makeStyles({

    button: {
        backgroundColor: colors.white,
        boxShadow: "0px 0px 0px rgba(255, 255, 255, 0)",
        margin: "auto",
    },
    addbutton: {
        backgroundColor: colors.white,
        border: "none",
        height: "56px",
        outline: "none",
    },
    dropdown: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "0px",
        },

    },

});
