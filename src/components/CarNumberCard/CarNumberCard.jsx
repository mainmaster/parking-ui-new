import React from 'react';
import styles from './carnumber.module.css';
import flag from './flag.jpeg';
import flagBlank from './flag_blank.png';
import { useSnackbar } from 'notistack';
import { colors } from '../../theme/colors';

const numberTextStyle = {
  padding: '0 6px'
};

export const CarNumberCard = ({
  carNumber,
  isTable,
  small,
  isEnterCard,
  handleClick
}) => {
  const { enqueueSnackbar } = useSnackbar();
  if (carNumber && carNumber.number !== '') {
    return (
      <div
        style={
          isTable || small
            ? {
                display: 'flex',
                width: small ? '100%' : 'inherit',
                justifyContent: small
                  ? 'flex-end'
                  : isEnterCard
                  ? 'flex-start'
                  : 'center'
              }
            : null
        }
      >
        <div
          onClick={() => {
            if (handleClick) {
              handleClick();
            } else {
              navigator.clipboard
                .writeText(carNumber.number + carNumber.region)
                .then(() => {
                  enqueueSnackbar('Номер скопирован');
                });
            }
          }}
          className={styles.wrap}
          style={{
            fontSize: small ? '16px' : isTable ? '24px' : '45px',
            cursor: handleClick ? 'pointer' : 'default'
          }}
        >
          {carNumber.region || carNumber.region === '' ? (
            <>
              <div
                className={styles.number}
                style={{
                  border: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  borderRight: 0,
                  height: small ? '24px' : isTable ? '40px' : '50px',
                  fontSize: small ? '22px' : isTable ? '34px' : '45px',
                  lineHeight: small ? '22px' : isTable ? '34px' : '45px',
                  textWrap: 'nowrap',
                  borderTopLeftRadius: small ? '4px' : '8px',
                  borderBottomLeftRadius: small ? '4px' : '8px',
                  backgroundColor: small
                    ? 'rgba(255, 255, 255, 0.7)'
                    : colors.surface.low
                }}
              >
                {carNumber.number === '' ? '------' : carNumber.number}
              </div>
              <div
                style={{
                  height: small ? '24px' : isTable ? '40px' : '50px',
                  borderTop: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  borderBottom: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  backgroundColor: small
                    ? 'rgba(255, 255, 255, 0.7)'
                    : colors.surface.low
                }}
              >
                <div
                  style={{
                    width: '1px',
                    height: small ? '16px' : isTable ? '25px' : '35px',
                    margin: small ? '4px 0 ' : '7px 0 ',
                    backgroundColor: colors.outline.surface
                  }}
                ></div>
              </div>
              <div
                className={styles.region}
                style={{
                  borderTop: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  borderRight: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  borderBottom: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  height: small ? '24px' : isTable ? '40px' : '50px',
                  borderTopRightRadius: small ? '4px' : '8px',
                  borderBottomRightRadius: small ? '4px' : '8px',
                  gap: small ? '3px' : '6px',
                  backgroundColor: small
                    ? 'rgba(255, 255, 255, 0.7)'
                    : colors.surface.low
                }}
              >
                {(carNumber.region || carNumber.region === '') && (
                  <>
                    <div
                      style={{
                        fontSize: small ? '11px' : isTable ? '15px' : '35px',
                        lineHeight: small ? '11px' : isTable ? '15px' : '35px',
                        paddingTop: small ? '3px' : '7px',
                        height: small ? '11px' : isTable ? '20px' : '35px'
                      }}
                      className={styles.regionNumber}
                    >
                      {carNumber.region === '' ? '--' : carNumber.region}
                    </div>
                    <div
                      className={styles.wrapRusImage}
                      style={{
                        gap: small ? '3px' : isTable ? '3px' : '5px',
                        fontSize: small ? '7px' : '11px',
                        lineHeight: small ? '7px' : '11px',
                        height: small ? '5px' : '8px',
                        marginBottom: small ? '3px' : '7px'
                      }}
                    >
                      <span>{carNumber.region === '' ? '---' : 'RUS'}</span>
                      <img
                        style={{ height: small ? '5px' : '8px' }}
                        className={styles.image}
                        src={carNumber.region === '' ? flagBlank : flag}
                        alt=""
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className={styles.number}
                style={{
                  borderRadius: small ? '4px' : '8px',
                  border: small
                    ? `1px solid ${colors.outline.surface}`
                    : isTable
                    ? '1px solid black'
                    : '2px solid black',
                  height: small ? '24px' : isTable ? '40px' : '50px'
                }}
              >
                {carNumber.number === '' ? '------' : carNumber.number}
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
