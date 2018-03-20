import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

class TableCell extends React.PureComponent {
  isInvalidRenderCellText = (text) => {
    return text
      && !React.isValidElement(text)
      && Object.prototype.toString.call(text) === '[object Object]';
  };

  render() {
    const {
      record,
      indentSize,
      prefixCls,
      indent,
      index,
      column,
      component: BodyCell
    } = this.props;
    const {dataIndex, render, className = ''} = column;
    let text;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps = {}, colSpan, rowSpan;
    if (render) {
      text = render(text, record, index);
      if (this.isInvalidRenderCellText(text)) {
        tdProps = text.props || tdProps;
        colSpan = tdProps.colSpan;
        rowSpan = tdProps.rowSpan;
        text = text.children;
      }
    }
    if (column.onCell) {
      tdProps = {...tdProps, ...column.onCell(record)};
    }
    if (this.isInvalidRenderCellText(text)) {
      text = null;
    }
    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    if (column.align) {
      tdProps.style = {textAlign: column.align};
    }
    let style = tdProps.style || {};
    if (column.width) {
      style.width = column.width;
      style.minWidth = column.width;
      style.maxWidth = column.width;
      style.overflow = 'hidden';
    } else {
      style.flex = 1;
    }
    tdProps.style = style;
    return (
      <BodyCell
        className={className}
        {...tdProps}
      >
        {text}
      </BodyCell>
    )
  }
}

export default TableCell;

TableCell.propTypes = {
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  index: PropTypes.number,
  indent: PropTypes.number,
  indentSize: PropTypes.number,
  column: PropTypes.object,
  component: PropTypes.any
};
