import React, {Component} from 'react';

import Overview from "./screens/Overview";
import Bundestag from "./screens/Bundestag";
import AnalysisSelection from "./screens/AnalysisSelection";
import CloseCall from "./screens/CloseCall";
import Gewichtung from "./screens/Gewichtung";
import Demographie from "./screens/Demographie";
import NavBar from "./components/NavBar"
import Vote from "./screens/Vote"

import { Route, Switch } from "react-router-dom";

import { MuiThemeProvider} from 'material-ui/styles';
import theme from "./theme";

class Screen extends Component {
  constructor (props) {
    super(props);

    this.state = {use2013: false, useEinzel: false}
  }

  render () {
    const {title, Component} = this.props;
    const {use2013, useEinzel }  = this.state;

    const activate2013Switch = {
      "Wahlkreisübersicht": true,
    };

    const switch2013 = () => {
      this.setState({use2013: !this.state.use2013});
    }

    const switchEinzel = () => {
      this.setState({useEinzel: !this.state.useEinzel});
    }

    return (
      <div>
        <NavBar switch2013={switch2013} 
                switchEinzel={switchEinzel} 
                use2013={use2013} 
                useEinzel={useEinzel} 
                activate2013Switch={activate2013Switch[title]}
                title ={ title }/>
        <div style= {{marginTop: 90, marginLeft: 24, marginRight: 24}}>
          <Component key={`title-${useEinzel}-${use2013}`} use2013={use2013} useEinzel={useEinzel} />
        </div>
      </div>
    )
  }
}

//using a key hack to force re-rendering on global switches
const BundestagScreen = (props) => <Screen Component={ Bundestag } title="Bundestag" {...props} />
const OverviewScreen = (props) => <Screen Component={ Overview } title="Wahlkreisübersicht" {...props} />
const AnalysisScreen = (props) => <Screen Component={ AnalysisSelection } title="Analysen" {...props} />
const CloseCallScreen = (props) => <Screen Component={ CloseCall } title="Analysen" {...props} />
const GewichtungScreen = (props) => <Screen Component={ Gewichtung } title="Analysen" {...props} />
const DemographieScreen = (props) => <Screen Component={ Demographie } title="Analysen" {...props} />
const VoteScreen = (props) => <Screen Component={ Vote } title="Wahlzettel" {...props} />
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
        <Route path="/closecall" render={ CloseCallScreen } />
        <Route path="/umgewichtung" render={ GewichtungScreen } />
        <Route path="/demographie" render={ DemographieScreen } />
        <Route path="/vote" render={ VoteScreen }/>
        <Route component={ NotFound }/>
      </Switch>
    </MuiThemeProvider>
  );
}

export default App;
