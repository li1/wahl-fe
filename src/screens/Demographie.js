import React, { Component } from "react";
import _ from "lodash";

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import {ResponsiveContainer,
        XAxis,
        YAxis,
        Label,
        CartesianGrid,
        Tooltip,
        Legend,
        PieChart,
        Pie} from "recharts";


const GenderAll = ({data}) => (
  <Paper style={{paddingRight: 12, paddingLeft: 12, paddingTop: 12, paddingBottom: 12}}>
    <Typography type="title" component="p" style={{marginBottom: 12, minHeight: 48}}>
      Geschlechterverteilung im Bundestag (allgemein)
    </Typography>
    <ResponsiveContainer aspect={1}>
      <PieChart>
        <Pie label data={data} innerRadius="20%" dataKey="anteil" />
        <Legend iconSize={15} layout='horizontal' verticalAlign='bottom' align="center" />
      </PieChart>
    </ResponsiveContainer>
  </Paper>
)

const GenderParty = ({data}) => (
  <Paper style={{paddingRight: 12, paddingLeft: 12, paddingTop: 12, paddingBottom: 12}}>
    <Typography type="title" component="p" style={{marginBottom: 12, minHeight: 48}}>
      Geschlechterverteilung im Bundestag (pro Partei)
    </Typography>
  </Paper>
)

const DemographieAll = ({data}) => {console.log(data); return (
  <Paper style={{paddingRight: 12, paddingLeft: 12, paddingTop: 12, paddingBottom: 12}}>
    <Typography type="title" component="p" style={{marginBottom: 12, minHeight: 48}}>
      Demographie im Bundestag (allgemein)
    </Typography>
      <ResponsiveContainer aspect={1}>
        <PieChart>
          <Pie label data={data} innerRadius="20%" dataKey="anteil" />
          <Legend iconSize={15} layout='horizontal' verticalAlign='bottom' align="center" />
        </PieChart>
      </ResponsiveContainer>
  </Paper>
)}

const DemographieParty = ({data}) => (
  <Paper style={{paddingRight: 12, paddingLeft: 12, paddingTop: 12, paddingBottom: 12}}>
    <Typography type="title" component="p" style={{marginBottom: 12, minHeight: 48}}>
      Demographie im Bundestag (pro Partei)
    </Typography>
  </Paper>
)

class Demographie extends Component {

  constructor (props) {
    super(props);

    this.state = {bundestagQuote: null, 
                  bundestagParteienQuote: null, 
                  bundestagAlter: null, 
                  bundestagParteienAlter: null}
  }

  async componentDidMount () {
    const bundestagQuoteReq = await fetch("http://localhost:3000/bundestagQuote");
    const bundestagQuoteRes = await bundestagQuoteReq.json();
    const quoteColors = {"Männeranteil": "rgba(128,203,196 ,1)", "Frauenanteil": "rgba(236,64,122 ,1)"};
    const bundestagQuote = Object.keys(bundestagQuoteRes[0]).map(key => ({name: key, anteil: bundestagQuoteRes[0][key], fill: quoteColors[key]}));

    const bundestagParteienQuoteReq = await fetch("http://localhost:3000/bundestagParteienQuote");
    const bundestagParteienQuote = await bundestagParteienQuoteReq.json();

    const bundestagAlterReq = await fetch("http://localhost:3000/bundestagAlter");
    const bundestagAlterRes = await bundestagAlterReq.json();
    const colors = {"< 30": "#8884d8", 
                    "31-40": "#83a6ed", 
                    "41-50": "#8dd1e1", 
                    "51-60": "#82ca9d", 
                    "61-70": "#a4de6c", 
                    "> 70": "#d0ed57" };
    const bundestagAlter = Object.keys(bundestagAlterRes[0]).map(key => ({name: key, anteil: bundestagAlterRes[0][key], fill: colors[key]}));

    const bundestagParteienAlterReq = await fetch("http://localhost:3000/bundestagParteienAlter");
    const bundestagParteienAlter = await bundestagParteienAlterReq.json();

    this.setState({bundestagQuote, bundestagParteienQuote, bundestagAlter, bundestagParteienAlter});
  }

  render () {
    const {bundestagQuote, bundestagParteienQuote, bundestagAlter, bundestagParteienAlter} = this.state;

    return (
      <Grid container spacing={ 24 }>
        <Grid item xs={12} md={3}>
          <Typography type="headline" component="h2">Demographie</Typography>
          <Typography component="p">
            Hier werden Altersgruppen und Geschlechter der Bundestagsabgeordneten zusammengefasst.
          </Typography>
        </Grid>
        <Grid item md={9} />

        {bundestagAlter && bundestagParteienAlter &&
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <GenderAll data={ bundestagQuote } />
              </Grid>
              <Grid item xs={12} md={8}>
                <GenderParty data={ bundestagParteienQuote } />
              </Grid>
            </Grid>
          </Grid>
        }

        {bundestagQuote && bundestagParteienQuote &&
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <DemographieAll data={ bundestagAlter } />
              </Grid>
              <Grid item xs={12} md={6}>
                <DemographieParty data={ bundestagParteienAlter } />
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    )
  }
}

export default Demographie;
