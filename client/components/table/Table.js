import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import {create, Provider} from './utils/mini-store';
import {addEventListener, debounce} from './Utils';
import classes from 'component-classes';
import merge from 'lodash/merge';
import './style';

class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columnManager = new ColumnManager(props.columns, props.children);
    this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
    });

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        columnManager: this.columnManager,
        saveRef: this.saveRef,
        components: merge({
          table: 'table',
          header: {
            wrapper: 'thead',
            row: 'tr',
            cell: 'th',
          },
          body: {
            wrapper: 'tbody',
            row: 'tr',
            cell: 'td',
          },
        }, this.props.components),
      },
    };
  }

  componentDidMount() {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      if (!this.resizeEvent) {
        this.resizeEvent = addEventListener(
          window, 'resize', this.debouncedWindowResize
        );
      }
    }
    if (prevProps.data.length > 0 && this.props.data.length === 0 && this.hasScrollX()) {
      this.resetScrollX();
    }
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  }

  setScrollPositionClassName() {
    const node = this['bodyTable'];
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight = node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width -
      node.getBoundingClientRect().width;
    if (scrollToLeft && scrollToRight) {
      this.setScrollPosition('both');
    } else if (scrollToLeft) {
      this.setScrollPosition('left');
    } else if (scrollToRight) {
      this.setScrollPosition('right');
    } else if (this.scrollPosition !== 'middle') {
      this.setScrollPosition('middle');
    }
  }

  handleWindowResize = () => {
    this.syncFixedTableRowHeight();
    this.setScrollPositionClassName();
  };

  syncFixedTableRowHeight = () => {
    const tableRect = this['tableNode'].getBoundingClientRect();
    if (tableRect.height !== undefined && tableRect.height <= 0) {
      return;
    }
    const {prefixCls, data, getRowHeight} = this.props;
    const headRows = this['headTable'] ?
      this['headTable'].querySelectorAll('thead') :
      this['bodyTable'].querySelectorAll('thead');
    const fixedColumnsHeadRowsHeight = [].map.call(
      headRows, row => row.getBoundingClientRect().height || 'auto'
    );
    const fixedColumnsBodyRowsHeight = data.map((d, i) => {
      let height = 41;
      if (typeof getRowHeight === 'function') {
        height = getRowHeight(d, i) * 40 + 1;
      }
      return height;
    });
    const state = this.store.getState();
    if (shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
      shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
      return;
    }

    this.store.setState({
      fixedColumnsHeadRowsHeight,
      fixedColumnsBodyRowsHeight,
    });
  };

  resetScrollX() {
    if (this['headTable']) {
      this['headTable'].scrollLeft = 0;
    }
    if (this['bodyTable']) {
      this['bodyTable'].scrollLeft = 0;
    }
  }

  hasScrollX() {
    const {scroll = {}} = this.props;
    return 'x' in scroll;
  }

  handleBodyScrollLeft = (e) => {
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target;
    const {scroll = {}} = this.props;
    const {headTable, bodyTable} = this;
    if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
      if (target === bodyTable && headTable) {
        headTable.scrollLeft = target.scrollLeft;
      } else if (target === headTable && bodyTable) {
        bodyTable.scrollLeft = target.scrollLeft;
      }
      this.setScrollPositionClassName();
    }
    this.lastScrollLeft = target.scrollLeft;
  };

  handleBodyScrollTop = (e) => {
    const target = e.target;
    const {scroll = {}} = this.props;
    const {headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight} = this;
    if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== headTable) {
      const scrollTop = target.scrollTop;
      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollTop = scrollTop;
      }
    }
    const state = this.store.getState();
    const fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
    let sum = 0, index = 0;
    for (let i = 0; i < fixedColumnsBodyRowsHeight.length; i++) {
      sum += fixedColumnsBodyRowsHeight[i];
      if (sum > target.scrollTop) {
        index = i;
        break;
      }
    }
    console.log(index);
    this.lastScrollTop = target.scrollTop;
  };

  handleBodyScroll = (e) => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
  };

  saveRef = (name) => (node) => {
    this[name] = node;
  };

  getRowKey = (record, index) => {
    const rowKey = this.props.rowKey;
    const key = (typeof rowKey === 'function')
      ? rowKey(record, index)
      : record[rowKey];
    return key === undefined ? index : key;
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    if (this['tableNode']) {
      const {prefixCls} = this.props;
      if (position === 'both') {
        classes(this['tableNode'])
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-left`)
          .add(`${prefixCls}-scroll-position-right`);
      } else {
        classes(this['tableNode'])
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-${position}`);
      }
    }
  }

  renderTable = (options) => {
    const {columns, fixed, isAnyColumnsFixed} = options;
    const {prefixCls} = this.props;
    const tableClassName = fixed ? `${prefixCls}-fixed` : '';
    console.log(fixed);
    const headTable = (
      <HeadTable
        key='head'
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        handleBodyScroll={this.handleBodyScrollLeft}
      />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        isAnyColumnsFixed={isAnyColumnsFixed}
        getRowKey={this.getRowKey}
        handleBodyScroll={this.handleBodyScroll}
      />
    );
    return [headTable, bodyTable];
  };
  renderMainTable = () => {
    const {prefixCls, scroll} = this.props;
    const isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
    const scrollable = isAnyColumnsFixed || scroll.x || scroll.y;
    let table = this.renderTable({
      columns: this.columnManager.groupedColumns(),
      isAnyColumnsFixed
    });
    return scrollable
      ? (<div className={`${prefixCls}-scroll`}>{table}</div>)
      : table;
  };
  renderLeftFixedTable = () => {
    const {prefixCls} = this.props;
    return (
      <div className={`${prefixCls}-fixed-left`}>
        {this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: 'left'
        })}
      </div>
    )
  };
  renderRightFixedTable = () => {
    const {prefixCls} = this.props;
    return (
      <div className={`${prefixCls}-fixed-right`}>
        {this.renderTable({
          columns: this.columnManager.rightColumns(),
          fixed: 'right'
        })}
      </div>
    )
  };

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;

    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();

    let className = classNames(
      prefixCls,
      props.className,
      {
        [`${prefixCls}-fixed-header`]: (props.useFixedHeader || (props.scroll && props.scroll.y)),
        'bordered': props.bordered,
        [`${prefixCls}-scroll-position-left`]: this.scrollPosition === 'both',
        [`${prefixCls}-scrol-position-right`]: this.scrollPosition === 'both',
        [`${prefixCls}-scroll-position-${this.scrollPosition}`]: this.scrollPosition !== 'both'
      }
    );
    return (
      <Provider store={this.store}>
        <div className={`${prefixCls}-wrapper`}>
          <div
            className={className}
            ref={this.saveRef('tableNode')}
          >
            <div className={`${prefixCls}-content`}>
              {this.renderMainTable()}
              {hasLeftFixed && this.renderLeftFixedTable()}
              {hasRightFixed && this.renderRightFixedTable()}
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}

export default Table;
Table.propTypes = {
  prefixCls: PropTypes.string,
  data: PropTypes.array,
  useFixedHeader: PropTypes.bool,
  columns: PropTypes.array,
  showHeader: PropTypes.bool,
  onHeaderRow: PropTypes.func,
  bordered: PropTypes.bool,
  rowClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  rowRef: PropTypes.func,
  emptyText: PropTypes.oneOfType([
    PropTypes.node, PropTypes.func
  ]),
  scroll: PropTypes.object,
  bodyStyle: PropTypes.object,
  getRowHeight: PropTypes.func
};
Table.defaultProps = {
  prefixCls: 'pl-table',
  data: [],
  useFixedHeader: false,
  columns: [],
  showHeader: true,
  onHeaderRow() {
  },
  bordered: false,
  rowClassName: () => '',
  rowRef: () => null,
  emptyText: () => 'No Data',
  scroll: {},
  bodyStyle: {},
  getRowHeight: () => 1
};
Table.childContextTypes = {
  table: PropTypes.any,
  components: PropTypes.any
};
