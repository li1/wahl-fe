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


export class Vote extends React.Component {

    constructor (props) {
        super(props);
        this.state = { tableData: [], tableDataParties: [] };
    }

    async componentDidMount () {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/1");
        const parteien = await fetch("http://localhost:3000/wahlkreisparteien/1");
        const tableDataParties = await parteien.json();
        const tableData = await kandidaten.json();
        this.setState({tableData: tableData, tableDataParties: tableDataParties});

    }


    render () {
            const { tableData, tableDataParties } = this.state;

        return (
        <div>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Paper >Sie haben zwei Stimmen</Paper>
                </Grid>
                <Grid item xs={8} width="stretch">
                    <Paper >
                        {tableData != undefined &&
                        <EnhancedTable data={tableData} title="Erststimme"/> }
                    </Paper>
                </Grid>
                <Grid item xs={3} >
                    <Paper >
                        <EnhancedTable data={tableDataParties} title="Zweitstimme"/>
                    </Paper>
                </Grid>

            </Grid>


        </div>
        );



    }
}

export default Vote;