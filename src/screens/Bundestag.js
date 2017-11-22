import React, { Component } from 'react';

import Spinner from "../components/Spinner";
import SitzverteilungChart from "../charts/SitzverteilungChart";
import SortableTable from "../components/SortableTable";

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';


class Bundestag extends Component {
  constructor (props) {
    super(props);
    this.state = { tableData: null };
  }

  async componentDidMount () {
    // const res = await fetch("http://localhost:3000/parteiergebnisse");
    // const tableData = await res.json();
    const tableData = [{partei: "CDU", listenplatz: 1, vorname: "Heinz", nachname: "Meier", geschlecht: "m"},
                      {partei: "CDU", listenplatz: 2, vorname: "Joseph", nachname: "Reiser", geschlecht: "m"},
                      {partei: "AfD", listenplatz: 1, vorname: "Maria", nachname: "Roger", geschlecht: "w"},
                      {partei: "SPD", listenplatz: 8, vorname: "Jana", nachname: "Torfbau", geschlecht: "w"},
                      {partei: "AfD", listenplatz: 3, vorname: "Kurt", nachname: "Gödel", geschlecht: "m"},
                      {partei: "AfD", listenplatz: 2, vorname: "Günther", nachname: "Thiessen", geschlecht: "m"},
                      {partei: "FDP", listenplatz: 1, vorname: "Ronald", nachname: "Hitze", geschlecht: "m"},
                      {partei: "SPD", listenplatz: 1, vorname: "Matthias", nachname: "Vogel", geschlecht: "m"}];

    this.setState({tableData: tableData});
  }

  render () {
    const { tableData } = this.state;

    return (
      <div>
        <Grid container spacing={ 24 }>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">Sitzverteilung</Typography>
            <Typography component="p">Dies ist die Sitzverteilung für 2017.</Typography>
            <Typography component="p">Klicke auf eine der Fraktionen, um zu filtern.</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <SitzverteilungChart />
          </Grid>
          <Grid item xs={12}>
            { tableData == null ? <Spinner /> :
              <SortableTable tableData={ tableData } labelRowsPerPage="Kandidaten pro Seite"/>
            }
          </Grid>
        </Grid>
      </div>
    )
  } 
}

export default Bundestag;
