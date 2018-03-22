import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import merge from 'lodash/merge';
import sum from 'lodash/sum';
import shallowEqual from 'shallowequal';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import {addEventListener, debounce} from './Utils';
import {create, Provider} from './mini-store';

import './styles/table.less';

class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columnManager = new ColumnManager(props.columns);
    this.lastScrollTop = 0;
    this.store = create({
      currentHoverKey: null,
      hasScroll: false,
      fixedColumnsHeadRowsHeight: [],
      ...this.resetBodyHeight()
    });
    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        saveRef: this.saveRef,
        columnManager: this.columnManager,
        components: merge({
          table: 'div',
          header: {
            wrapper: 'div',
            row: 'div',
            cell: 'div'
          },
          body: {
            wrapper: 'div',
            row: 'div',
            cell: 'div'
          }
        }, this.props.components)
      }
    }
  }

  componentWillMount() {
    this.timer = (new Date()).getTime();

  }

  componentDidMount() {
    this.handleWindowResize();
    this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
    let n = (new Date()).getTime();
    console.log('table render time -> ', n - this.timer);
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.store.setState({
        fixedColumnsBodyRowsHeight: this.resetBodyHeight()
      });
    }
  }

  handleWindowResize = () => {
    setTimeout(() => {
      this.syncFixedTableRowHeight();
    });
  };

  syncFixedTableRowHeight = () => {
    const tableRect = this['tableNode'].getBoundingClientRect();
    if (tableRect.height !== undefined && tableRect.height <= 0) {
      return;
    }
    const headRows = this['headTable'] ?
      this['headTable'].querySelectorAll('.thead') :
      this['bodyTable'].querySelectorAll('.thead');
    const fixedColumnsHeadRowsHeight = [].map.call(
      headRows, row => row.getBoundingClientRect().height || 'auto'
    );
    const {fixedColumnsBodyRowsHeight, tops} = this.resetBodyHeight();
    const state = this.store.getState();
    if (shallowEqual(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
      shallowEqual(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
      return;
    }

    const totalHeight = sum(fixedColumnsBodyRowsHeight);

    const hasScroll = this['bodyTable'].getBoundingClientRect().height < totalHeight;
    this.store.setState({
      hasScroll,
      fixedColumnsHeadRowsHeight,
      tops,
      ...this.resetRenderInterval(0, this['bodyTable'].clientHeight, totalHeight, fixedColumnsBodyRowsHeight)
    });
  };

  handleBodyScroll = (e) => {
    const target = e.target;
    if (this.lastScrollTop !== target.scrollTop && target !== this['headTabl']) {
      const result = this.resetRenderInterval(target.scrollTop, target.clientHeight, target.scrollHeight);
      this.store.setState(result);
    }
    this.lastScrollTop = target.scrollTop;
  };

  resetBodyHeight = () => {
    const {dataSource, getRowHeight, rowHeight} = this.props;
    let tops = [], top = 0;
    const fixedColumnsBodyRowsHeight = dataSource.map((record, index) => {
      const height = getRowHeight(record, index) * rowHeight + 1;
      tops.push(top);
      top += height;
      return height;
    });
    return {fixedColumnsBodyRowsHeight, tops};
  };

  resetRenderInterval = (scrollTop, clientHeight, scrollHeight, fixedColumnsBodyRowsHeight) => {
    if (!fixedColumnsBodyRowsHeight) {
      const state = this.store.getState();
      fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
    }
    let start = 0, end = 0, top = 0, isStart = false, isEnd = false;
    for (let index = 0; index < fixedColumnsBodyRowsHeight.length; index++) {
      const height = fixedColumnsBodyRowsHeight[index];
      if (top + height >= scrollTop && !isStart) {
        start = index;
        isStart = true;
      } else if (top > scrollTop + clientHeight && !isEnd) {
        end = index;
        isEnd = true;
        break;
      }
      top += height;
    }
    if (scrollTop <= 31) {
      start = 0;
    }
    if (scrollTop + clientHeight >= scrollHeight - 31) {
      end = fixedColumnsBodyRowsHeight.length - 1;
    }
    return {
      renderStart: start,
      renderEnd: end
    };
  };

  saveRef = (name) => (node) => {
    this[name] = node;
  };

  getClassName = () => {
    const {prefixCls, className, fixedHeader, bordered} = this.props;
    return classNames(
      prefixCls,
      className,
      {
        [`${prefixCls}-fixed-header`]: fixedHeader,
        'bordered': bordered
      }
    );
  };

  getRowKey = (record, index) => {
    const rowKey = this.props.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    } else if (typeof rowKey === 'string') {
      return record[rowKey];
    }
    return index;
  };

  renderTable = (options) => {
    const {columns, fixed} = options;
    const headTable = (
      <HeadTable
        key='head'
        columns={columns}
        fixed={fixed}
      />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        columns={columns}
        fixed={fixed}
        getRowKey={this.getRowKey}
        handleBodyScroll={this.handleBodyScroll}
      />
    );
    return [headTable, bodyTable];
  };

  renderMainTable = () => {
    const table = this.renderTable({
      columns: this.columnManager.groupedColumns()
    });
    return table;
  };

  render() {
    const {prefixCls} = this.props;
    console.log('table render ');
    return (
      <Provider store={this.store}>
        <div className={`${prefixCls}-wrapper`}>
          <div
            className={this.getClassName()}
            ref={this.saveRef('tableNode')}
          >
            {this.renderMainTable()}
          </div>
        </div>
      </Provider>
    )
  }
}

export default Table;

Table.propTypes = {
  prefixCls: PropTypes.string,
  columns: PropTypes.array,
  dataSource: PropTypes.array,

  className: PropTypes.string,

  showHeader: PropTypes.bool,
  bordered: PropTypes.bool,
  fixedHeader: PropTypes.bool,

  rowRef: PropTypes.func,
  getRowHeight: PropTypes.func,

  rowHeight: PropTypes.number
};

Table.defaultProps = {
  prefixCls: 'vt',
  columns: [],
  dataSource: [],

  showHeader: true,
  bordered: false,
  fixedHeader: true,

  rowRef: () => null,
  getRowHeight: () => 1,

  rowHeight: 30
};

Table.childContextTypes = {
  table: PropTypes.any
};
