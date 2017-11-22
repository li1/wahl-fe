import React, {Component} from 'react';
import {PieChart, Pie, ResponsiveContainer, Tooltip} from 'recharts';

import Spinner from "../components/Spinner";

class SitzverteilungChart extends  Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    //const data = [{name: 'CDU', value: 200}, {name: 'CSU', value: 49},
    //    {name: 'Group C', value: 30}, {name: 'Group D', value: 12},
    //    {name: 'Group E', value: 12}, {name: 'Group F', value: 22}];
    const res = await fetch("http://localhost:3000/sitzverteilung");
    const data = await res.json();

    this.setState({chartData: data});
  }

  render() {
    return (
      <div style={{flexFlow: "column", alignItems: "center", justifyContent: "center"}}>
        { !this.state.chartData ? <Spinner /> :
        <ResponsiveContainer aspect={0.95}>
          <PieChart renderOnlyTopHalf={ true }>
            <Pie startAngle={180} endAngle={0} data={this.state.chartData} nameKey={"partei"} dataKey={"sitze"}
                 fill="#8884d8" label/>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        }
      </div>
    )
  }
}

export default SitzverteilungChart;
