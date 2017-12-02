import React, { Component } from 'react';
import _ from "lodash";

import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel} from 'material-ui/Form';
import List, { ListItem, ListItemText } from 'material-ui/List';

import ExampleChart from "../charts/ExampleChart";
import Germany from "../charts/Germany";
import WahlkreisDetail from "../components/WahlkreisDetail";
import SortableTable from "../components/SortableTable";
import { abbreviatePartyName, colorMapping } from "../util";

class Overview extends Component {
  constructor (props) {
    super(props);
    this.state = { selectedOption: "zweitstimmengewinner",
                   zweitstimmengewinner: null,
                   erststimmengewinner: null,
                   erststimmenFollower: null,
                   zweitstimmenFollower: null,
                   showWahlkreisDetails: false};
  }

  async componentDidMount () {
    const zsg = await fetch("http://localhost:3000/zweitstimmensieger");
    const zweitstimmengewinner = await zsg.json();
    const zsgPrepped = Object.assign(...zweitstimmengewinner.map(
      row => ({[row.land]: {color: colorMapping[abbreviatePartyName[row.partei]],
                            partei: row.partei}})
    ));
    this.setState({zweitstimmengewinner: zsgPrepped});

    const zsf = await fetch("http://localhost:3000/zweitstimmenFollower");
    const zweitstimmenFollower = await zsf.json();
    const zsfPrepped = Object.assign(...zweitstimmenFollower.map(
      row => ({[row.land]: {color: colorMapping[abbreviatePartyName[row.partei]],
                            partei: row.partei}})
    ));
    this.setState({zweitstimmenFollower: zsfPrepped});

    const esg = await fetch("http://localhost:3000/erststimmensieger");
    const erststimmengewinner = await esg.json();
    const esgPrepped = Object.assign(...erststimmengewinner.map(
      row => ({[row.land]: {color: colorMapping[abbreviatePartyName[row.partei]],
                            partei: row.partei}})
    ));
    this.setState({erststimmengewinner: esgPrepped});

    const esf = await fetch("http://localhost:3000/erststimmenFollower");
    const erststimmenFollower = await esf.json();
    const esfPrepped = Object.assign(...erststimmenFollower.map(
      row => ({[row.land]: {color: colorMapping[abbreviatePartyName[row.partei]],
                            partei: row.partei}})
    ));
    this.setState({erststimmenFollower: esfPrepped});
  }

  updateOption = (event, value) => this.setState({selectedOption: value});

  onWahlkreisSelect = (row) => {
    console.log(row);
    this.setState({showWahlkreisDetails: true});
  };

  createLegend = data => {
    if (data) {
      const unpreppedLegend = Object.values(data);
      return Object.assign(...unpreppedLegend.map(row => ({[row.partei]: row.color})));
    }
    return {};
  }

  render () {
    const { selectedOption, showWahlkreisDetails } = this.state;
    const legend = this.createLegend(this.state[selectedOption]);
    _.map(legend, (key, val) => (console.log(val, key)));

    return (
      <div>
        <WahlkreisDetail open={ showWahlkreisDetails }
                         onRequestClose={ () => this.setState({showWahlkreisDetails: false}) }/>

        <Grid container spacing={ 24 }>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">Übersichtskarte</Typography>
            <Typography component="p">Dies ist die Bundesländerübersicht für 2017.</Typography>
            <Typography component="p">Klicke auf ein Bundesland, um zu filtern.</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div style={{animation: "fadein 3s"}}>
              <Germany data={ this.state[selectedOption] || {} } />
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
                    <FormControlLabel value="zweitstimmengewinner" control={<Radio />} label="Zweitstimmen (Gewinner)" />
                    <FormControlLabel value="zweitstimmenFollower" control={<Radio />} label="Zweitstimmen (2. Platz)" />
                    <FormControlLabel value="erststimmengewinner" control={<Radio />} label="Erststimmen (Gewinner)" />
                    <FormControlLabel value="erststimmenFollower" control={<Radio />} label="Erststimmen (2. Platz)" />
                  </RadioGroup>
                </FormControl>

              </CardContent>
            </Card>

            <Card style={{marginTop: 30}}>
              <CardContent>
                <Typography type="headline" component="h2">Legende</Typography>

                <List>
                {_.map(legend, (color, partyName) => (
                  <ListItem style={{paddingLeft: 0, paddingRight: 0, marginBottom: 0}}>
                    <span style={{width: 20, height: 20, backgroundColor: color, marginRight: 12, borderRadius: "50%"}} />
                    <ListItemText inset primary={abbreviatePartyName[partyName]} style={{paddingLeft: 0}}/>
                  </ListItem>
                 ))}
                </List>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <SortableTable tableData={ [{wahlkreis: 1, name: "Gurke"},
                                        {wahlkreis: 2, name: "Gans"},
                                        {wahlkreis: 3, name: "Peter"},
                                        {wahlkreis: 4, name: "Großmünden"}] }
                           labelRowsPerPage="Wahlkreise pro Seite" 
                           selectHandler={ this.onWahlkreisSelect }/>
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
