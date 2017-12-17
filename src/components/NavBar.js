import React, { Component } from "react";

import { Link } from "react-router-dom";

import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Code from "material-ui-icons/Code";
import Switch from 'material-ui/Switch';
import grey from 'material-ui/colors/grey';

const styles = theme => ({
  toolbar: {
    backgroundColor: theme.palette.shades.light.appbar
  },
  bar: {},
  checked: {
    color: grey[200],
    '& + $bar': {
      backgroundColor: grey[200],
    },
  },
});

class NavBar extends Component {
  render () {
    const { classes, title, useEinzel, use2013, switch2013, switchEinzel, activate2013Switch } = this.props;

    return (
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <Typography type="title" color="inherit" style={{ flex: 1 }}>
            {title}
          </Typography>
          <Link to="/">
            <Button color="contrast">Bundestag</Button>
          </Link>
          <Link to="/overview">
            <Button color="contrast">Wahlkreisübersicht</Button>
          </Link>
          <Link to="/analysis">
            <Button color="contrast">Analysen</Button>
          </Link>
          <Link to="/vote">
            <Button color="contrast">Abstimmen!</Button>
          </Link>
          <Switch
             classes={{
               checked: classes.checked,
               bar: classes.bar,
             }}
             checked={useEinzel}
             onChange={(e, checked) => { switchEinzel() }}
             aria-label="useEinzel"
          />
          <Typography color="inherit">Auf Einzelstimmen</Typography>
          <Switch
             classes={{
               checked: classes.checked,
               bar: classes.bar,
             }}
             disabled={!activate2013Switch}
             checked={use2013}
             onChange={(e, checked) => { switch2013() }}
             aria-label="use2013"
          />
          <Typography color="inherit">Auf 2013-Daten</Typography>
        </Toolbar>
      </AppBar>
    );
  }
};

export default withStyles(styles)(NavBar);
