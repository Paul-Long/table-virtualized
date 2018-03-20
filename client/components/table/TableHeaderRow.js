import React from 'react';
import {connect} from './utils/mini-store';

function TableHeaderRow({row, index, height, components, onHeaderRow}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const rowProps = onHeaderRow(row.map(cell => cell.column), index);
  const customStyle = rowProps ? rowProps.style : {};
  const style = {height, ...customStyle};
  return (
    <HeaderRow {...rowProps} style={style}>
      {
        row.map((cell, i) => {
          const {column, ...cellProps} = cell;
          const customProps = column.onHeaderCell ? column.onHeaderCell(column) : {};
          if (column.align) {
            cellProps.style = {textAlign: column.dataIndex || i};
          }
          if (column.width) {
            let style = cellProps.style || {};
            style.width = column.width;
            style.minWidth = column.width;
            style.maxWidth = column.width;
            style.overflow = 'hidden';
            cellProps.style = style;
          }
          return (
            <HeaderCell
              {...cellProps}
              {...customProps}
              key={column.key || column.dataIndex || i}
            />
          )
        })
      }
    </HeaderRow>
  )
}

function getRowHeight(state, props) {
  const {fixedColumnsHeadRowsHeight} = state;
  const {columns, rows, fixed} = props;
  const headerHeight = fixedColumnsHeadRowsHeight[0];
  if (!fixed) {
    return null;
  }
  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return headerHeight / rows.length;
  }
  return null;
}

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props)
  }
})(TableHeaderRow);
