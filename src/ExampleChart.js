import React, {Component} from 'react';

import { AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip } from 'recharts';

class ExampleChart extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    const res = await fetch("http://localhost:3000/parteiergebnisse")
    const ergebnisse = await res.json()
    this.setState({chartData: ergebnisse})
  }

  render () {
    return (
      <div style={{padding: 30, flex: 1, alignItems: "center", justifyContent: "center"}}>
        <AreaChart width={1350} height={600} data={this.state.chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLinke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9C27B0" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSPD" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
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
      </div>
    )
  }
}

export default ExampleChart;
