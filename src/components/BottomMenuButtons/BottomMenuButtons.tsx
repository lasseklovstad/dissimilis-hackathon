import React, { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Box, Card, CardActionArea, TextField } from '@material-ui/core';
import { colors } from '../../utils/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';


export type ButtonProps = {
    text: string,
    link: string,
    onClick?: () => void,
    color?: string,
};

export type AutocompleteProps = {
    text: any,
    onClick?: () => void,
    color?: string,
    tones: string[],
};
export type SelectProps = {

};


export const MenuButtonWithAddIcon: FunctionComponent<ButtonProps> = (props) => {
    const styles = useStyles();
    return (
        <Card className={styles.button}>
            <CardActionArea onClick={() => props.onClick && props.onClick()}  >
                <Box className={styles.container} py={2} pl={1}>
                    <AddIcon />
                    <Box pl={2} pr={2}><Typography>{props.text}</Typography></Box>
                </Box>
            </CardActionArea>
        </Card>
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
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
        margin: "auto"
    },
    dropdown: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "0px",
        }
    },

});
