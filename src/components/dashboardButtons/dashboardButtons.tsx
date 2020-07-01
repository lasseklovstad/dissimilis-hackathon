import React,  { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Box, Card, CardActionArea } from '@material-ui/core';
import { findByLabelText } from '@testing-library/react';



type ButtonProps = {
  text: string,
  link: string
};

export const DashboardButtonWithAddIcon: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Card className={styles.button}>
          <CardActionArea to={link} component={Link}>
            <Box className={styles.container}>
              <Box p={2}><AddIcon /></Box>
              <Box p={2}><Typography>{text}</Typography></Box>
            </Box>
          </CardActionArea>
        </Card>
      </ThemeProvider>
    </Box>
  );
}

export const DashboardButton: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Card className={styles.button}>
          <CardActionArea to={link} component={Link}>
            <Box className={styles.container}>
              <Box p={2}><Typography>{text}</Typography></Box>
            </Box>
          </CardActionArea>
        </Card>
      </ThemeProvider>
    </Box>
  );
}

export const DashboardLibraryButton: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Card className={styles.button__green}>
          <CardActionArea to={link} component={Link}>
            <Box className={styles.container}>
              <Box p={2}><Typography>{text}</Typography></Box>
            </Box>
          </CardActionArea>
        </Card>
      </ThemeProvider>
    </Box>
  );
}

export default DashboardButton;

const useStyles = makeStyles({
  container: {
    display: "flex"
  },
  button: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  button__green: {
    width: "100%",
    backgroundColor: "#B2DFDB",
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  }
});

const theme = createMuiTheme({      
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});
