import React, {Component} from 'react';

import { AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip, ResponsiveContainer } from 'recharts';

class ExampleChart extends Component {

  constructor (props) {
    super(props);
    this.state = {}
  }

  async componentDidMount () {
    const res = await fetch("http://localhost:3000/parteiergebnisse");
    const ergebnisse = await res.json();
    const mockData = [{wahlkreis: 1, spd: 100}, {wahlkreis: 2, spd: 50}];
    this.setState({chartData: ergebnisse})
  }

  render () {
    return (
      <div style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
        <ResponsiveContainer width="100%" height={600}>
          <AreaChart data={this.state.chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorLinke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9C27B0" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSPD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF00" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F44336" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFDP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF9800" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="wahlkreis" hide={true}/>
            <YAxis hide={true}/>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Area type="monotone" dataKey="linke" stroke="#9C27B0" fillOpacity={1} fill="url(#colorLinke)" />
            <Area type="monotone" dataKey="spd" stroke="#F44336" fillOpacity={1} fill="url(#colorSPD)" />
            <Area type="monotone" dataKey="fdp" stroke="#FF9800" fillOpacity={1} fill="url(#colorFDP)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default ExampleChart;
