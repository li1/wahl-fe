import React, { Component } from "react";
import _ from "lodash";

import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";

import SortableTable from "../components/SortableTable";

class CloseCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      knappsteData: null,
      filteredKnappsteWinners: null,
      filteredKnappsteLosers: null,
      selectItems: null,
      selectedParty: "",
    };
  }

  async componentDidMount() {
    const knappsteReq = await fetch("http://localhost:3000/knappste");
    const knappsteData = await knappsteReq.json();
    _.forEach(
      knappsteData,
      row =>
        (row["abstand [in %]"] = parseFloat(
          (row["abstand [in %]"] * 100).toFixed(4)
        ))
    );

    const selectItems = _.sortBy(_.uniq(knappsteData.map(row => row.partei)));

    this.setState({ knappsteData, selectItems });
  }

  handleChange = e => {
    const { knappsteData } = this.state;

    const winners = _.filter(knappsteData, row => row.gewinner);
    const losers = _.filter(knappsteData, row => !row.gewinner);

    const omit = ["partei", "gewinner", "legislaturperiodeid"];
    const filteredKnappsteWinners = _.map(
      _.filter(winners, row => row.partei === e.target.value),
      row => _.omit(row, omit)
    );
    const filteredKnappsteLosers = _.map(
      _.filter(losers, row => row.partei === e.target.value),
      row => _.omit(row, omit)
    );

    this.setState({
      selectedParty: e.target.value,
      filteredKnappsteWinners,
      filteredKnappsteLosers,
    });
  };

  render() {
    const {
      filteredKnappsteWinners,
      filteredKnappsteLosers,
      selectItems,
      selectedParty,
    } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">
              Close Call
            </Typography>
            <Typography component="p">
              Hier werden die knappsten Sieger und Verlierer der Wahl
              vorgestellt. Wähle eine Partei aus, um die jeweiligen Tops und
              Flops anzuzeigen.
            </Typography>
          </Grid>
          <Grid item md={9} />

          <Grid item md={4} />
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="party-sel">Wähle eine Partei aus</InputLabel>
              <Select
                value={selectedParty}
                onChange={this.handleChange}
                input={<Input name="party" id="party-sel" />}
              >
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

          <Grid item md={2} />
          {selectedParty !== "" && (
            <Grid item xs={12} md={8} style={{ marginTop: 30 }}>
              {filteredKnappsteWinners &&
                filteredKnappsteWinners.length !== 0 && (
                  <div>
                    <Typography
                      type="title"
                      style={{ marginBottom: 18 }}
                      component="h2"
                    >
                      Knappste{" "}
                      <span style={{ color: "#388E3C" }}>Gewinner</span> aus der{" "}
                      {selectedParty}
                    </Typography>
                    <SortableTable
                      style={{ marginBottom: 30 }}
                      tableData={filteredKnappsteWinners}
                      showFooter={false}
                    />
                  </div>
                )}
              {filteredKnappsteLosers &&
                filteredKnappsteLosers.length !== 0 && (
                  <div>
                    <Typography
                      type="title"
                      style={{ marginBottom: 18 }}
                      component="h2"
                    >
                      Knappste{" "}
                      <span style={{ color: "#D32F2F" }}>Verlierer</span> aus
                      der {selectedParty}
                    </Typography>
                    <SortableTable
                      tableData={filteredKnappsteLosers}
                      showFooter={false}
                    />
                  </div>
                )}
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default CloseCall;
