import React from "react";

import { LinearProgress } from "material-ui/Progress";

function Spinner() {
  return (
    <div style={{ paddingTop: 12, paddingBottom: 12 }}>
      <div style={{ textAlign: "center", color: "#555", marginBottom: 6 }}>
        Lädt...
      </div>
      <LinearProgress color="accent" mode="query" />
    </div>
  );
}

export default Spinner;
