import React, { Component } from 'react';
import PropTypes from "prop-types";
import _ from "lodash";

import Table, 
       { TableBody, 
         TableFooter,
         TableCell, 
         TableHead, 
         TableRow,
         TablePagination,
         TableSortLabel } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


const EnhancedTableHead = ({onRequestSort, headers, order, orderBy, isHeaderNumeric}) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map((header, idx) => (
          <TableCell key={idx} numeric={ isHeaderNumeric(header) }>
            <TableSortLabel
             active={ orderBy === header }
             direction={ order }
             onClick={ createSortHandler(header) } >
              {header.capitalize()}
            </TableSortLabel>
          </TableCell>
        ), this) }
      </TableRow>
    </TableHead>
  );
}


class SortableTable extends Component {
  static propTypes = {
  tableData: PropTypes.array.isRequired,

  rowsPerPage: PropTypes.array,
  labelRowsPerPage: PropTypes.string
  };

  static defaultProps = {
  rowsPerPage: [10, 25, 50, 100],
  labelRowsPerPage: "Ergebnisse pro Seite:"
  };


  calculateHeaders = tableData => Object.keys(_.omit(tableData[0], "id"));

  prepareData = data => data.map((datom, idx) => _.assign(datom, {id: idx}));

  constructor (props) {
    super(props);

    this.numericHeaders = Object.keys(_.pickBy(props.tableData[0], 
      columnVal => !isNaN(parseFloat(columnVal))));

    this.state = { tableData: this.prepareData(props.tableData),
                   headers: this.calculateHeaders(props.tableData),
                   rowsPerPage: this.props.rowsPerPage[0],
                   order: "asc",
                   page: 0,
                   orderBy: null };
  }

  isHeaderNumeric = header => _.find(this.numericHeaders, q => header === q) !== undefined;

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const tableData =
      order === 'desc'
        ? this.state.tableData.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.tableData.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ tableData, order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render () {
    const { tableData, headers, rowsPerPage, order, page, orderBy } = this.state;

    const slicedTableData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Paper>
        <Table>
          <EnhancedTableHead 
            headers={ headers }
            order={ order } 
            orderBy={ orderBy } 
            isHeaderNumeric={ this.isHeaderNumeric }
            onRequestSort={ this.handleRequestSort } />
          <TableBody>
            { slicedTableData.map(row => (
              <TableRow key={row.id}>
                {headers.map((header, idx) => (
                  <TableCell key={idx} numeric={ this.isHeaderNumeric(header) }>
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={ tableData.length }
                rowsPerPage={ rowsPerPage }
                rowsPerPageOptions={ this.props.rowsPerPage }
                labelRowsPerPage={ this.props.labelRowsPerPage }
                page={ page }
                onChangePage={ this.handleChangePage }
                onChangeRowsPerPage={ this.handleChangeRowsPerPage }/>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

export default SortableTable;
