import React, { Component } from 'react';

import Spinner from "../components/Spinner";
import SitzverteilungChart from "../charts/SitzverteilungChart";
import SortableTable from "../components/SortableTable";
import { fullPartyName } from "../util";

import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';


class Bundestag extends Component {
  constructor (props) {
    super(props);
    this.state = { tableData: null,
                   filteredTableData: null,
                   selectedParty: null,
                   hoveredParty: null };
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

    setTimeout(() => {this.setState({tableData: tableData, filteredTableData: tableData})}, 1000);
  }

  onChartHover = data => this.setState({hoveredParty: data});
  onChartUnhover = () => this.setState({hoveredParty: null});

  onChartClick = (data, activeElementClicked) => {
    const { tableData } = this.state;

    const tableData2 = [{partei: "AfD", listenplatz: 1, vorname: "Maria", nachname: "Roger", geschlecht: "w"},
                      {partei: "AfD", listenplatz: 3, vorname: "Kurt", nachname: "Gödel", geschlecht: "m"},
                      {partei: "AfD", listenplatz: 2, vorname: "Günther", nachname: "Thiessen", geschlecht: "m"}];

    if(activeElementClicked) {
      //reset filter
      this.setState({selectedParty: null, filteredTableData: tableData});
    } else {
      //filter table
      this.setState({selectedParty: data, 
                     filteredTableData: tableData.filter(row => fullPartyName[row.partei] === data.partei)});
    }
  }

  calculateChartInfo = (selectedParty, hoveredParty) => {
    //-selectedParty, -hoveredParty
    let chartTitle = "Bundestag";
    let chartTitleColor = "#333";
    if (selectedParty) {
      //selectedParty, hoveredParty
      if (hoveredParty) {
        chartTitle = hoveredParty.partei;
        chartTitleColor = hoveredParty.fill;

      //selectedParty, -hoveredParty
      } else {
        chartTitle = selectedParty.partei;
        chartTitleColor = selectedParty.fill;
      }
    } else {
      //-selectedParty, hoveredParty
      if (hoveredParty) {
        chartTitle = hoveredParty.partei;
        chartTitleColor = hoveredParty.fill;
      }
    }

    return [chartTitle, chartTitleColor];
  }

  render () {
    const { filteredTableData, selectedParty, hoveredParty } = this.state;

    const [chartTitle, chartTitleColor] = this.calculateChartInfo(selectedParty, hoveredParty);

    return (
      <div>
        <Grid container spacing={ 24 }>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">Sitzverteilung</Typography>
            <Typography component="p">Dies ist die Sitzverteilung für 2017.</Typography>
            <Typography component="p">Klicke auf eine der Fraktionen, um zu filtern.</Typography>
          </Grid>
          <Grid item xs={12} md={6}>   
            <SitzverteilungChart onChartHover={ this.onChartHover } 
                                 onChartUnhover={ this.onChartUnhover }
                                 onChartClick={ this.onChartClick } />   
            <Typography type="title" component="h2" style={{textAlign:"center", marginTop: 12, color: chartTitleColor}}>
              {chartTitle}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            { filteredTableData === null && <Spinner /> }
            { filteredTableData !== null && filteredTableData.length !== 0 &&
              <SortableTable tableData={ filteredTableData } labelRowsPerPage="Kandidaten pro Seite"/>
            }
            { filteredTableData !== null && filteredTableData.length === 0 && 
              <div>Keine Kandidaten dieser Partei sind im Bundestag.</div> 
            }
          </Grid>
        </Grid>
      </div>
    )
  } 
}

export default Bundestag;
