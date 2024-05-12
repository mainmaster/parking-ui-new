// import css from './Pagination.module.scss'
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import React from 'react';
import { secondaryButtonStyle } from '../../theme/styles';
import { PaginationItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PaginationCustom = ({ pages, changePage, currentPage }) => {
  const theme = useTheme();
  return (
    <Pagination
      page={currentPage}
      count={pages}
      onChange={changePage}
      sx={{
        width: '100%',
        height: '48px',
        my: '4px',
        flexWrap: 'nowrap',
        '& .Mui-selected': [
          secondaryButtonStyle({ ...theme }),
          {
            paddingLeft: '10px',
            paddingRight: '10px'
          }
        ],
        '& ul': {
          justifyContent: 'center',
          flexWrap: 'nowrap'
        }
      }}
      renderItem={(item) => (
        <PaginationItem
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
            height: '40px',
            borderRadius: '8px',
            margin: 0
          }}
          {...item}
        />
      )}
    />
  );
};

PaginationCustom.propTypes = {
  pages: PropTypes.number,
  currentPage: PropTypes.number,
  changePage: PropTypes.func
};

export default PaginationCustom;
