import React from 'react';
import css from './Layout.module.scss';
import PropTypes from 'prop-types';
// Components
import Header from 'components/Header';
import { Box, Stack } from '@mui/material';
import { isMobile } from 'react-device-detect';

const layoutStyle = {
  height: '100%',
  maxHeight: '100dvh'
};

const Layout = ({ children, title, userType, isHideMenu }) => {
  return (
    <Stack direction={'row'} justifyContent={'space-between'} sx={layoutStyle}>
      {userType && (
        <Header title={title} userType={userType} isHideMenu={isHideMenu} />
      )}
      {children}
    </Stack>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  usertype: PropTypes.string,
  isHideMenu: PropTypes.bool
};

export default Layout;
