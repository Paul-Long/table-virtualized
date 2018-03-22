import React from 'react';
import PropTypes from 'prop-types';
import sum from 'lodash/sum';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

class BaseTable extends React.PureComponent {
  componentWillMount() {
    this.timer = (new Date()).getTime();
  }

  componentDidMount() {
    let n = (new Date()).getTime();
    console.log('base table render time -> ', n - this.timer);
  }

  renderRows = (datas) => {
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
    console.log(renderStart, renderEnd);
    datas.forEach((record, i) => {
      if (i >= renderStart && i <= renderEnd) {
        let leafColumns;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = columnManager.leafColumns();
        }
        const key = getRowKey(record, i);
        const props = {
          key,
          record,
          fixed,
          prefixCls,
          rowKey: key,
          index: i,
          columns: leafColumns,
          ref: rowRef(record, i),
          components: table.components,
          height: getRowHeight(record, i) * rowHeight
        };
        rows.push(<TableRow {...props} />);
      }
    });
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
    fixedColumnsBodyRowsHeight,
    renderStart,
    renderEnd
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
