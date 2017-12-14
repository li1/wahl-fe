import React, {Component} from 'react';
import { withRouter } from 'react-router'

import Grid from 'material-ui/Grid';

import Typography from 'material-ui/Typography';
import EnhancedTable from '../components/TableExample';

let erststimmenselection = [];
let zweitstimmenselection = [];

export class Vote extends Component {

    constructor(props) {
        super(props);
        this.state = {tableData: [], tableDataParties: [], wahlkreis: -1, input: "", voted: false, invalidCode: false};
        this.btnTapped = this.btnTapped.bind(this);
        this.sendingVoteToBackend = this.sendingVoteToBackend.bind(this);
    }

    async setstatus(wahlkreis) {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/" + wahlkreis);
        const parteien = await fetch("http://localhost:3000/wahlkreisparteien/" + wahlkreis);
        const tableDataParties = await parteien.json();
        const tableData = await kandidaten.json();

        this.setState({tableData: tableData, tableDataParties: tableDataParties});

    }

    async btnTapped() {
        const {code} = this.state;
        const response = await fetch("http://localhost:3000/votingcode/" + code);
        const res = await response.json();
        console.log(res);
        if (res.status === 'OK') {
            this.setState({wahlkreis: res.WahlkreisID});
        }
        else (this.setState({invalidCode: true}));
        await this.setstatus(res.WahlkreisID);
    }

    handleStimmenAuswahl = (title, selection) => {
        if (title === "Erststimme")
            erststimmenselection = selection;
        else zweitstimmenselection = selection;
    }

    async sendingVoteToBackend() {
        const {code} = this.state;
        var json = '{ "ErststimmenAuswahl": [' +
            erststimmenselection.map(kandidat => '"' + kandidat.kandidatid + '"').join(",") + '], "ZweitstimmenAuswahl" : [' +
            zweitstimmenselection.map(partei => '"' + partei.name + '"').join(",") + '], "code" : "' + code + '" }';
        const voteresult = await fetch('http://localhost:3000/vote', {
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
        this.setState({code: votingcode.target.value});
    }

    render() {


        const {tableData, tableDataParties, wahlkreis, voted, invalidCode} = this.state;

        if (voted) {
            return (
                <div>
                    <Paper>
                        <h1>Sie haben Ihre Stimme im Wahlkreis {wahlkreis} erfolgreich abgegeben.</h1>
                    </Paper>
                </div>
            )
        }

        if (wahlkreis === -1) {
            return (
                <div>
                    <Grid item md={3} />
                    <Grid item xs={12} md={4}>
                        <Paper>
                            <input type="text" onChange={this.handleChange}/>
                            <button onClick={this.btnTapped}>Check Code</button>
                            {invalidCode && <h3>Invalid Code</h3>}
                        </Paper>
                    </Grid>
                    <Grid item md={3} />
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