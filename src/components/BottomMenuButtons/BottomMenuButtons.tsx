import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { TextField, Button, Popper } from '@material-ui/core';
import { colors } from '../../utils/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SongToolsContext } from '../../views/SongView/SongToolsContextProvider.component';


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

export const DropdownAutocomplete: FunctionComponent<AutocompleteProps> = (props) => {
    const styles = useStyles();
    const [options, setOptions] = useState(props.notesOrChords);
    const { selectedNoteKey, setSelectedNoteKey } = useContext(SongToolsContext);
    useEffect(() => {
        setOptions(props.notesOrChords);
    }, [props.notesOrChords]);
    const showValue = selectedNoteKey;
    if (!options.includes(selectedNoteKey)) {
        setSelectedNoteKey(options[0]);
    }

    return (
        <Autocomplete
            value={
                showValue
            }
            onChange={(event, newValue: string | null) => {
                if (newValue != null) {
                    setSelectedNoteKey(newValue);
                }
            }}
            PopperComponent={customPopperPlacement}
            options={options}
            closeIcon={false}
            className={styles.dropdown}
            noOptionsText={props.noOptionsText}
            renderInput={(params) => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps, className: styles.dropdown }} />}
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
