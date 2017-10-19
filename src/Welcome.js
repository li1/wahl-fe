//@TODO: Add backend (API server)
//@TODO: Basic structure (combining fe + backend): https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
//@TODO: Usage of PostgreSQL and node-postgres (node-postgres.com): https://www.youtube.com/watch?v=2oAS7MtMwqA
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

import React, { Component } from 'react';
import $ from "mori";

import logo from './logo.svg';
import "./Welcome.css";
import db from "./db";

class Welcome extends Component {

  render() {
    console.log($.toJs(db()))

    return (
      <div className="Welcome">
        <header className="Welcome-header">
          <img src={logo} className="Welcome-logo" alt="logo" />
          <h1 className="Welcome-title">Welcome to React!</h1>
        </header>

        <button onClick={e => { db.toggleHonkey() }}>Toggle-Test</button>
        <button onClick={e => { db.tower() }}>The world has moved on</button>
        <p>
          { $.get(db(), "tower") }
        </p>
        { $.get(db(), "showHonkey") &&
          <p>
            That honkey mah'fa pressed Test!
          </p> 
        }
      </div>  
    );
  }
}

export default Welcome;

/*


*/
