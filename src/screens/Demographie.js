import React, { Component } from "react";
import _ from "lodash";

import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import { abbreviatePartyName } from "../util";
import Spinner from "../components/Spinner";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  BarChart,
  Bar,
  Pie
} from "recharts";

const colors = {
  "< 30": "#8884d8",
  "31-40": "#83a6ed",
  "41-50": "#8dd1e1",
  "51-60": "#82ca9d",
  "61-70": "#a4de6c",
  "> 70": "#d0ed57"
};

const quoteColors = {
  Männeranteil: "rgba(128,203,196 ,1)",
  Frauenanteil: "rgba(236,64,122 ,1)"
};

const GenderAll = ({ data }) => (
  <Paper
    style={{
      paddingRight: 12,
      paddingLeft: 12,
      paddingTop: 12,
      paddingBottom: 12
    }}>
    <Typography
      type="title"
      component="p"
      style={{ marginBottom: 12, minHeight: 48 }}>
      Geschlechterverteilung im Bundestag (allgemein)
    </Typography>
    <ResponsiveContainer aspect={1}>
      <PieChart>
        <Pie label data={data} innerRadius="20%" dataKey="anteil" />
        <Legend
          iconSize={15}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  </Paper>
);

// const RotatedTick = ({x, y, stroke, payload}) => (
//   <g transform={`translate(${x},${y})`}>
//     <text x={0} y={0} dy={16} textAnchor="end" fill="666" transform="rotate(-35)">
//       {payload.value}
//     </text>
//   </g>
// )

const GenderParty = ({ data }) => (
  <Paper
    style={{
      paddingRight: 12,
      paddingLeft: 12,
      paddingTop: 12,
      paddingBottom: 12
    }}>
    <Typography
      type="title"
      component="p"
      style={{ marginBottom: 12, minHeight: 48 }}>
      Geschlechterverteilung im Bundestag (pro Partei)
    </Typography>
    <ResponsiveContainer aspect={2.5}>
      <BarChart data={data} margin={{ bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="partei" interval={0} />
        <YAxis unit="%" />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        <Bar dataKey="Männeranteil" fill="rgba(128,203,196 ,1)" />
        <Bar dataKey="Frauenanteil" fill="rgba(236,64,122 ,1)" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const DemographieAll = ({ data }) => {
  return (
    <Paper
      style={{
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 12,
        paddingBottom: 12
      }}>
      <Typography
        type="title"
        component="p"
        style={{ marginBottom: 12, minHeight: 48 }}>
        Demographie im Bundestag (allgemein)
      </Typography>
      <ResponsiveContainer aspect={1}>
        <PieChart>
          <Pie label data={data} innerRadius="20%" dataKey="anteil" />
          <Legend
            iconSize={15}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const DemographieParty = ({ data }) => (
  <Paper
    style={{
      paddingRight: 12,
      paddingLeft: 12,
      paddingTop: 12,
      paddingBottom: 12
    }}>
    <Typography
      type="title"
      component="p"
      style={{ marginBottom: 12, minHeight: 48 }}>
      Demographie im Bundestag (pro Partei)
    </Typography>
    <ResponsiveContainer aspect={2.5}>
      <BarChart data={data} margin={{ bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="partei" interval={0} />
        <YAxis unit="%" />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        {_.map(colors, (val, key) => (
          <Bar barSize={50} key={key} dataKey={key} stackId={"a"} fill={val} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

// const GenderDemographieAll = ({ data }) => {
//   return (
//     <Paper
//       style={{
//         paddingRight: 12,
//         paddingLeft: 12,
//         paddingTop: 12,
//         paddingBottom: 12
//       }}>
//       <Typography
//         type="title"
//         component="p"
//         style={{ marginBottom: 12, minHeight: 48 }}>
//         Geschlechterverteilung nach Altersgruppen (allgemein)
//       </Typography>
//       <ResponsiveContainer aspect={2.5}>
//         <BarChart data={data} margin={{ bottom: 36 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="partei" interval={0} />
//           <YAxis unit="%" />
//           <Tooltip />
//           <Legend layout="horizontal" verticalAlign="bottom" align="center" />
//           {_.map(colors, (val, key) => (
//             <Bar
//               barSize={50}
//               key={key}
//               dataKey={key}
//               stackId={"a"}
//               fill={val}
//             />
//           ))}
//         </BarChart>
//       </ResponsiveContainer>
//     </Paper>
//   );
// };

class Demographie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bundestagQuote: null,
      bundestagParteienQuote: null,
      bundestagAlter: null,
      bundestagParteienAlter: null,
      bundestagAlterQuote: null
    };
  }

  async loadQuote() {
    const bundestagQuoteReq = await fetch(
      "http://localhost:3000/bundestagQuote"
    );
    const bundestagQuoteRes = await bundestagQuoteReq.json();
    const bundestagQuote = Object.keys(bundestagQuoteRes[0]).map(key => ({
      name: key,
      anteil: bundestagQuoteRes[0][key],
      fill: quoteColors[key]
    }));

    this.setState({ bundestagQuote });
  }

  async loadBundestagParteienQuote() {
    const bundestagParteienQuoteReq = await fetch(
      "http://localhost:3000/bundestagParteienQuote"
    );
    const bundestagParteienQuote = await bundestagParteienQuoteReq.json();
    bundestagParteienQuote.forEach(
      row => (row.partei = abbreviatePartyName[row.partei])
    );

    this.setState({ bundestagParteienQuote });
  }

  async loadBundestagAlter() {
    const bundestagAlterReq = await fetch(
      "http://localhost:3000/bundestagAlter"
    );
    const bundestagAlterRes = await bundestagAlterReq.json();
    const bundestagAlter = Object.keys(bundestagAlterRes[0]).map(key => ({
      name: key,
      anteil: bundestagAlterRes[0][key],
      fill: colors[key]
    }));

    this.setState({ bundestagAlter });
  }

  async loadBundestagParteienAlter() {
    const bundestagParteienAlterReq = await fetch(
      "http://localhost:3000/bundestagParteienAlter"
    );
    const bundestagParteienAlter = await bundestagParteienAlterReq.json();
    bundestagParteienAlter.forEach(
      row => (row.partei = abbreviatePartyName[row.partei])
    );

    this.setState({ bundestagParteienAlter });
  }

  // async loadBundestagAlterQuote () {
  //   const bundestagAlterQuoteReq = await fetch(
  //     "http://localhost:3000/bundestagAlterQuote"
  //   );
  //   const bundestagAlterQuote = await bundestagAlterQuoteReq.json();

  //   this.setState({bundestagAlterQuote})
  // }

  async componentDidMount() {
    this.loadBundestagParteienQuote();

    this.loadQuote();

    this.loadBundestagParteienAlter();

    this.loadBundestagAlter();

    // this.loadBundestagAlterQuote();
  }

  render() {
    const {
      bundestagQuote,
      bundestagParteienQuote,
      bundestagAlter,
      bundestagParteienAlter
      // bundestagAlterQuote
    } = this.state;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={3}>
          <Typography type="headline" component="h2">
            Demographie
          </Typography>
          <Typography component="p">
            Hier werden Altersgruppen und Geschlechter der
            Bundestagsabgeordneten zusammengefasst.
          </Typography>
        </Grid>
        <Grid item md={9} />

        <Grid item xs={12}>
          <Grid container>
            <Grid item md={1} />
            <Grid item xs={12} md={3}>
              {bundestagQuote ? (
                <GenderAll data={bundestagQuote} />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item xs={12} md={7}>
              {bundestagParteienQuote ? (
                <GenderParty data={bundestagParteienQuote} />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item md={1} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item md={1} />
            <Grid item xs={12} md={3}>
              {bundestagAlter ? (
                <DemographieAll data={bundestagAlter} />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item xs={12} md={7}>
              {bundestagParteienAlter ? (
                <DemographieParty data={bundestagParteienAlter} />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item md={1} />
          </Grid>
        </Grid>

        {/*
        <Grid item xs={12}>
          <Grid container>
            <Grid item md={1} />
            <Grid item xs={12} md={3}>
            {bundestagAlterQuote ?
              <GenderDemographieAll data={bundestagAlterQuote} />
              :
              <Spinner />
            }
            </Grid>
            <Grid item xs={12} md={7}>
              {<DemographieParty data={ bundestagParteienAlter } />}
            </Grid>
            <Grid item md={1} />
          </Grid>
        </Grid>*/}
      </Grid>
    );
  }
}

export default Demographie;
