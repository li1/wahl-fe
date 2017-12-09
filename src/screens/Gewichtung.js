import React, { Component } from "react";
import _ from "lodash";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Label
} from "recharts";

import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Tabs, { Tab } from "material-ui/Tabs";

import SortableTable from "../components/SortableTable";
import Spinner from "../components/Spinner";

const diffStyle = {
  "Veränderung [in %]": {
    pos: { color: "#388E3C" },
    neg: { color: "#D32F2F" }
  }
};

const AnteilPlot = ({ data }) => (
  <div>
    <Typography
      type="subheading"
      component="p"
      style={{ marginBottom: 12, minHeight: 48 }}>
      {data[0].name}
    </Typography>
    <ResponsiveContainer aspect={1.5}>
      <ScatterChart>
        <XAxis
          dataKey={"anteil"}
          type="number"
          name="Stimmanteil"
          unit="%"
          tickCount={3}>
          <Label value="Zweitstimmenanteil" position="insideTop" offset={20} />
        </XAxis>
        <YAxis
          dataKey={"falschwaehleranteil"}
          type="number"
          name="Falschwähleranteil"
          unit="%"
          tickCount={3}
          domain={[0, 2.2]}>
          <Label
            angle={270}
            position="left"
            style={{ textAnchor: "middle" }}
            offset={-5}>
            Falschwähleranteil
          </Label>
        </YAxis>
        <Scatter name={data[0].name} data={data} fill="#4696ec" />
      </ScatterChart>
    </ResponsiveContainer>
  </div>
);

class Gewichtung extends Component {
  constructor(props) {
    super(props);
    this.state = {
      umgewichtungPlot: null,
      selectItems: [],
      selectedItem: "",
      tab: 0
    };
  }

  async componentDidMount() {
    const umgewP = await fetch("http://localhost:3000/umgewichtungPlot");
    let umgewresP = await umgewP.json();

    umgewresP = umgewresP.sort((a, b) => (a.name > b.name ? 1 : -1));
    umgewresP.forEach(
      row => (row["anteil"] = parseFloat((row["anteil"] * 100).toFixed(4)))
    );
    umgewresP.forEach(
      row =>
        (row["falschwaehleranteil"] = parseFloat(
          (row["falschwaehleranteil"] * 100).toFixed(4)
        ))
    );

    const umgewichtungPlot = _.groupBy(umgewresP, "name");
    const selectItems = [
      "Alle (Achtung Performance)",
      ...Object.keys(umgewichtungPlot)
    ];

    const umgew = await fetch("http://localhost:3000/umgewichtung");
    let umgewichtung = await umgew.json();
    umgewichtung.forEach(
      row =>
        (row["Regulärer Zweitstimmenanteil [in %]"] = parseFloat(
          (row["Regulärer Zweitstimmenanteil [in %]"] * 100).toFixed(4)
        ))
    );
    umgewichtung.forEach(
      row =>
        (row["Gewichteter Zweitstimmenanteil [in %]"] = parseFloat(
          (row["Gewichteter Zweitstimmenanteil [in %]"] * 100).toFixed(4)
        ))
    );
    umgewichtung.forEach(
      row =>
        (row["Veränderung [in %]"] = parseFloat(
          (row["Veränderung [in %]"] * 100).toFixed(4)
        ))
    );

    this.setState({ umgewichtungPlot, selectItems, umgewichtung });
  }

  handleChange = e => {
    this.setState({ selectedItem: e.target.value });
  };

  changeTab = (e, v) => this.setState({ tab: v });

  render() {
    const {
      umgewichtungPlot,
      selectItems,
      selectedItem,
      tab,
      umgewichtung
    } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">
              Falschwählervergleich
            </Typography>
            <Typography component="p">
              Hier werden Wahlkreiszweitstimmenergebnisse mit und ohne
              Falschwählergewichtung verglichen. Sind manche Parteien besonders
              stark in Wahlkreisen, in denen es viele Wahlverweigerer gibt?
            </Typography>
          </Grid>
          <Grid item md={9} />

          <Grid item xs={12}>
            <Tabs
              value={tab}
              onChange={this.changeTab}
              indicatorColor="primary"
              textColor="primary"
              centered>
              <Tab label="Gewichtungsvergeleich" />
              <Tab label="Visualisierung" />
            </Tabs>
            {tab === 0 &&
              umgewichtung && (
                <SortableTable
                  tableData={umgewichtung}
                  cellStyles={diffStyle}
                />
              )}
            {tab === 1 && (
              <Paper
                style={{
                  paddingRight: 18,
                  paddingLeft: 18,
                  paddingTop: 6,
                  paddingBottom: 6
                }}>
                <Grid container>
                  <Grid item md={4} />
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="party-sel">
                        Wähle eine Partei aus
                      </InputLabel>
                      <Select
                        value={selectedItem}
                        onChange={this.handleChange}
                        input={<Input name="party" id="party-sel" />}>
                        {selectItems &&
                          selectItems.map((party, idx) => (
                            <MenuItem key={idx} value={party}>
                              {party}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} />

                  {selectedItem &&
                    selectedItem !== "Alle (Achtung Performance)" && (
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item md={4} />
                          <Grid item xs={12} md={4}>
                            <AnteilPlot data={umgewichtungPlot[selectedItem]} />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                  {selectedItem &&
                    selectedItem === "Alle (Achtung Performance)" &&
                    _.map(umgewichtungPlot, (dataObj, idx) => (
                      <Grid key={idx} item xs={12} md={3}>
                        <AnteilPlot data={dataObj} />
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Gewichtung;
