import React, { Component } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from "recharts";

import Spinner from "../components/Spinner";
import { colorMapping } from "../util";

class SitzverteilungChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPieEnter = (data, index, callback) => {
    this.setState({ activeIndex: index });
    callback(data);
  };

  onPieLeave = callback => {
    this.setState({ activeIndex: undefined });
    callback();
  };

  onPieClick = (data, index, callback) => {
    const { selectedParty } = this.state;

    if (selectedParty !== undefined) {
      // clicked on selectedParty again
      if (index === selectedParty) {
        this.setState({ selectedParty: undefined });
        callback(data, true);
        return;
      }
    }

    //clicked on new Party
    this.setState({ selectedParty: index });
    callback(data);
  };

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
  };

  render() {
    const {
      onChartHover,
      onChartUnhover,
      onChartClick,
      chartData,
    } = this.props;

    return (
      <div
        style={{
          flexFlow: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!chartData ? (
          <Spinner />
        ) : (
          <ResponsiveContainer aspect={0.95}>
            <PieChart renderOnlyTopHalf={true}>
              <Pie
                startAngle={180}
                endAngle={0}
                innerRadius={"2%"}
                data={chartData}
                nameKey={"partei"}
                dataKey={"sitze"}
                onMouseEnter={(data, index) =>
                  this.onPieEnter(data, index, onChartHover)
                }
                onMouseLeave={(data, index) => this.onPieLeave(onChartUnhover)}
                onClick={(data, index) =>
                  this.onPieClick(data, index, onChartClick)
                }
                fill="#DDD"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMapping[entry.partei]}
                    opacity={this.cellOpacity(index)}
                    strokeWidth={3}
                  >
                    <Label />
                  </Cell>
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}

export default SitzverteilungChart;
