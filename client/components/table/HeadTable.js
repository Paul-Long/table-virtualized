import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {measureScrollbar} from './Utils';

export default function HeadTable(props, {table}) {
  const {prefixCls, scroll, showHeader} = table.props;
  let {useFixedHeader} = table.props;
  const {columns, fixed, tableClassName, handleBodyScrollLeft} = props;
  const {saveRef} = table;
  const headStyle = {};
  if (scroll.y) {
    useFixedHeader = true;
    const scrollbarWidth = measureScrollbar('horizontal');
    if (scrollbarWidth > 0 && !fixed) {
      headStyle.marginBottom = `-${scrollbarWidth}px`;
      headStyle.paddingBottom = '0px';
    }
  }
  if (!useFixedHeader || !showHeader) {
    return null;
  }
  return (
    <div
      key='headTable'
      ref={fixed ? null : saveRef('headTable')}
      className={`${prefixCls}-header`}
      style={headStyle}
      onScroll={handleBodyScrollLeft}
    >
      <BaseTable
        tableClassName={tableClassName}
        hasHead
        hasBody={false}
        fixed={fixed}
        columns={columns}
      />
    </div>
  )
}
HeadTable.propTypes = {
  fixed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired
};
HeadTable.contextTypes = {
  table: PropTypes.any
};
