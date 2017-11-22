import React from 'react';

import Overview from "./screens/Overview";
import Bundestag from "./screens/Bundestag";
import NavBar from "./components/NavBar"

import { Route, Switch } from "react-router-dom"

import { MuiThemeProvider} from 'material-ui/styles';
import theme from "./theme";

//Visualisierungsidee: http://www.spiegel.de/politik/deutschland/bundestagswahl-2017-alle-ergebnisse-im-ueberblick-a-1167247.html

const Screen = (props) => {
  const {title, component} = props;

  return (
    <div>
      <NavBar title ={ title }/>
      <div style= {{marginTop: 90, marginLeft: 24, marginRight: 24}}>
        { component }
      </div>
    </div>
  )
}

const BundestagScreen = (props) => <Screen component={ <Bundestag /> } title="Bundestag" {...props} />
const OverviewScreen = (props) => <Screen component={ <Overview /> } title="Wahlkreisübersicht" {...props} />
const AnalysisScreen = (props) => <Screen component={ <Bundestag /> } title="Analysen" {...props} />
const VoteScreen = (props) => <Screen component={ <Bundestag /> } title="Wahlzettel" {...props} />
const NotFound = () => <div style={{margin:30}}>
                          404 not found. Go <a style={{textDecoration: "underline"}} href="/">home</a>.
                        </div>

function App (props) {
    return (
      <MuiThemeProvider theme = {theme}>
        <Switch>
          <Route exact path="/" render={ BundestagScreen } />
          <Route path="/overview" render={ OverviewScreen }/>
          <Route path="/analysis" render={ AnalysisScreen }/>
          <Route path="/vote" render={ VoteScreen }/>
          <Route component={ NotFound }/>
        </Switch>
      </MuiThemeProvider>
  );
}

export default App;
