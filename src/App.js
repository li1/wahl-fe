import React from 'react';
import Welcome from "./Welcome";

import { MuiThemeProvider} from 'material-ui/styles';

import NavBar from "./NavBar";
import theme from "./theme";

//Visualisierungsidee: http://www.spiegel.de/politik/deutschland/bundestagswahl-2017-alle-ergebnisse-im-ueberblick-a-1167247.html

function App (props) {
    return (
    <MuiThemeProvider theme = {theme}>
      <NavBar title = "Wahl Informatiko"/>
      <div style= {{marginTop: 90, marginLeft: 24, marginRight: 24}}>
        <Welcome />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
