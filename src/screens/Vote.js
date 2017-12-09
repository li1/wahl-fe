import React, { Component } from "react";
import Paper from "material-ui/Paper";

import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import EnhancedTable from "../components/TableExample";

export class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = { tableData: [], tableDataParties: [] };
  }

  async componentDidMount() {
    const kandidaten = await fetch(
      "http://localhost:3000/wahlkreisdirektkandidaten/1"
    );
    const parteien = await fetch("http://localhost:3000/wahlkreisparteien/1");
    const tableDataParties = await parteien.json();
    const tableData = await kandidaten.json();
    this.setState({ tableData: tableData, tableDataParties: tableDataParties });
  }

  render() {
    const { tableData, tableDataParties } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} md={3}>
            <Typography type="headline" component="h2">
              Stimmzettel
            </Typography>
            <Typography component="p">
              Hier können Sie wählen. Sie haben zwei Stimmen.
            </Typography>
          </Grid>
          <Grid item md={9} />

          <Grid item xs={12} md={7}>
            {tableData !== undefined && (
              <EnhancedTable data={tableData} title="Erststimme" />
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper>
              <EnhancedTable data={tableDataParties} title="Zweitstimme" />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Vote;
