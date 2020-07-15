import React, { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Box, Card, CardActionArea, TextField, Button } from '@material-ui/core';
import { colors } from '../../utils/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';


export type AddButtonProps = {
    text: string,
    link: string,
    onClick?: () => void,
};
export type ButtonProps = {
    text: string,
    link: string,
    onClick?: () => void,
    color?: string,
};
export type AutocompleteProps = {
    icon: React.ReactNode,
    tones: string[],
};


export const MenuButtonWithAddIcon: FunctionComponent<AddButtonProps> = (props) => {
    const styles = useStyles();
    return (
        <Button
            variant="outlined"
            size="large"
            className={styles.addbutton}
            startIcon={<AddIcon />}
        >
            <Typography>{props.text}</Typography>
        </Button>
    );
}

export const MenuButton: FunctionComponent<ButtonProps> = (props) => {
    const styles = useStyles();
    return (
        <Card className={styles.button}>
            <CardActionArea to={props.link} component={Link}>
                <Box className={styles.container} style={{ backgroundColor: props.color }}>
                    <Box p={2}><Typography>{props.text}</Typography></Box>
                </Box>
            </CardActionArea>
        </Card>
    );
}

export const DropdownAutocomplete: FunctionComponent<AutocompleteProps> = (props) => {
    const styles = useStyles();
    return (
        <Autocomplete className={styles.dropdown}
            options={props.tones}
            defaultValue={props.tones[0]}
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
