import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from './utils/mini-store';
import TableCell from './TableCell';
import sum from 'lodash/sum';

class TableRow extends React.PureComponent {
  onRowClick = () => {

  };

  render() {
    const {
      components,
      columns,
      height,
      top,
      hovered,
      prefixCls,
      className,
      indent,
      visible,
      onRow,
      record,
      index,
      indentSize
    } = this.props;
    const BodyRow = components.body.row;
    const BodyCell = components.body.cell;

    const cells = [];

    columns.forEach((column, i) => {
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={column}
          style={{width: column.width, minWidth: column.width, maxWidth: column.width}}
          key={column.key || column.dataIndex}
          component={BodyCell}
        />
      )
    });
    const rowCLassName = classNames(
      prefixCls,
      className,
      {
        [`${prefixCls}-hover`]: hovered
      });
    const rowProps = onRow(record, index);
    const customStyle = rowProps ? rowProps.style : {};
    let style = {height, width: 1700, top};
    if (!visible) {
      style.display = 'none';
    }
    style = {...style, ...customStyle};
    return (
      <BodyRow
        onClick={this.onRowClick}
        className={rowCLassName}
        style={style}
      >
        {cells}
      </BodyRow>
    )
  }
}

function getRowHeight(state, props) {
  const {fixedColumnsBodyRowsHeight} = state;
  const {index} = props;
  if (fixedColumnsBodyRowsHeight[index]) {
    return fixedColumnsBodyRowsHeight[index];
  }

  return null;
}

function getRowTop(state, props) {
  const {fixedColumnsBodyRowsHeight} = state;
  const {index} = props;
  let before = fixedColumnsBodyRowsHeight.slice(0, index);
  return sum(before);
}

export default connect((state, props) => {
  const {currentHoverKey} = state;
  const {rowKey} = props;
  return {
    visible: true,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
    top: getRowTop(state, props)
  }
})(TableRow);

TableRow.propTypes = {
  onRow: PropTypes.func,
  onRowClick: PropTypes.func,
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  onHover: PropTypes.func,
  columns: PropTypes.array,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  index: PropTypes.number,
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  className: PropTypes.string,
  indent: PropTypes.number,
  hovered: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  fixed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  isAnyColumnsFixed: PropTypes.bool
};
TableRow.defaultProps = {
  onRow() {
  },
  onHover() {
  }
};
