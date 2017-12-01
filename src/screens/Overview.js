import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel} from 'material-ui/Form';

import ExampleChart from "../charts/ExampleChart";
import Germany from "../charts/Germany";
import { abbreviatePartyName, colorMapping } from "../util";

class Overview extends Component {
  constructor (props) {
    super(props);
    this.state = { selectedOption: "zweitstimmengewinner",
                   zweitstimmengewinner: {}};
  }

  async componentDidMount () {
    const zsg = await fetch("http://localhost:3000/zweitstimmensieger");
    const zweitstimmengewinner = await zsg.json();
    // const zweitstimmengewinner = [{"land": "Hessen", "partei": "Sozialdemokratische Partei Deutschlands"},
    //                               {"land": "Saarland", "partei": "Freie Demokratische Partei"},
    //                               {"land": "Niedersachsen", "partei": "Sozialdemokratische Partei Deutschlands"},
    //                               {"land": "Bayern", "partei": "DIE LINKE"}];
    const zsgPrepped = Object.assign(...zweitstimmengewinner.map(
      row => ({[row.land]: colorMapping[abbreviatePartyName[row.partei]]})
    ));
    this.setState({zweitstimmengewinner: zsgPrepped});

    const erststimmengewinner = [{"land": "Bayern", "partei": "BÜNDNIS 90/DIE GRÜNEN"},
                                 {"land": "Rheinland-Pfalz", "partei": "BÜNDNIS 90/DIE GRÜNEN"},
                                 {"land": "Berlin", "partei": "BÜNDNIS 90/DIE GRÜNEN"}];
    const esgPrepped = Object.assign(...erststimmengewinner.map(
      row => ({[row.land]: colorMapping[abbreviatePartyName[row.partei]]})
    ));
    setTimeout(() => (this.setState({erststimmengewinner: esgPrepped})), 50);
  }

  updateOption = (event, value) => this.setState({selectedOption: value});

  render () {
    const { selectedOption } = this.state;

    return (
      <div>
            <Grid container spacing={ 24 }>
              <Grid item xs={12} md={3}>
                <Typography type="headline" component="h2">Übersichtskarte</Typography>
                <Typography component="p">Dies ist die Bundesländerübersicht für 2017.</Typography>
                <Typography component="p">Klicke auf ein Bundesland, um zu filtern.</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div style={{animation: "fadein 3s"}}>
                  <Germany colorMap={ this.state[selectedOption] } />
                </div>
              </Grid>

              <Grid item xs={12} lg={3}>
                <Card>
                  <CardContent>
                    <Typography type="headline" component="h2">Optionen</Typography>
                    <Typography component="p" style={{marginBottom: 24}}>
                      Färbe die Karte mit den Optionen ein.
                    </Typography>

                    <FormControl component="fieldset" required>
                      <RadioGroup
                        aria-label="Optionen"
                        name="option"
                        value={selectedOption}
                        onChange={this.updateOption}>
                        <FormControlLabel value="zweitstimmengewinner" control={<Radio />} label="Zweitstimmengewinner" />
                        <FormControlLabel value="erststimmengewinner" control={<Radio />} label="Erststimmengewinner" />
                      </RadioGroup>
                    </FormControl>

                  </CardContent>
                  { /*
                  <CardActions>
                    <Button dense color="primary">Detailanalyse</Button>
                  </CardActions> */}
                </Card>
              </Grid>

              {/*
              <Grid item xs={12}>
                <Paper>
                  <ExampleChart />
                </Paper>
              </Grid> */}

            </Grid>
      </div> 
    )
  }
}

export default Overview;
