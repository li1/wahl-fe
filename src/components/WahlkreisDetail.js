import React, { Component } from "react";
import _ from "lodash";

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import Tabs, { Tab } from "material-ui/Tabs";

import SortableTable from "./SortableTable";

const vorjahrStyle = {
  "Vorjahresvergleich [in %]": {
    pos: { color: "#388E3C" },
    neg: { color: "#D32F2F" },
  },
};

class WahlkreisDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { erst: null, zweit: null, wahlkreisName: "", tab: 0 };
  }

  async componentWillReceiveProps(nextProps) {
    const { wahlkreis } = nextProps;

    if (wahlkreis) {
      const req = await fetch(
        "http://localhost:3000/wahlkreisdetails/2017/" + wahlkreis
      );
      const data = await req.json();

      console.log(data);

      const wahlkreisName = data[0].wahlkreis;

      const erst = _.map(data, row =>
        _.omit(row, [
          "wahlkreis",
          "zweitstimmen",
          "Zweitstimmenanteil [in %]",
          "Vorjahresvergleich [in %]",
        ])
      );
      _.forEach(
        erst,
        row =>
          (row["Erststimmenanteil [in %]"] = parseFloat(
            (row["Erststimmenanteil [in %]"] * 100).toFixed(2)
          ))
      );
      const zweit = _.map(data, row =>
        _.omit(row, [
          "direktkandidat",
          "wahlkreis",
          "erststimmen",
          "Erststimmenanteil [in %]",
        ])
      );
      _.forEach(
        zweit,
        row =>
          (row["Zweitstimmenanteil [in %]"] = parseFloat(
            (row["Zweitstimmenanteil [in %]"] * 100).toFixed(2)
          ))
      );
      _.forEach(
        zweit,
        row =>
          (row["Vorjahresvergleich [in %]"] = parseFloat(
            (row["Vorjahresvergleich [in %]"] * 100).toFixed(2)
          ))
      );

      this.setState({ erst, zweit, wahlkreisName });
    }
  }

  changeTab = (e, v) => this.setState({ tab: v });

  render() {
    const { close, wahlkreis, ...other } = this.props;
    const { erst, zweit, wahlkreisName, tab } = this.state;

    return (
      <Dialog onRequestClose={close} maxWidth={"lg"} fullWidth {...other}>
        <DialogTitle>
          Wahlkreisdetails
          <DialogContentText>{wahlkreisName}</DialogContentText>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Tabs
                value={tab}
                onChange={this.changeTab}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Direktkandidaten" />
                <Tab label="Parteiergebnisse" />
              </Tabs>
              {tab === 0 &&
                erst && (
                  <SortableTable orderBy={"erststimmen"} tableData={erst} />
                )}
              {tab === 1 &&
                zweit && (
                  <SortableTable
                    orderBy={"zweitstimmen"}
                    cellStyles={vorjahrStyle}
                    tableData={zweit}
                  />
                )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

export default WahlkreisDetail;
