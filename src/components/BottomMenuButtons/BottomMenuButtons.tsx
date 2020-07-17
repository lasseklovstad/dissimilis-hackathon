import React, { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { TextField, Button } from '@material-ui/core';
import { colors } from '../../utils/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';


export type AddButtonProps = {
    text: string,
    link?: string,
    onClick?: Function
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

export const DropdownAutocomplete: FunctionComponent<AutocompleteProps> = (props) => {
    const styles = useStyles();
    const [options, setOptions] = useState(props.notesOrChords);
    const [value, setValue] = useState<string>(options[0]);
    useEffect(() => {
        setOptions(props.notesOrChords);
    }, [props.notesOrChords]);
    return (
        <Autocomplete
            value={
                options.includes(value) ? value : options[0]
            }
            onChange={(event, newValue: string | null) => {
                if (newValue != null) {
                    setValue(newValue);
                }
            }}
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
