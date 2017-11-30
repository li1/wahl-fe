import React, {Component} from 'react';
import {PieChart, Pie, ResponsiveContainer, Tooltip, Cell, Label} from 'recharts';

import Spinner from "../components/Spinner";
 
class SitzverteilungChart extends  Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.colors = {"Christlich Demokratische Union Deutschlands": "#434686", 
                   "Sozialdemokratische Partei Deutschlands": "#BC2739", 
                   "DIE LINKE": "#865DC1", 
                   "BÜNDNIS 90/DIE GRÜNEN": "#55A166", 
                   "Christlich-Soziale Union in Bayern e.V.": "#3888BF",
                   "Freie Demokratische Partei": "#F8CC55",
                   "Alternative für Deutschland": "#65C7C4" };
  }

  async componentDidMount () {
    //const data = [{name: 'CDU', value: 200}, {name: 'CSU', value: 49},
    //    {name: 'Group C', value: 30}, {name: 'Group D', value: 12},
    //    {name: 'Group E', value: 12}, {name: 'Group F', value: 22}];
    const res = await fetch("http://localhost:3000/sitzverteilung");
    const data = await res.json();

    this.setState({chartData: data,
                   gesamtsitze: data.reduce((acc, val) => (acc + val.sitze), 0)});
  }

  getSitzPercentage = sitze => (((sitze/this.state.gesamtsitze) * 100).toFixed(1) + "%");

  onPieEnter = (data, index, callback) => {
    this.setState({activeIndex: index});
    callback(data);
  }

  onPieLeave = callback => {
    this.setState({activeIndex: undefined});
    callback();
  }  

  onPieClick = (data,index,callback) => {
    const { selectedParty } = this.state;

    if (selectedParty !== undefined) {
      // clicked on selectedParty again
      if (index === selectedParty) {
        this.setState({selectedParty: undefined});
        callback(data, true);
        return;
      }
    }

    //clicked on new Party
    this.setState({selectedParty: index});
    callback(data);
  }  

  cellOpacity = cellIdx => {    
    const { activeIndex, selectedParty } = this.state;

    if (activeIndex !== undefined) {
      return cellIdx === activeIndex ? 1.0 : 0.5;
    } else {
      if (selectedParty !== undefined) {
        return cellIdx === selectedParty ? 1.0 : 0.3;
      } else {
        return 1;
      }
    }
  }


  render() {
    const { chartData } = this.state;
    const { onChartHover, onChartUnhover, onChartClick } = this.props; 

    return (
      <div style={{flexFlow: "row", alignItems: "center", justifyContent: "center"}}>
        { !chartData ? <Spinner /> :
        <ResponsiveContainer aspect={0.95}>
          <PieChart renderOnlyTopHalf={ true }>
            <Pie startAngle={180} 
                 endAngle={0} 
                 innerRadius={"2%"} 
                 data={chartData} 
                 nameKey={"partei"} 
                 dataKey={"sitze"}
                 onMouseEnter={(data, index) => this.onPieEnter(data,index,onChartHover)}
                 onMouseLeave={(data, index) => this.onPieLeave(onChartUnhover)}
                 onClick={(data, index) => this.onPieClick(data,index, onChartClick)}
                 fill="#DDD"
                 label>
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} 
                        fill={this.colors[entry.partei]} 
                        opacity={ this.cellOpacity(index) }
                        strokeWidth={3}>
                    <Label />
                  </Cell>))
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        }
      </div>
    )
  }
}

export default SitzverteilungChart;
