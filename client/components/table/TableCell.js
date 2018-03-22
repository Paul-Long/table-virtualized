import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
      index,
      column,
      component: BodyCell,
      height
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
    } else {
      style.flex = 1;
    }
    style.height = height;
    style.lineHeight = `${height}px`;
    tdProps.style = style;
    return (
      <BodyCell
        className={classNames(className, 'td')}
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
