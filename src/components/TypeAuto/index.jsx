import React from 'react';
import { colors } from '../../theme/colors';

const TypeAuto = ({ type }) => {
  const typeText = {
    1006: {
      label: 'Разовый',
      color: colors.carlist.bg.once,
      textColor: colors.carlist.text.black
    },
    1034: {
      label: 'Абонемент',
      color: '#EDBD05',
      textColor: colors.carlist.text.black
    },
    1008: {
      label: 'Белый список',
      color: colors.carlist.bg.white,
      textColor: colors.carlist.text.black
    },
    1028: {
      label: 'Заявка',
      color: '#3F89BA',
      textColor: colors.carlist.text.black
    },
    1004: {
      label: 'Черный список',
      color: colors.carlist.bg.black,
      textColor: colors.carlist.text.white
    }
  };

  return (
    <div
      style={{
        backgroundColor: typeText[type]?.color,
        color: typeText[type]?.textColor,
        padding: '2px 6px',
        borderRadius: '16px',
        border: typeText[type] ? `1px solid ${colors.outline.separator}` : '',
        fontSize: '0.75rem',
        lineHeight: '0.875rem'
      }}
    >
      {typeText[type]?.label}
    </div>
  );
};

export default TypeAuto;
