import React, { FunctionComponent } from 'react';
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
    onClick?: Function,
    selected?: boolean

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
            style={{ backgroundColor: props.selected ? colors.gray_300 : colors.white}}
        >
            <Typography>{props.text}</Typography>
        </Button>
    );
}

export const DropdownAutocomplete: FunctionComponent<AutocompleteProps> = (props) => {
    const styles = useStyles();
    return (
        <Autocomplete className={styles.dropdown}
            options={props.notesOrChords}
            value={props.notesOrChords[0]}
            closeIcon={false}
            noOptionsText={props.noOptionsText}
            renderInput={(params) => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps, className: styles.dropdown }} />}
        />
    );
}

export default MenuButton;

const useStyles = makeStyles({
    container: {
        display: "flex",
        margin: "auto",
    },
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
