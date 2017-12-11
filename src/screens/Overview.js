import React, { Component } from "react";
import _ from "lodash";

import Paper from "material-ui/Paper";
import Card, { CardContent } from "material-ui/Card";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormControl, FormControlLabel } from "material-ui/Form";
import List, { ListItem, ListItemText } from "material-ui/List";
import Tabs, { Tab } from "material-ui/Tabs";

import Germany from "../charts/Germany";
import WahlkreisDetail from "../components/WahlkreisDetail";
import SortableTable from "../components/SortableTable";
import Spinner from "../components/Spinner";
import { abbreviatePartyName, colorMapping } from "../util";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      selectedOption: "zweitstimmengewinner",
      zweitstimmengewinner: null,
      erststimmengewinner: null,
      erststimmenFollower: null,
      zweitstimmenFollower: null,
      showWahlkreisDetailsWithWahlkreis: false,
      wahlkreisData: [],
      filteredWahlkreisData: [],
      tableTitle: "Gesamtdeutschland",
      ueberhangData: [],
      filteredUeberhangData: []
    };
  }

  async componentDidMount() {
    const zsg = await fetch("http://localhost:3000/bundeslanderg/zweit/sieger");
    const zweitstimmengewinner = await zsg.json();
    const zsgPrepped = Object.assign(
      ...zweitstimmengewinner.map(row => ({
        [row.land]: {
          color: colorMapping[abbreviatePartyName[row.partei]],
          partei: row.partei
        }
      }))
    );
    this.setState({ zweitstimmengewinner: zsgPrepped });

    const zsf = await fetch(
      "http://localhost:3000/bundeslanderg/zweit/zweiter"
    );
    const zweitstimmenFollower = await zsf.json();
    const zsfPrepped = Object.assign(
      ...zweitstimmenFollower.map(row => ({
        [row.land]: {
          color: colorMapping[abbreviatePartyName[row.partei]],
          partei: row.partei
        }
      }))
    );
    this.setState({ zweitstimmenFollower: zsfPrepped });

    const esg = await fetch("http://localhost:3000/bundeslanderg/erst/sieger");
    const erststimmengewinner = await esg.json();
    const esgPrepped = Object.assign(
      ...erststimmengewinner.map(row => ({
        [row.land]: {
          color: colorMapping[abbreviatePartyName[row.partei]],
          partei: row.partei
        }
      }))
    );
    this.setState({ erststimmengewinner: esgPrepped });

    const esf = await fetch("http://localhost:3000/bundeslanderg/erst/zweiter");
    const erststimmenFollower = await esf.json();
    const esfPrepped = Object.assign(
      ...erststimmenFollower.map(row => ({
        [row.land]: {
          color: colorMapping[abbreviatePartyName[row.partei]],
          partei: row.partei
        }
      }))
    );
    this.setState({ erststimmenFollower: esfPrepped });

    const wahlkreisRequest = await fetch(
      "http://localhost:3000/wahlkreisuebersicht/2017"
    );
    const wahlkreisData = await wahlkreisRequest.json();
    wahlkreisData.forEach(
      row =>
        (row["Direktkandidat-Partei"] =
          abbreviatePartyName[row["Direktkandidat-Partei"]])
    );
    wahlkreisData.forEach(
      row => (row["Siegerpartei"] = abbreviatePartyName[row["Siegerpartei"]])
    );
    wahlkreisData.forEach(
      row =>
        (row["Wahlbeteiligung [in %]"] = parseFloat(
          (row["Wahlbeteiligung [in %]"] * 100).toFixed(2)
        ))
    );
    this.setState({ wahlkreisData, filteredWahlkreisData: wahlkreisData });

    const ueberhangRequest = await fetch(
      "http://localhost:3000/ueberhangmandate/2017"
    );
    const ueberhangData = await ueberhangRequest.json();
    this.setState({ ueberhangData, filteredUeberhangData: ueberhangData });
  }

  updateOption = (event, value) => this.setState({ selectedOption: value });

  onWahlkreisSelect = row =>
    this.setState({ showWahlkreisDetailsWithWahlkreis: row.wahlkreis });

  createLegend = data => {
    if (data) {
      const unpreppedLegend = Object.values(data);
      return Object.assign(
        ...unpreppedLegend.map(row => ({ [row.partei]: row.color }))
      );
    }
    return {};
  };

  filterTables = land => {
    const { tableTitle, wahlkreisData, ueberhangData } = this.state;

    if (tableTitle === land) {
      this.setState({
        filteredWahlkreisData: wahlkreisData,
        filteredUeberhangData: ueberhangData,
        tableTitle: "Gesamtdeutschland"
      });
    } else {
      this.setState({
        filteredWahlkreisData: wahlkreisData.filter(
          row => row.bundesland === land
        ),
        filteredUeberhangData: ueberhangData.filter(
          row => row.bundesland === land
        ),
        tableTitle: land
      });
    }
  };

  changeTab = (e, v) => this.setState({ tab: v });

  render() {
    const {
      selectedOption,
      showWahlkreisDetailsWithWahlkreis,
      filteredWahlkreisData,
      tableTitle,
      filteredUeberhangData,
      tab
    } = this.state;
    const legend = this.createLegend(this.state[selectedOption]);

    return (
      <div>
        <WahlkreisDetail
          open={showWahlkreisDetailsWithWahlkreis && true}
          wahlkreis={showWahlkreisDetailsWithWahlkreis}
          onRequestClose={() =>
            this.setState({ showWahlkreisDetailsWithWahlkreis: false })
          }
        />

        <Grid container spacing={24}>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">
              Übersichtskarte
            </Typography>
            <Typography component="p">
              Dies ist die Bundesländerübersicht für 2017.
            </Typography>
            <Typography component="p">
              Klicke auf ein Bundesland, um die Tabellen zu filtern.
            </Typography>
            <Typography component="p">
              Klicke auf einen Wahlkreis, um Details zu sehen.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            {this.state[selectedOption] ? (
              <div>
                <div style={{ animation: "fadein 3s" }}>
                  <Germany
                    data={this.state[selectedOption] || {}}
                    onClickHandler={this.filterTables}
                  />
                </div>
                <Typography
                  type="title"
                  component="h2"
                  style={{ textAlign: "center", marginTop: 12 }}>
                  {tableTitle}
                </Typography>
              </div>
            ) : (
              <Spinner />
            )}
          </Grid>

          <Grid item xs={12} lg={3}>
            <Card>
              <CardContent>
                <Typography type="headline" component="h2">
                  Optionen
                </Typography>
                <Typography component="p" style={{ marginBottom: 24 }}>
                  Färbe die Karte mit den Optionen ein.
                </Typography>

                <FormControl component="fieldset" required>
                  <RadioGroup
                    aria-label="Optionen"
                    name="option"
                    value={selectedOption}
                    onChange={this.updateOption}>
                    <FormControlLabel
                      value="zweitstimmengewinner"
                      control={<Radio />}
                      label="Zweitstimmen (Gewinner)"
                    />
                    <FormControlLabel
                      value="zweitstimmenFollower"
                      control={<Radio />}
                      label="Zweitstimmen (2. Platz)"
                    />
                    <FormControlLabel
                      value="erststimmengewinner"
                      control={<Radio />}
                      label="Erststimmen (Gewinner)"
                    />
                    <FormControlLabel
                      value="erststimmenFollower"
                      control={<Radio />}
                      label="Erststimmen (2. Platz)"
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            <Card style={{ marginTop: 30 }}>
              <CardContent>
                <Typography type="headline" component="h2">
                  Legende
                </Typography>

                <List>
                  {_.map(legend, (color, partyName) => (
                    <ListItem
                      key={partyName}
                      style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                        marginBottom: 0
                      }}>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          marginRight: 12,
                          borderRadius: "50%"
                        }}
                      />
                      <ListItemText
                        inset
                        primary={abbreviatePartyName[partyName]}
                        style={{ paddingLeft: 0 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper style={{ marginBottom: 12 }}>
              <Tabs
                value={tab}
                onChange={this.changeTab}
                indicatorColor="primary"
                textColor="primary"
                centered>
                <Tab label="Wahlkreisdetails" />
                <Tab label="Überhangmandate" />
              </Tabs>
            </Paper>
            {tab === 0 && (
              <SortableTable
                tableData={filteredWahlkreisData}
                labelRowsPerPage="Wahlkreise pro Seite"
                selectHandler={this.onWahlkreisSelect}
              />
            )}
            {tab === 1 && <SortableTable tableData={filteredUeberhangData} />}
          </Grid>
          {/*
          <Grid item xs={12}>
            <Paper>
              <ExampleChart />
            </Paper>
          </Grid> */}
        </Grid>
      </div>
    );
  }
}

export default Overview;
