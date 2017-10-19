import React, { Component } from 'react';
import Welcome from "./Welcome";
import db from "./db";

class App extends Component {
  componentDidMount () {
    //db listener, triggers re-render in subcomponents through state update
    db(newState => { this.setState(() => newState) });
  }

  render() {
    return (
      <Welcome />
    );
  }
}

export default App;
