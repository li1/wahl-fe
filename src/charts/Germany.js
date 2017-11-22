import React from "react"

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

// const wrapperStyles = {
//   width: "100%",
//   maxWidth: 980,
//   margin: "0 auto",
// }

function Germany (props) {

  return(
    <div style={ {height: "84vh" }}>
      <ComposableMap 
        viewBox="0 0 573 780"
        style={ {width: "100%", height: "100%"}}
        width = {573}
        height = {780}
        projection="mercator"
        projectionConfig={{
                    scale: 3401.3546199031352,
                  }}>
        <ZoomableGroup center={[10.437274617500082,51.333495750273435]}>
        <Geographies geographyUrl="/germany.json">
          {(geographies, projection) => geographies.map((geography, i) => (
            <Geography
              key={ `geography-${i}` }
              geography={ geography }
              projection={ projection }
              style={ {
                default: {
                  fill: "#000",
                  stroke: "#FFF",
                  strokeWidth: 1,
                },
                hover:   { fill: "#FF0000" },
              } }
              />
          ))}
        </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )

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
}

export default Germany
