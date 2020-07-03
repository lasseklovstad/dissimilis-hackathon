import React,  { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Box, Card, CardActionArea } from '@material-ui/core';
import { colors } from '../../utils/colors';
import { ReactComponent as ButterflyIcon } from '../../assets/images/butterflyBlue.svg';

type ButtonProps = {
  text: string,
  link: string
};

export const DashboardButtonWithAddIcon: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <Card className={styles.button}>
        <CardActionArea to={link} component={Link}>
          <Box className={styles.container}>
            <Box p={2}><AddIcon /></Box>
            <Box p={2}><Typography>{text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export const DashboardButton: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <Card className={styles.button}>
        <CardActionArea to={link} component={Link}>
          <Box className={styles.container}>
            <Box p={2}><Typography>{text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export const DashboardLibraryButton: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <Card className={styles.button__green}>
        <CardActionArea to={link} component={Link}>
          <Box className={styles.container}>
            <Box p={2}><Typography>{text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export const DashboardTopBarIcon = () => {
  const styles = useStyles();
  return (
    <Box className={styles.butterflyIcon}>
      <Card className={styles.butterflyIcon}>
        <CardActionArea to='/' component={Link}>
          <ButterflyIcon ></ButterflyIcon>
          
        </CardActionArea>
      </Card>
    </Box>
  );
}

export default DashboardButton;

const useStyles = makeStyles({
  container: {
    display: "flex"
  },
  button: {
    backgroundColor: colors.white,
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  button__green: {
    backgroundColor: colors.teal_100,
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  butterflyIcon: {
    widht: '48px',
    height: '48px',
    backgroundColor: 'blue'
  }
});
