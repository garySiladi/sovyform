import React from 'react';
import './table-header.css';

const TableHeader = ({position, sortHeaderIndex, asc, children, onClick}) => {
  const isSortHeader = position === sortHeaderIndex;
  let triangleCode = '';
  if (asc && isSortHeader) {
    triangleCode = '▲';
  } else if (asc && !isSortHeader) {
    triangleCode = '△';
  } else if (!asc && isSortHeader) {
    triangleCode = '▼';
  } else if (!asc && !isSortHeader) {
    triangleCode = '▽';
  };
  return (
    <th onClick={onClick} className='table-header-wrapper'>
      {children}
      <span className='table-header-triangle'>
        {triangleCode}
      </span>
    </th>
  );
}

export default TableHeader;