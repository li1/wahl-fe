String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const abbreviatePartyName = {
  "Christlich Demokratische Union Deutschlands": "CDU",
  "Sozialdemokratische Partei Deutschlands": "SPD",
  "DIE LINKE": "Die Linke",
  "BÜNDNIS 90/DIE GRÜNEN": "Die Grünen",
  "Christlich-Soziale Union in Bayern e.V.": "CSU",
  "Freie Demokratische Partei": "FDP",
  "Alternative für Deutschland": "AfD",
}

export const expandPartyName = {
  "CDU": "Christlich Demokratische Union Deutschlands",
  "SPD": "Sozialdemokratische Partei Deutschlands",
  "Die Linke": "DIE LINKE",
  "Die Grünen": "BÜNDNIS 90/DIE GRÜNEN",
  "CSU": "Christlich-Soziale Union in Bayern e.V.",
  "FDP": "Freie Demokratische Partei",
  "AfD": "Alternative für Deutschland",
}

export const colorMapping = {
  "CDU": "#434686",
  "SPD": "#BC2739",
  "Die Linke": "#865DC1",
  "Die Grünen": "#55A166",
  "CSU": "#3888BF",
  "FDP": "#F8CC55",
  "AfD": "#65C7C4",
}

