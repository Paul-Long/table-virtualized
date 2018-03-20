import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {measureScrollbar} from './Utils';

export default function BodyTable(props, {table}) {
  const {prefixCls, scroll} = table.props;
  const {saveRef} = table;
  let {useFixedHeader} = table.props;
  const {
    handleBodyScroll,
    tableClassName,
    fixed,
    columns,
    getRowKey,
    isAnyColumnsFixed
  } = props;
  const bodyStyle = {...table.props.bodyStyle};
  const innerBodyStyle = {};
  if (scroll.x || fixed) {
    bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
    bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';
  }
  if (scroll.y) {
    if (fixed) {
      innerBodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
      innerBodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
    } else {
      bodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
    }
    bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
    useFixedHeader = true;

    const scrollbarWidth = measureScrollbar();
    if (scrollbarWidth > 0 && fixed) {
      bodyStyle.marginBottom = `-${scrollbarWidth}px`;
      bodyStyle.paddingBottom = '0px';
    }
  }
  const baseTable = (
    <BaseTable
      tableClassName={tableClassName}
      hasHead={!useFixedHeader}
      hasBody
      fixed={fixed}
      columns={columns}
      getRowKey={getRowKey}
      isAnyColumnsFixed={isAnyColumnsFixed}
    />
  );
  if (fixed && columns.length) {
    let refName;
    if (columns[0].fixed === 'left' || columns[0].fixed === true) {
      refName = 'fixedColumnsBodyLeft';
    } else if (columns[0].fixed === 'right') {
      refName = 'fixedColumnsBodyRight';
    }
    delete bodyStyle.overflowX;
    delete bodyStyle.overflowY;
    return (
      <div
        key='bodyTable'
        className={`${prefixCls}-body-outer`}
        style={{...bodyStyle}}
      >
        <div
          className={`${prefixCls}-body-inner`}
          ref={saveRef(refName)}
          style={innerBodyStyle}
          onScroll={handleBodyScroll}
        >
          {baseTable}
        </div>
      </div>
    )
  }
  return (
    <div
      key='bodyTable'
      className={`${prefixCls}-body`}
      style={{...bodyStyle}}
      ref={saveRef('bodyTable')}
      onScroll={handleBodyScroll}
    >
      {baseTable}
    </div>
  )
}
BodyTable.contextTypes = {
  table: PropTypes.any
};
