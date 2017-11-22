import React from 'react';

import { Link } from "react-router-dom"

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Code from "material-ui-icons/Code";

const styles = theme => ({
  toolbar: {
    backgroundColor: theme.palette.shades.light.appbar
  },
});

const NavBar = (props) => {
  const { classes, title } = props;

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Typography type="title" color="inherit" style={ {flex: 1} }>
          {title}
        </Typography>
        <Button color="contrast"><Link to="/">Bundestag</Link></Button>
        <Button color="contrast"><Link to="/overview">Wahlkreisübersicht</Link></Button>
        <Button color="contrast"><Link to="/analysis">Analysen</Link></Button>
        <Button color="contrast"><Link to="/vote">Abstimmen!</Link></Button>
        <a href="https://github.com/Christoph-Maximilian/DBS-Group4">
          <IconButton color="contrast" aria-label="Code">
            <Code />
          </IconButton>
        </a>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(NavBar);
