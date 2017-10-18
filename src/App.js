//@TODO: Add backend (API server)
//@TODO: Basic structure (combining fe + backend): https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
//@TODO: Usage of PostgreSQL and node-postgres (node-postgres.com): https://www.youtube.com/watch?v=2oAS7MtMwqA

import React, { Component } from 'react';
import $ from "mori";

import logo from './logo.svg';
import './App.css';

import db from "./db";

class App extends Component {
  componentWillMount () {
    db.fetchSN();
  }

  render() {
    console.log($.toJs(db()));

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React!</h1>
        </header>
        <p className="App-intro">
          { $.intoArray($.get(db(), "sportler")) }
          <br />
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button>Test</button>
      </div>
    );
  }
}

export default App;
