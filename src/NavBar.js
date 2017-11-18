import React from 'react';

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
        <Button color="contrast">Bundesergebnisse</Button>
        <Button color="contrast">Wahlkreisübersicht</Button>
        <a href="http://www.google.de">
          <IconButton color="contrast" aria-label="Code">
            <Code />
          </IconButton>
        </a>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(NavBar);
