import React, { Component } from "react"
import Measure from 'react-measure'

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"



export const arrow = (top, left) => ({
  position: "absolute",
  top: top,
  left: left-12,
  width: 0,
  height: 0,
  borderStyle: "solid",
  borderWidth: "12px 12px 0 12px",
  borderColor: "#fff transparent transparent transparent",
});



// export const border = {
//   base: {
//     display: 'block',
//     width: 0,
//     height: 0,
//     position: 'absolute',
//     borderStyle: 'solid',
//   },
//   top: {
//     borderColor: theme.border.borderColor + ' transparent transparent transparent',
//     borderWidth: '9px 9px 0px 9px',
//     bottom: '-7px',
//     ...vertical,
//   },
//   right: {
//     borderColor: 'transparent ' + theme.border.borderColor + ' transparent transparent',
//     borderWidth: '9px 9px 9px 0px',
//     left: '-7px',
//     ...horizontal,
//   },
//   bottom: {
//     borderColor: 'transparent transparent ' + theme.border.borderColor +' transparent',
//     borderWidth: '0px 9px 9px 9px',
//     top: '-7px',
//     ...vertical,
//   },
//   left: {
//     borderColor: 'transparent transparent transparent ' + theme.border.borderColor,
//     borderWidth: '9px 0px 9px 9px',
//     right: '-7px',
//     ...horizontal,
//   },
// };

const mapColor = (landName, colorMap) => {
  if (colorMap !== undefined) {
    return colorMap[landName] || "#000";
  } else {
    return "#fff"
  }
}

const Tooltip = ({content, parentThis, visible}) => {
  const { x, y, dimensions } = parentThis.state;
  const showTooltip = visible ? "visible" : "hidden";
  
  //@TODO: content
  console.log(content);

  return (
    <Measure bounds onResize={contentRect => parentThis.setState({dimensions: contentRect.bounds})}>
      {({measureRef}) =>
        <div style={{visibility: showTooltip}}>
          <div ref={measureRef}
            style={{position: "absolute", 
                    padding: 6,
                    borderRadius: 6,
                    top: y-(dimensions.height + 24), 
                    left: x-(dimensions.width/2),
                    backgroundColor: "#FFF"}}>
            <div>Hallo Sophia der Niko stinkt!</div>
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
                   tooltipContent: geography});
  }

  handleLeave = () => this.setState({showTooltip: false});

  render () {
    const { colorMap } = this.props;
    const { showTooltip, tooltipContent } = this.state;

    return (
      <div style={ {height: "84vh" }}>
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
                style={ { default: {
                            fill: mapColor(geography.properties.name, colorMap),
                            stroke: "#FFF",
                            strokeWidth: 1,
                          },
                          hover: { fill: "#FF0000" } }} />
            ))}
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip content={ tooltipContent } 
                 parentThis= { this } 
                 visible={ showTooltip }/>
      </div>
    )
  }
}

    // return (
    //   <div style={wrapperStyles}>
    //     <ComposableMap
    //       projectionConfig={{
    //         scale: 205,
    //         rotation: [-11,0,0],
    //       }}
    //       width={980}
    //       height={551}
    //       style={{
    //         width: "100%",
    //         height: "auto",
    //       }}
    //       >
    //       <ZoomableGroup center={[0,20]} disablePanning>
    //         <Geographies geographyUrl="/germany.json">
    //           {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
    //             <Geography
    //               key={i}
    //               geography={geography}
    //               projection={projection}
    //               style={{
    //                 default: {
    //                   fill: "#ECEFF1",
    //                   stroke: "#607D8B",
    //                   strokeWidth: 0.75,
    //                   outline: "none",
    //                 },
    //                 hover: {
    //                   fill: "#607D8B",
    //                   stroke: "#607D8B",
    //                   strokeWidth: 0.75,
    //                   outline: "none",
    //                 },
    //                 pressed: {
    //                   fill: "#FF5722",
    //                   stroke: "#607D8B",
    //                   strokeWidth: 0.75,
    //                   outline: "none",
    //                 },
    //               }}
    //             />
    //           ))}
    //         </Geographies>
    //       </ZoomableGroup>
    //     </ComposableMap>
    //   </div>
    // )


export default Germany
