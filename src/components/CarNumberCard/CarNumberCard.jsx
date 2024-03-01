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
  isEnterCard,
  handleClick
}) => {
  const { enqueueSnackbar } = useSnackbar();
  if (carNumber && carNumber.number !== '') {
    return (
      <div
        style={
          isTable
            ? {
                display: 'flex',
                //width: '196px',
                justifyContent: isEnterCard ? 'flex-start' : 'center'
              }
            : null
        }
      >
        <div
          onClick={() => {
            if (!isEnterCard) {
              navigator.clipboard
                .writeText(carNumber.number + carNumber.region)
                .then(() => {
                  enqueueSnackbar('Номер скопирован');
                });
            } else {
              handleClick();
            }
          }}
          className={styles.wrap}
          style={{
            fontSize: isTable ? '24px' : '45px'
          }}
        >
          {carNumber.region || carNumber.region === '' ? (
            <>
              <div
                className={styles.number}
                style={{
                  border: isTable ? '1px solid black' : '2px solid black',
                  borderRight: 0,
                  height: isTable ? '40px' : '50px',
                  fontSize: isTable ? '34px' : '45px',
                  lineHeight: isTable ? '34px' : '45px'
                }}
              >
                {carNumber.number === '' ? '------' : carNumber.number}
              </div>
              <div
                style={{
                  height: isTable ? '40px' : '50px',
                  borderTop: isTable ? '1px solid black' : '2px solid black',
                  borderBottom: isTable ? '1px solid black' : '2px solid black'
                }}
              >
                <div
                  style={{
                    width: '1px',
                    height: isTable ? '25px' : '35px',
                    margin: '7px 0 ',
                    backgroundColor: colors.outline.surface
                  }}
                ></div>
              </div>
              <div
                className={styles.region}
                style={{
                  borderTop: isTable ? '1px solid black' : '2px solid black',
                  borderRight: isTable ? '1px solid black' : '2px solid black',
                  borderBottom: isTable ? '1px solid black' : '2px solid black',
                  height: isTable ? '40px' : '50px'
                }}
              >
                {(carNumber.region || carNumber.region === '') && (
                  <>
                    <div
                      style={{
                        fontSize: isTable ? '15px' : '35px',
                        lineHeight: isTable ? '15px' : '35px'
                      }}
                      className={styles.regionNumber}
                    >
                      {carNumber.region === '' ? '--' : carNumber.region}
                    </div>
                    <div
                      className={styles.wrapRusImage}
                      style={{
                        gap: isTable ? '3px' : '5px'
                      }}
                    >
                      <span>{carNumber.region === '' ? '---' : 'RUS'}</span>
                      <img
                        style={{}}
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
                  borderRadius: '5px',
                  border: isTable ? '1px solid black' : '2px solid black',
                  height: isTable ? '40px' : '50px'
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
