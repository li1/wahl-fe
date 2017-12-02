String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export const abbreviatePartyName = {
  "Christlich Demokratische Union Deutschlands": "CDU",
  "Sozialdemokratische Partei Deutschlands": "SPD",
  "DIE LINKE": "Die Linke",
  "BÜNDNIS 90/DIE GRÜNEN": "Die Grünen",
  "Christlich-Soziale Union in Bayern e.V.": "CSU",
  "Freie Demokratische Partei": "FDP",
  "Alternative für Deutschland": "AfD",
  "Übrige": "Übrige",
};

export const expandPartyName = {
  "CDU": "Christlich Demokratische Union Deutschlands",
  "SPD": "Sozialdemokratische Partei Deutschlands",
  "Die Linke": "DIE LINKE",
  "Die Grünen": "BÜNDNIS 90/DIE GRÜNEN",
  "CSU": "Christlich-Soziale Union in Bayern e.V.",
  "FDP": "Freie Demokratische Partei",
  "AfD": "Alternative für Deutschland",
  "Übrige": "Übrige",
};

export const colorMapping = {
  "CDU": "#434686",
  "SPD": "#BC2739",
  "Die Linke": "#865DC1",
  "Die Grünen": "#55A166",
  "CSU": "#3888BF",
  "FDP": "#F8CC55",
  "AfD": "#65C7C4",
};

export const markers = [
  {name: "Hessen", coordinates: [9.012254, 50.652552]},
  {name: "Saarland", coordinates: [6.963061, 49.384563]},
  {name: "Thüringen", coordinates: [11.096797, 50.819773]},
  {name: "Schleswig-Holstein", coordinates: [9.817016, 54.099925]},
  {name: "Mecklenburg-Vorpommern", coordinates: [12.643003, 53.872156]},
  {name: "Hamburg", coordinates: [10.012862, 53.536047]},
  {name: "Bremen", coordinates: [8.712835, 53.139316]},
  {name: "Niedersachsen", coordinates: [9.898252, 52.347661]},
  {name: "Brandenburg", coordinates: [13.792513, 51.956265]},
  {name: "Berlin", coordinates: [13.391378, 52.489843]},
  {name: "Sachsen-Anhalt", coordinates: [11.694664, 51.877400]},
  {name: "Sachsen", coordinates: [13.606609, 51.042819]},
  {name: "Rheinland-Pfalz", coordinates: [7.240179, 49.945743]},
  {name: "Nordrhein-Westfalen", coordinates: [7.352693, 51.492104]},
  {name: "Baden-Württemberg", coordinates: [9.031912, 48.610949]},
  {name: "Bayern", coordinates: [11.490102, 48.930093]},
];

