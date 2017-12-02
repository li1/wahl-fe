import React, { Component } from "react"
import Measure from 'react-measure'

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

import { abbreviatePartyName } from "../util";



const arrow = (top, left) => ({
  position: "absolute",
  top: top,
  left: left-12,
  width: 0,
  height: 0,
  borderStyle: "solid",
  borderWidth: "12px 12px 0 12px",
  borderColor: "#fff transparent transparent transparent",
});



// const MapMarker = ({marker}) => {console.log(marker);return (
//   <Marker marker={ marker }
//           style={{ default: { fill: "#FF5722" },
//                    hover: { fill: "#FFFFFF" },
//                    pressed: { fill: "#FF5722" }}}>
//     <circle
//       cx={0}
//       cy={0}
//       r={10}
//       style={{
//         stroke: "#FF5722",
//         strokeWidth: 3,
//         opacity: 0.9,
//       }}/>
//     <text
//       textAnchor="middle"
//       y={-25}
//       style={{
//         fill: "#607D8B",
//       }}>
//       {marker.name}
//     </text>
//   </Marker>
// )};

const mapColor = (landName, data) => {
  if (data[landName] !== undefined) {
    return data[landName].color || "#000";
  } else {
    return "#fff"
  }
}

const Tooltip = ({hoveredParty, hoveredLand, parentThis, visible}) => {
  const { x, y, dimensions } = parentThis.state;
  const showTooltip = visible ? "visible" : "hidden";

  return (
    <Measure bounds onResize={contentRect => parentThis.setState({dimensions: contentRect.bounds})}>
      {({measureRef}) =>
        <div style={{visibility: showTooltip, color: "#2c2c2c"}}>
          <div ref={measureRef}
            style={{position: "absolute", 
                    padding: 6,
                    boxShadow: "0px 0px 6px rgba(0,0,0,0.3)",
                    borderRadius: 6,
                    top: y-(dimensions.height + 24), 
                    left: x-(dimensions.width/2),
                    backgroundColor: "#FFF"}}>
            <div>{hoveredLand}: <span style={{fontWeight: "bold"}}>{hoveredParty}</span></div>
          </div>
          <div style={arrow(y-(dimensions.height/2 +12), x)}></div>
        </div>
      }
    </Measure>
  )
}

class Germany extends Component {
  constructor (props) {
    super(props);
    this.state = {x: 0, y: 0, dimensions: {width: 0, height: 0}, showTooltip: false};
  }

  handleMove = (geography, event) => {
    this.setState({x: event.clientX, 
                   y: event.clientY + window.pageYOffset,
                   showTooltip: true,
                   hoveredLand: geography.properties.name});
  }

  handleLeave = () => this.setState({showTooltip: false});

  handleClick = name => {
    const { selectedLand } = this.state;
    const { onClickHandler } = this.props;

    if (selectedLand === name) {
      this.setState({selectedLand: null});
    } else {
      this.setState({selectedLand: name});
    }

    onClickHandler(name);
  }

  render () {
    const { data } = this.props;
    const { showTooltip, hoveredLand, selectedLand } = this.state;

    const hoveredParty = data[hoveredLand] ? abbreviatePartyName[data[hoveredLand].partei] : "Keine Partei";

    return (
      <div style={ {height: "78vh" }}>
        <ComposableMap 
          viewBox="0 0 573 780"
          style={ {width: "100%", height: "100%"}}
          width = {573}
          height = {780}
          projection="mercator"
          projectionConfig={ {scale: 3401.3546199031352} }>
          <ZoomableGroup center={[10.437274617500082,51.333495750273435]}>
            <Geographies geographyUrl="/germany.json" disableOptimization={ true }>
              {(geographies, projection) => geographies.map((geography, i) => (
                <Geography
                  key={ i }
                  geography={ geography }
                  projection={ projection }
                  onMouseMove={ this.handleMove }
                  onMouseLeave={ this.handleLeave }
                  onClick={ () => this.handleClick(geography.properties.name) }
                  style={ { default: {
                              fill: mapColor(geography.properties.name, data),
                              opacity: (selectedLand === geography.properties.name) ? 0.8 : 1.0,
                              stroke: "#FFF",
                              strokeWidth: (selectedLand === geography.properties.name) ? 4 : 1,
                            },
                            hover: { fill: mapColor(geography.properties.name, data),
                                     opacity: 0.8,
                                     stroke: "#FFF",
                                     strokeWidth: 1, },
                            pressed: { fill: mapColor(geography.properties.name, data),
                                       stroke: "#FFF",
                                       strokeWidth: 1,} }} />
              ))}
            </Geographies>
            {/*
              <Markers>
                {markers.map((marker, i) => (
                  <Marker marker={ marker }
                          key={ i }>
                    <text textAnchor="middle"
                          y={0}
                          style={{fill: "#fff"}}>
                      {(data[marker.name] !== undefined) && abbreviatePartyName[data[marker.name].partei]}
                    </text>
                  </Marker>
                ))}
              </Markers> 
            */}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip hoveredLand={ hoveredLand } 
                 hoveredParty={ hoveredParty }
                 parentThis= { this } 
                 visible={ showTooltip }/>
      </div>
    )
  }
}


export default Germany
