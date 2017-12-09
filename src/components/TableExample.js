import React from "react";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Paper from "material-ui/Paper";
import Checkbox from "material-ui/Checkbox";


const EnhancedTableHead = props => {
  const capitalizedHeaders = props.columnData.length > 0 ? 
    Object.keys(props.columnData[0]).map(title => title.capitalize()) : [];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {capitalizedHeaders.map((column, idx) => (
          (column !== "Id") &&
            <TableCell key={idx}>
              {column}
            </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      data: props.data,
      title: ""
    };
  }

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  componentWillReceiveProps(nextProps) {
    nextProps.data.forEach((row, idx) => row["id"] = idx);
    this.setState({
      data: nextProps.data,
      title: nextProps.title,
      selected: []
    });
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {
      data,
      title
    } = this.state;

    return (
      <Paper>
        <Toolbar>
          <Typography type="title">{title}</Typography>
        </Toolbar>
        <div>
          <Table>
            <EnhancedTableHead columnData={data} />
            <TableBody>
              {data
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  var cells = [];
                  Object.keys(n).forEach(key => {
                    if (key !== "id") {
                      cells.push(<TableCell key={key}>{n[key]}</TableCell>);
                    }
                  });

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>

                      {cells}
                    </TableRow>
                  );
                })}

            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

export default EnhancedTable;
