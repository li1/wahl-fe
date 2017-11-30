import React, { Component } from 'react';
import _ from "lodash";

import Spinner from "../components/Spinner";
import SitzverteilungChart from "../charts/SitzverteilungChart";
import SortableTable from "../components/SortableTable";
import { fullPartyName } from "../util";

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';



const ParteiergebnisseTable = ({parteiergebnisseData, gesamtsitze}) => {
  const getSitzPercentage = sitze => parseFloat((((sitze/gesamtsitze) * 100).toFixed(1)));

  if (parteiergebnisseData === null || parteiergebnisseData.length === 0) { //data still loading
    return <Spinner />;
  } else {
    //@TODO: percentages aren't sorted as numbers
    parteiergebnisseData.map(ergebnis => _.set(ergebnis, "Prozent (in %)", getSitzPercentage(ergebnis.sitze)));

    return (
      <SortableTable tableData={ parteiergebnisseData } showFooter={ false } />
    );
  }
}

const KandidatenTable = ({filteredTableData}) => {
  if (filteredTableData === null) { //tableData still loading
    return <Spinner />;
  } else {
    if (filteredTableData.length !== 0) { //tableData contains results
      return <SortableTable tableData={ filteredTableData } labelRowsPerPage="Kandidaten pro Seite"/>;
    } else { //tableData doesn't contain any rows
      return (
        <div style={{margin: "0 auto", textAlign: "center", marginTop: 12}}>
          Keine Kandidaten dieser Partei sind im Bundestag.
        </div> 
      );
    }
  }
}

class Bundestag extends Component {
  constructor (props) {
    super(props);
    this.state = { tab: 0,
                   chartData: null,
                   gesamtsitze: null,
                   tableData: null,
                   filteredTableData: null,
                   selectedParty: null,
                   hoveredParty: null };
  }

  async componentDidMount () {
    // const res = await fetch("http://localhost:3000/sitzplaetze");
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

    //fetch sitzverteilung
    const res = await fetch("http://localhost:3000/sitzverteilung");
    const chartData = await res.json();
    this.setState({chartData: chartData, gesamtsitze: chartData.reduce((acc, val) => (acc + val.sitze), 0)});
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

  changeTab = (e, v) => this.setState({tab: v});

  render () {
    const { filteredTableData, selectedParty, hoveredParty, tab, chartData, gesamtsitze } = this.state;
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
            <SitzverteilungChart chartData={ chartData }
                                 onChartHover={ this.onChartHover } 
                                 onChartUnhover={ this.onChartUnhover }
                                 onChartClick={ this.onChartClick } />   
            <Typography type="title" component="h2" style={{textAlign:"center", marginTop: 12, color: chartTitleColor}}>
              {chartTitle}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{marginBottom: 12}}>
              <Tabs
                value={this.state.tab}
                onChange={this.changeTab}
                indicatorColor="primary"
                textColor="primary"
                centered>
                <Tab label="Parteiergebnisse" />
                <Tab label="Mitglieder des Bundestags" />
              </Tabs>
            </Paper>
            {tab === 0 && <ParteiergebnisseTable parteiergebnisseData={ chartData } gesamtsitze={ gesamtsitze } /> }
            {tab === 1 && <KandidatenTable filteredTableData={ filteredTableData } /> }
          </Grid>
        </Grid>
      </div>
    )
  } 
}

export default Bundestag;
