import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
  } from "@material-ui/core";
  
  import React from "react";
  
  export default function SortableTableHead({
    mode,
    classes,
    order,
    orderBy,
    onRequestSort,
    columns,
  }) {
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.key}
              align={column.align || "left"}
              padding={column.disablePadding ? "none" : "default"}
              // variant="head"
              sortDirection={orderBy === column.key ? order : false}
              style={{color: mode === 'dark' ? 'white' : 'black'}}
            >
              <TableSortLabel
                active={orderBy === column.key}
                direction={orderBy === column.key ? order : "asc"}
                onClick={createSortHandler(column.key)}
                style={{color: mode === 'dark' ? 'white' : 'black'}}
              >
                {column.label}
  
                {orderBy === column.key ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  