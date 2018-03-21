import React from 'react';
import PropTypes from 'prop-types';
import sum from 'lodash/sum';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

class BaseTable extends React.PureComponent {
  renderRows = (datas) => {
    this.timer = (new Date()).getTime();
    const rows = [];
    const {
      getRowKey,
      fixed,
      renderStart,
      renderEnd
    } = this.props;
    const table = this.context.table;
    const {
      prefixCls,
      rowRef,
      getRowHeight,
      rowHeight
    } = table.props;
    const columnManager = table.columnManager;
    datas.forEach((record, i) => {
      if (i < renderStart || i > renderEnd) {
        return;
      }
      let leafColumns;
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = columnManager.leafColumns();
      }
      const key = getRowKey(record, i);
      const row = (
        <TableRow
          key={key}
          rowKey={key}
          record={record}
          index={i}
          fixed={fixed}
          columns={leafColumns}
          ref={rowRef(record, i)}
          components={table.components}
          prefixCls={prefixCls}
          height={getRowHeight(record, i) * rowHeight}
        />
      );
      rows.push(row);
    });
    let n = (new Date()).getTime();
    console.log('render cells time -> ', n - this.timer);
    return rows;
  };

  render() {
    const {hasHead, hasBody, columns, fixed, height} = this.props;
    const table = this.context.table;
    const components = table.components;
    let body;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height}}>
          {this.renderRows(table.props.dataSource)}
        </BodyWrapper>
      )
    }
    console.log('base table render');
    return (
      <div className='table'>
        {hasHead && <TableHeader columns={columns} fixed={fixed}/>}
        {body}
      </div>
    )
  }
}

export default connect((state) => {
  const {hasScroll, fixedColumnsBodyRowsHeight, renderStart, renderEnd} = state;
  return {
    hasScroll,
    height: sum(fixedColumnsBodyRowsHeight),
    renderStart,
    renderEnd
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
