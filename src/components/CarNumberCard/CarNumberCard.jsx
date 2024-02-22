import React from 'react';
import styles from './carnumber.module.css';
import flag from './flag.jpeg';
import flagBlank from './flag_blank.png';
import { useSnackbar } from 'notistack';

export const CarNumberCard = ({
  carNumber,
  isTable,
  isEnterCard,
  handleClick
}) => {
  const { enqueueSnackbar } = useSnackbar();
  if (carNumber) {
    return (
      <div
        style={
          isTable
            ? {
                display: 'flex',
                width: '170px',
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
            fontSize: isTable ? '30px' : '45px'
          }}
        >
          {carNumber.region || carNumber.region === '' ? (
            <>
              <div
                className={styles.number}
                style={{
                  border: isTable ? '1px solid black' : '2px solid black',
                  height: isTable ? '40px' : '50px'
                }}
              >
                {carNumber.number === '' ? '------' : carNumber.number}
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
                        fontSize: isTable ? '23px' : '35px'
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
