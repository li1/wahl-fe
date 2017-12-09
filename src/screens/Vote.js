import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import SortableTable from "../components/SortableTable";

import Typography from 'material-ui/Typography';

import EnhancedTable from '../components/TableExample';

const style = {
    margin: 12,
};

const TableExampleSimple = () => (
    ""
);

export class Vote extends React.Component {

    constructor (props) {
        super(props);
        this.state = { tableData: [] };
    }

    async componentDidMount () {
        const kandidaten = await fetch("http://localhost:3000/wahlkreisdirektkandidaten/255");

        const tableData = await kandidaten.json();
        this.setState({tableData: tableData});

    }


    render () {
            const { tableData } = this.state;

        return (
        <div>

            {tableData != undefined &&
            <EnhancedTable data={tableData}/> }
        </div>
        )

    }
}

export default Vote;