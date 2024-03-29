import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Table, {
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from "material-ui/Table";
import Paper from "material-ui/Paper";

const EnhancedTableHead = ({
  onRequestSort,
  headers,
  order,
  orderBy,
  isHeaderNumeric
}) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(
          (header, idx) => (
            <TableCell key={idx} numeric={isHeaderNumeric(header)}>
              <TableSortLabel
                active={orderBy === header}
                direction={order}
                onClick={createSortHandler(header)}>
                {header.capitalize()}
              </TableSortLabel>
            </TableCell>
          ),
          this
        )}
      </TableRow>
    </TableHead>
  );
};

const cellStyle = (header, style, content) => {
  if (style && style[header]) {
    return content >= 0 ? style[header].pos : style[header].neg;
  } else {
    return {};
  }
};

class SortableTable extends Component {
  static propTypes = {
    tableData: PropTypes.array.isRequired,

    rowsPerPage: PropTypes.array,
    labelRowsPerPage: PropTypes.string,
    showFooter: PropTypes.bool,
    selectHandler: PropTypes.func,

    cellStyles: PropTypes.object,
    orderBy: PropTypes.string
  };

  static defaultProps = {
    rowsPerPage: [10, 25, 50, 100],
    labelRowsPerPage: "Ergebnisse pro Seite:",
    showFooter: true,
    selectHandler: null,
    cellStyles: null,
    orderBy: null
  };

  calculateHeaders = tableData => Object.keys(_.omit(tableData[0], "id"));

  prepareData = (data, orderBy) => {
    let preparedData = data.map((datom, idx) => _.assign(datom, { id: idx }));

    if (orderBy) {
      preparedData = preparedData.sort(
        (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
      );
    }

    return preparedData;
  };

  calculateNumericHeaders = row =>
    Object.keys(_.pickBy(row, columnVal => !isNaN(parseFloat(columnVal))));

  constructor(props) {
    super(props);

    //@TODO: Recalculate when data updates?
    this.numericHeaders = this.calculateNumericHeaders(props.tableData[0]);

    this.state = {
      tableData: this.prepareData(props.tableData, props.orderBy),
      headers: this.calculateHeaders(props.tableData),
      rowsPerPage: this.props.rowsPerPage[0],
      order: this.props.orderDir,
      page: 0,
      orderBy: props.orderBy
    };
    // selectedRow: null };
  }

  componentWillReceiveProps(nextProps) {
    this.numericHeaders = this.calculateNumericHeaders(nextProps.tableData[0]);

    this.setState({
      tableData: this.prepareData(nextProps.tableData, nextProps.orderBy),
      headers: this.calculateHeaders(nextProps.tableData)
    });
  }

  isHeaderNumeric = header =>
    _.find(this.numericHeaders, q => header === q) !== undefined;

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const tableData =
      order === "desc"
        ? this.state.tableData.sort(
            (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
          )
        : this.state.tableData.sort(
            (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
          );

    this.setState({ tableData, order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {
      tableData,
      headers,
      rowsPerPage,
      order,
      page,
      orderBy
    } = this.state;
    const { showFooter, selectHandler, cellStyles } = this.props;

    const slicedTableData = tableData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Paper>
        <Table>
          <EnhancedTableHead
            headers={headers}
            order={order}
            orderBy={orderBy}
            isHeaderNumeric={this.isHeaderNumeric}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {slicedTableData.map(row => (
              <TableRow
                hover={selectHandler && true}
                key={row.id}
                onClick={selectHandler && (e => selectHandler(row))}>
                {headers.map((header, idx) => (
                  <TableCell
                    key={idx}
                    numeric={this.isHeaderNumeric(header)}
                    style={cellStyle(header, cellStyles, row[header])}>
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {showFooter && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={this.props.rowsPerPage}
                  labelRowsPerPage={this.props.labelRowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Paper>
    );
  }
}

export default SortableTable;
