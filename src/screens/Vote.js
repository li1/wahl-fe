import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import Grid from 'material-ui/Grid';
import SortableTable from "../components/SortableTable";
import Typography from 'material-ui/Typography';
import EnhancedTable from '../components/TableExample';

const style = {
    margin: 12,
};


let wahlkreis = -1;
let erststimmenselection = [];
let zweitstimmenselection = [];
let code = "";

export class Vote extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tableData: [], tableDataParties: [], wahlkreis: -1, input: "", voted : false};
        this.btnTapped = this.btnTapped.bind(this);
        this.sendingVoteToBackend = this.sendingVoteToBackend.bind(this);
    }

    async componentDidMount() {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/1");
        const parteien = await fetch("http://localhost:3000/wahlkreisparteien/1");
        const tableDataParties = await parteien.json();
        const tableData = await kandidaten.json();

        this.setState({tableData: tableData, tableDataParties: tableDataParties});

    }

    async btnTapped() {
        const {code } = this.state;
        //this.setState({code: "6f7feefa-d717-4f63-9a15-97fa09c67c1f"});
        //let code =  "6f7feefa-d717-4f63-9a15-97fa09c67c1f";
        const response = await fetch("http://localhost:3000/votingcode/" + code );
        const res = await response.json();
        console.log(res);
        if (res.status === 'OK') {
            this.setState({wahlkreis: res.WahlkreisID});
        }
    }

    handleStimmenAuswahl = (title, selection) => {
        if (title === "Erststimme")
            erststimmenselection = selection;
        else zweitstimmenselection = selection;
    }

   async sendingVoteToBackend () {
        const {code } = this.state;
        var json = '{ "ErststimmenAuswahl": [' +
            erststimmenselection.map(kandidat => '"' + kandidat.kandidatid + '"').join(",") + '], "ZweitstimmenAuswahl" : [' +
            zweitstimmenselection.map(partei => '"' + partei.name + '"').join(",") + '], "code" : "' + code + '" }' ;
       const voteresult =  await fetch('http://localhost:3000/vote', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: json
        });
       console.log(voteresult);
       const response = await voteresult.json();
       if (response.status === "OK") {
           this.setState({voted: true});
       }
        alert(response + "test");
    }

    handleChange = (votingcode) => {
       this.setState({code : votingcode.target.value}) ;
    }

    render() {

        const {tableData, tableDataParties, wahlkreis, voted} = this.state;

        if (voted) {
            return (
                <Paper>
                    <h1>Sie haben Ihre Stimme im Wahlkreis {wahlkreis} erfolgreich abgegeben.</h1>
                    </Paper>
            )
        }

        if (wahlkreis === -1) {
            return (
                <div>
                    <input type="text" onChange={this.handleChange}/>
                    <button onClick={this.btnTapped}>Check Code</button>
                </div>
            )
        }
        else return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Paper>
                        <h1>Sie wählen im Wahlkreis {wahlkreis} </h1>
                        <h2>Sie haben 2 Stimmen. Choose wisely.</h2>
                    </Paper>
                </Grid>
                <Grid item xs={8} width="stretch">
                    <Paper>
                        {tableData != undefined &&
                        <EnhancedTable data={tableData} title="Erststimme"
                                       onSelectionChange={this.handleStimmenAuswahl}/>}
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper>
                        <EnhancedTable data={tableDataParties} title="Zweitstimme"
                                       onSelectionChange={this.handleStimmenAuswahl}/>
                    </Paper>
                </Grid>
                <button onClick={this.sendingVoteToBackend}> Wählen!</button>
            </Grid>
        )
    }
}

export default Vote;