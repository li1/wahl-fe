import React from 'react';

import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import NavBar from "../components/NavBar";
import ExampleChart from "../charts/ExampleChart";
import SitzverteilungChart from "../charts/SitzverteilungChart";
import Germany from "../charts/Germany";

function Overview(props) {
  return (
    <div>
      <NavBar title = "Übersicht"/>
      <div style= {{marginTop: 90, marginLeft: 24, marginRight: 24}}>
          <Grid container justify="center" spacing={ 24 }>

            <Grid item xs={12} sm={6}>
              <Germany />
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
    </div>
  );
}

export default Overview;
