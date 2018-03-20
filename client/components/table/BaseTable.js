import React from 'react';
import PropTypes from 'prop-types';
import {connect} from './utils/mini-store';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import sum from 'lodash/sum';
import slice from 'lodash/slice';

class BaseTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastStartIndex = props.startIndex || 0;
  }
  renderRows = (renderData, indent) => {
    const {table} = this.context;
    const {columnManager, components} = table;
    const {
      prefixCls,
      childrenColumnName,
      rowClassName,
      rowRef,
      onRowClick,
      onRow
    } = table.props;
    const {getRowKey, fixed, isAnyColumnsFixed} = this.props;
    const rows = [];
    renderData.forEach((record, i) => {
      let ren = false;
      if (this.lastStartIndex > this.props.startIndex) {
        ren = i >= this.props.startIndex - 10 && i - this.props.startIndex < 20;
      } else {
        ren = i >= this.props.startIndex && i - this.props.startIndex < 20;
      }
      this.lastStartIndex = this.props.startIndex;
      if (ren) {
        const key = getRowKey(record, i);
        const className = typeof rowClassName === 'string'
          ? rowClassName
          : rowClassName(record, i, indent);
        const onHoverProps = {};
        if (columnManager.isAnyColumnsFixed()) {
          onHoverProps.onHover = (isHover, key) => {
            this.props.store.setState({ currentHoverKey: isHover ? key : null });
          }
        }
        let leafColumns;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = columnManager.leafColumns();
        }
        const rowPrefixCls = `${prefixCls}-row`;
        const row = (<TableRow
          key={key}
          fixed={fixed}
          indent={indent}
          className={className}
          record={record}
          index={i}
          prefixCls={rowPrefixCls}
          childrenColumnName={childrenColumnName}
          columns={leafColumns}
          onRow={onRow}
          {...onHoverProps}
          rowKey={key}
          components={components}
          ref={rowRef(record, i, indent)}
          isAnyColumnsFixed={isAnyColumnsFixed}/>);
        rows.push(row)
      }
    });
    return rows;
  };

  render() {
    const {table} = this.context;
    const {components} = table;
    const {prefixCls, scroll, getBodyWrapper, data} = table.props;
    const {
      tableClassName,
      hasHead,
      hasBody,
      fixed,
      columns,
      bodyHeight
    } = this.props;

    let tableStyle = {};
    if (!fixed && scroll.x) {
      if (scroll.x === true) {
        tableStyle.tableLayout = 'fixed';
      } else {
        tableStyle.width = scroll.x;
      }
    }

    const Table = hasBody ? components.table : 'table'; 
    const BodyWrapper = components.body.wrapper;
    let body;
    if (hasBody) {
      tableStyle.height = bodyHeight;
      body = (
        <BodyWrapper className={`${prefixCls}-tbody`}>
          {this.renderRows(data, 0)}
        </BodyWrapper>
      );
      if (getBodyWrapper) {
        body = getBodyWrapper(body);
      }
    }
    return (
      <Table className={tableClassName} style={tableStyle} key='table'>
        <ColGroup columns={columns} fixed={fixed}/> 
        {hasHead && <TableHeader columns={columns} fixed={fixed}/>}
        {body}
      </Table>
    )
  }
}

export default connect((state, props) => {
  const {fixedColumnsBodyRowsHeight, startIndex} = state;
  return {bodyHeight: sum(fixedColumnsBodyRowsHeight), startIndex}
})(BaseTable);
BaseTable.contextTypes = {
  table: PropTypes.any
};
