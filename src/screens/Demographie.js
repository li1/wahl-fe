import React, { Component } from "react";
import _ from "lodash";

import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import { abbreviatePartyName, expandPartyName } from "../util";
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
  Frauenanteil: "rgba(236,64,122 ,1)",
  "Keine Angabe": "#888",
};

const GChart = ({ data, title }) => (
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
      {title}
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

const PChart = ({ data, title }) => (
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
      {title}
    </Typography>
    <ResponsiveContainer aspect={2.5}>
      <BarChart data={data} margin={{ bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="partei" interval={0} />
        <YAxis type="number" unit="%" domain={[0, 100]} />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        <Bar dataKey="Männeranteil" fill="rgba(128,203,196 ,1)" />
        <Bar dataKey="Frauenanteil" fill="rgba(236,64,122 ,1)" />
        { data[0]["Keine Angabe"] && <Bar dataKey="Keine Angabe" fill="#888" /> }
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const APChart = ({ data, title }) => (
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
      {title}
    </Typography>
    <ResponsiveContainer aspect={2.5}>
      <BarChart data={data} margin={{ bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="partei" interval={0} />
        <YAxis type="number" domain={[0, 100.5]} unit="%" />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        {_.map(colors, (val, key) => (
          <Bar barSize={50} key={key} dataKey={key} stackId={"a"} fill={val} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

class Demographie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kg: null,
      kp: null,
      bg: null,
      bp: null,
      abp: null,
      akp: null,
    };
  }

  async componentDidMount() {
    const kgRes = await (await fetch("http://localhost:3000/quote/kg")).json();
    const kg = Object.keys(kgRes[0]).map(key => ({
      name: key,
      anteil: kgRes[0][key],
      fill: quoteColors[key]
    }));
    this.setState({ kg });

    const kp = await (await fetch("http://localhost:3000/quote/kp")).json();
    kp.forEach(row => (row.partei = abbreviatePartyName[row.partei]));
    _.remove(kp, row => (!expandPartyName[row.partei]));
    this.setState({ kp });

    const akp = await (await fetch("http://localhost:3000/age/akp")).json();
    akp.forEach(row => (row.partei = abbreviatePartyName[row.partei]));
    _.remove(akp, row => (!expandPartyName[row.partei]));
    this.setState({ akp });


    const bgRes = await (await fetch("http://localhost:3000/quote/bg")).json();
    const bg = Object.keys(bgRes[0]).map(key => ({
      name: key,
      anteil: bgRes[0][key],
      fill: quoteColors[key]
    }));
    this.setState({ bg });

    const bp = await (await fetch("http://localhost:3000/quote/bp")).json();
    bp.forEach(row => (row.partei = abbreviatePartyName[row.partei]));
    this.setState({ bp });

    const abp = await (await fetch("http://localhost:3000/age/bp")).json();
    abp.forEach(row => (row.partei = abbreviatePartyName[row.partei]));
    this.setState({ abp });
  }

  render() {
    const {
      bg,
      bp,
      akp,
      abp,
      kg,
      kp
    } = this.state;

    console.log(bg, bp, kg, kp, akp, abp);

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
            <Grid item md={3} />
            <Grid item xs={12} md={3}>
              {kg ? (
                <GChart data={kg} title="Geschlechterverteilung der Kandidaten" />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              {bg ? (
                <GChart data={bg} title="Geschlechterverteilung der Abgeordneten" />
              ) : (
                <Spinner />
              )}
            </Grid>
            <Grid item md={3}/>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={6}>
              {kp ? (
                <PChart data={kp} title="Geschlechterverteilung der Kandidaten (pro Bundestagspartei)"/>
              ) : (
                <Spinner />
              )}
            </Grid>          
            <Grid item xs={12} md={6}>
              {bp ? (
                <PChart data={bp} title="Geschlechterverteilung der Abgeordneten (pro Partei)"/>
              ) : (
                <Spinner />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={6}>
              {akp ? (
                <APChart data={akp} title="Demographie der Kandidaten (pro Partei)"/>
              ) : (
                <Spinner />
              )}
            </Grid>          
            <Grid item xs={12} md={6}>
              {abp ? (
                <APChart data={abp} title="Demographie der Abgeordneten (pro Partei)"/>
              ) : (
                <Spinner />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Demographie;
