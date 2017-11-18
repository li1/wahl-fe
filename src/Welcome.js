import React from 'react';
import _ from "lodash";

import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import ExampleChart from "./ExampleChart";
import SitzverteilungChart from "./SitzverteilungChart";
import WorldMap from "./WorldMap";

const styles = {
  container: {
    display: "flex", 
    // flexFlow: "row wrap", 
    justifyContent: "space-around", 
    // alignItems: "flex-start"
  },
}

function Welcome(props) {
  return (
    <div style={ styles.container }>
      <Grid container justify="center" spacing={ 24 }>

        <Grid item xs={12} sm={6}>
          <div style={ _.merge(styles.paper, {flex: 6}) }>
            <WorldMap />
          </div>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Grid container justify="center" spacing={ 16 }>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography type="headline" component="h2">Sitzverteilung</Typography>
                  <Typography component="p">Dies ist die Sitzverteilung für 2017.</Typography>
                  <SitzverteilungChart />
                </CardContent>
                <CardActions>
                  <Button dense color="primary">Detailanalyse</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography type="headline" component="h2">Some other info...</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <ExampleChart />
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
}

export default Welcome;
