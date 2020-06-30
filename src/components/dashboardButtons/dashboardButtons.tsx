import React,  { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

type ButtonProps = {
  text: string
}

export const DashboardButtonWithAddIcon: FunctionComponent<ButtonProps> = ({text}) => {
  const styles = useStyles();
  return (
    <div>
      <ThemeProvider theme={theme}>
      <Button size="medium" className={styles.button}>
        <AddIcon />
        <Typography>{text}</Typography>
      </Button>
      </ThemeProvider>
    </div>
  );
}

export function DashboardButton(text: string) {
  const styles = useStyles();
  console.log(styles)
  return (
    <div>
      <Button  className={styles.button}>
        <Typography>{text}</Typography>
      </Button>
    </div>
  );
}

export default DashboardButton;

const useStyles = makeStyles({
  button: {
    position: "absolute",
    width: "268px",
    height: "56px",
    backgroundColor: "#FFFFFF",
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
  }
});

const theme = createMuiTheme({      
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});
