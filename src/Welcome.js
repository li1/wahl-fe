//@TODO: Add backend (API server)
//@TODO: Basic structure (combining fe + backend): https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
//@TODO: Usage of PostgreSQL and node-postgres (node-postgres.com): https://www.youtube.com/watch?v=2oAS7MtMwqA
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

import React from 'react';

import Paper from 'material-ui/Paper';

import ExampleChart from "./ExampleChart";

import AngleChart from "./AngleChart";

function Welcome(props) {

  return (
      <div>
    <Paper>
      <ExampleChart />
    </Paper>
      <Paper style={{marginTop: 30}}>
        <AngleChart title={"Sitzverteilung"} />
      </Paper>
  </div>
  );
}

export default Welcome;
