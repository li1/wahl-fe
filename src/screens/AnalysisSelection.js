import React, { Component } from "react";

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

class AnalysisSelection extends Component {

  render () {
    return (
      <div style={{margin: 180}}>
        <Grid container spacing={ 24 }>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography type="headline" component="h2">Close Call</Typography>
                <Typography component="p">
                  Hier werden die knappsten Sieger und Verlierer der Wahl vorgestellt. 
                  Wähle eine Partei aus, um die jeweiligen Tops und Flops anzuzeigen.</Typography>
              </CardContent>
              <CardActions>
                <a href="/closecall">
                  <Button dense color="primary">
                     Analyse ansehen
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography type="headline" component="h2">Falschwählervergleich</Typography>
                <Typography component="p">
                  Sind manche Parteien besonders stark in Wahlkreisen, in denen es viele Wahlverweigerer gibt?
                </Typography>
              </CardContent>
              <CardActions>
                <a href="/umgewichtung">
                  <Button dense color="primary">
                     Analyse ansehen
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography type="headline" component="h2">Demographie</Typography>
                <Typography component="p">
                  Hier werden Altersgruppen und Geschlechter der Bundestagsabgeordneten zusammengefasst.</Typography>
              </CardContent>
              <CardActions>
                <a href="/demographie">
                  <Button dense color="primary">
                     Analyse ansehen
                  </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default AnalysisSelection
