import React from 'react';
import { typeText } from './types';
import { useTheme } from '@mui/material/styles';

const TypeAuto = ({ type }) => {
  const theme = useTheme();
  return (
    <>
      {typeText({ ...theme })[type] && (
        <div
          style={{
            backgroundColor: typeText({ ...theme })[type]?.color,
            color: typeText({ ...theme })[type]?.textColor,
            padding: '2px 6px',
            borderRadius: '16px',
            border: typeText({ ...theme })[type]
              ? `1px solid ${theme.colors.outline.separator}`
              : '',
            fontSize: '0.75rem',
            lineHeight: '0.875rem',
            whiteSpace: 'nowrap'
          }}
        >
          {typeText({ ...theme })[type].label}
        </div>
      )}
    </>
  );
};

export default TypeAuto;
