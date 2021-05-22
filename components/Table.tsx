import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table as MuiTable } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Table({ columns, data }) {
  return (
    <TableContainer component={Paper}>
      <MuiTable size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell key={i} align={i !== 0 ? "right" : "inherit"}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {row.map((r, i) => (
                <TableCell key={i} align={i !== 0 ? "right" : "inherit"}>
                  {r}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
