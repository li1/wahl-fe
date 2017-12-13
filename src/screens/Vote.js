import React, { Component } from 'react';
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

export class Vote extends React.Component {

    constructor (props) {
        super(props);
        this.state = { tableData: [], tableDataParties: [], wahlkreis : -1, input: "" };
        this.btnTapped = this.btnTapped.bind(this);
    }

    async componentDidMount () {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/1");
        const parteien = await fetch("http://localhost:3000/wahlkreisparteien/1");
        const tableDataParties = await parteien.json();
        const tableData = await kandidaten.json();

        this.setState({tableData: tableData, tableDataParties: tableDataParties});

    }

    async btnTapped() {
        console.log('tapped');
        const response = await fetch("http://localhost:3000/votingcode/" + "6f7feefa-d717-4f63-9a15-97fa09c67c1f");
        const res = await response.json();
        console.log(res);
        if (res.status === 'OK') {
            this.setState({wahlkreis: res.WahlkreisID});

        }
    }

    render () {

        const {tableData, tableDataParties, wahlkreis} = this.state;

        if (wahlkreis === -1) {
            return (
                <div>
                    < input type="text" onChange={this.handleChange}/>
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
                        <EnhancedTable data={tableData} title="Erststimme"/>}
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper>
                        <EnhancedTable data={tableDataParties} title="Zweitstimme"/>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
export default Vote;