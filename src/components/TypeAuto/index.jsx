import React from 'react';
import { typeText } from './types';
import { colors } from '../../theme/colors';

const TypeAuto = ({ type }) => {
  return (
    <div
      style={{
        backgroundColor: typeText[type]?.color,
        color: typeText[type]?.textColor,
        padding: '2px 6px',
        borderRadius: '16px',
        border: typeText[type] ? `1px solid ${colors.outline.separator}` : '',
        fontSize: '0.75rem',
        lineHeight: '0.875rem',
        whiteSpace: 'nowrap'
      }}
    >
      {typeText[type]?.label}
    </div>
  );
};

export default TypeAuto;
