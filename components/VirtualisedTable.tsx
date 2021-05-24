import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";
import { RowClickEvent } from "../types";
import { rowDataState } from "../atoms/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

declare module "@material-ui/core/styles/withStyles" {
  // Augment the BaseCSSProperties so that we can control jss-rtl
  interface BaseCSSProperties {
    /*
     * Used to control if the rule-set should be affected by rtl transformation
     */
    flip?: boolean;
  }
}

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      margin: 0,
      fontSize: 12,
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
      },
    },
    tableRow: {
      cursor: "pointer",
      // border: "1px solid transparent",
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: "#e3f3ff",
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: "initial",
    },
    tableHeader: {
      borderBottom: "1px solid rgb(229, 231, 235)",
      margin: 0,
      fontWeight: "bold",
    },
    scrollbar: {},
  });

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: (e: RowClickEvent) => void;
  rowCount: number;
  rowGetter: (row: Row) => any;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 42,
    rowHeight: 36,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index != -1 && onRowClick == null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }>
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick,
          classes.tableHeader
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}>
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      onRowClick,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight!}
            className={clsx(classes.table)}
            {...tableProps}
            onRowClick={(e) => onRowClick(e)}
            rowClassName={this.getRowClassName}>
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export default function ReactVirtualizedTable({ cols, rows }) {
  const setRowDataState = useSetRecoilState(rowDataState);
  const selectedRowData = useRecoilValue(rowDataState);
  const [highlightedRow, setHighlightedRow] = useState<HTMLElement>(null);

  useEffect(() => {
    // Deselect row when clearing form
    if (Object.keys(selectedRowData).length == 0 && highlightedRow != null) {
      highlightedRow.classList.remove("table-row-selected");
      setHighlightedRow(null);
    }
  }, [selectedRowData]);

  const onRowClick = (e: RowClickEvent) => {
    const rowElement = e.event.target.parentNode.parentNode;

    if (highlightedRow !== null) {
      highlightedRow.classList.remove("table-row-selected");
    }

    setRowDataState(e.rowData);
    setHighlightedRow(rowElement);

    rowElement.classList.add("table-row-selected");
  };

  const hydrateColumns = (cols): ColumnData[] => {
    const maxWidth = 1100 - 40;

    let out = [];
    for (let i = 0; i < cols.length; i++) {
      const width = i == 0 ? 40 : maxWidth / (cols.length - 1);
      out.push({ width: width, label: cols[i], dataKey: cols[i] });
    }
    return out;
  };

  return (
    <VirtualizedTable
      rowCount={rows.length}
      rowGetter={({ index }) => rows[index]}
      columns={hydrateColumns(cols)}
      onRowClick={onRowClick}
    />
  );
}
