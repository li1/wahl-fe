import React, { Component } from "react";
import _ from "lodash";

import Spinner from "../components/Spinner";
import SitzverteilungChart from "../charts/SitzverteilungChart";
import SortableTable from "../components/SortableTable";
import { abbreviatePartyName, expandPartyName } from "../util";

import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Tabs, { Tab } from "material-ui/Tabs";

const ParteiergebnisseTable = ({
  parteiergebnisseData,
  gesamtsitze,
  parentThis,
}) => {
  const getSitzPercentage = sitze =>
    parseFloat((sitze / gesamtsitze * 100).toFixed(1));

  if (parteiergebnisseData === null || parteiergebnisseData.length === 0) {
    //data still loading
    return <Spinner />;
  } else {
    parteiergebnisseData.map(ergebnis =>
      _.set(ergebnis, "%", getSitzPercentage(ergebnis.sitze))
    );

    return (
      <SortableTable
        tableData={parteiergebnisseData}
        showFooter={false}
        orderBy="%"
      />
    );
  }
};

const KandidatenTable = ({ filteredTableData }) => {
  if (filteredTableData === null) {
    //tableData still loading
    return <Spinner />;
  } else {
    if (filteredTableData.length !== 0) {
      //tableData contains results
      return (
        <SortableTable
          tableData={filteredTableData}
          labelRowsPerPage="Kandidaten pro Seite"
        />
      );
    } else {
      //tableData doesn't contain any rows
      return (
        <div style={{ margin: "0 auto", textAlign: "center", marginTop: 12 }}>
          Keine Kandidaten dieser Partei sind im Bundestag.
        </div>
      );
    }
  }
};

class Bundestag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      chartData: null,
      gesamtsitze: null,
      tableData: null,
      filteredTableData: null,
      selectedParty: null,
      hoveredParty: null,
    };
  }

  async componentDidMount() {
    const bundestagsmitglieder = await fetch(
      "http://localhost:3000/bundestagsmitglieder"
    );
    const tableData = await bundestagsmitglieder.json();
    tableData.map(row => (row.partei = abbreviatePartyName[row.partei]));
    this.setState({ tableData: tableData, filteredTableData: tableData });

    //fetch sitzverteilung
    const res = await fetch("http://localhost:3000/sitzverteilung");
    const chartData = await res.json();
    chartData.map(row => (row.partei = abbreviatePartyName[row.partei]));
    this.setState({
      chartData: chartData,
      gesamtsitze: chartData.reduce((acc, val) => acc + val.sitze, 0),
    });
  }

  onChartHover = data => this.setState({ hoveredParty: data });
  onChartUnhover = () => this.setState({ hoveredParty: null });

  onChartClick = (data, activeElementClicked) => {
    const { tableData } = this.state;

    if (activeElementClicked) {
      //reset filter
      this.setState({ selectedParty: null, filteredTableData: tableData });
    } else {
      //filter table
      this.setState({
        selectedParty: data,
        filteredTableData: tableData.filter(row => row.partei === data.partei),
      });
    }
  };

  calculateChartInfo = (selectedParty, hoveredParty) => {
    //-selectedParty, -hoveredParty
    let chartTitle = "Bundestag";
    let chartTitleColor = "#333";
    if (selectedParty) {
      //selectedParty, hoveredParty
      if (hoveredParty) {
        chartTitle = expandPartyName[hoveredParty.partei];
        chartTitleColor = hoveredParty.fill;

        //selectedParty, -hoveredParty
      } else {
        chartTitle = expandPartyName[selectedParty.partei];
        chartTitleColor = selectedParty.fill;
      }
    } else {
      //-selectedParty, hoveredParty
      if (hoveredParty) {
        chartTitle = expandPartyName[hoveredParty.partei];
        chartTitleColor = hoveredParty.fill;
      }
    }

    return [chartTitle, chartTitleColor];
  };

  changeTab = (e, v) => this.setState({ tab: v });

  render() {
    const {
      filteredTableData,
      selectedParty,
      hoveredParty,
      tab,
      chartData,
      gesamtsitze,
    } = this.state;
    const [chartTitle, chartTitleColor] = this.calculateChartInfo(
      selectedParty,
      hoveredParty
    );

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">
              Sitzverteilung
            </Typography>
            <Typography component="p">
              Dies ist die Sitzverteilung für 2017.
            </Typography>
            <Typography component="p">
              Klicke auf eine Fraktionen, um die Tabellen zu filtern.
            </Typography>
            <Typography component="p">
              Klicke auf ein Parteiergebnis, um Details anzuzeigen.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <SitzverteilungChart
              chartData={chartData}
              onChartHover={this.onChartHover}
              onChartUnhover={this.onChartUnhover}
              onChartClick={this.onChartClick}
            />
            <Typography
              type="title"
              component="h2"
              style={{
                textAlign: "center",
                marginTop: 12,
                color: chartTitleColor,
              }}
            >
              {chartTitle}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ marginBottom: 12 }}>
              <Tabs
                value={tab}
                onChange={this.changeTab}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Mitglieder des Bundestags" />
                <Tab label="Parteiergebnisse" />
              </Tabs>
            </Paper>
            {tab === 0 && (
              <KandidatenTable filteredTableData={filteredTableData} />
            )}
            {tab === 1 && (
              <ParteiergebnisseTable
                parteiergebnisseData={chartData}
                gesamtsitze={gesamtsitze}
                parentThis={this}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Bundestag;
