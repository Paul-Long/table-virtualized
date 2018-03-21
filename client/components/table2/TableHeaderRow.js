import React from 'react';

function TableHeaderRow({row, index, height, components}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  return (
    <HeaderRow className='tr'>
      {row.map((cell, i) => {
        const {column, ...cellProps} = cell;
        cellProps.style = Object.assign({}, cellProps.style);
        if (column.align) {
          cellProps.style = {textAlign: column.dataIndex || i};
        }
        if (column.width) {
          let style = cellProps.style || {};
          style.width = column.width;
          cellProps.style = style;
        } else {
          cellProps.style.flex = 1;
        }
        return (
          <HeaderCell
            key={column.key || column.dataIndex || i}
            {...cellProps}
            className='th'
          />
        )
      })}
    </HeaderRow>
  )
}

export default TableHeaderRow;
