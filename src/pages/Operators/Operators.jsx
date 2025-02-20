import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyRentersQuery } from '../../api/renters/renters.api';
import { useLazyOperatorsQuery } from '../../api/operator/operator.api';
import {
  setCreateRenter,
  setEditRenter
} from '../../store/renters/rentersSlice';
import {
  setCreateOperator,
  setEditOperator
} from '../../store/operator/operatorSlice';
import { operatorAccessOptions } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AppBar,
  Box,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  CarNumberInput,
  listWithScrollStyle,
  primaryButtonStyle,
  tabStyle
} from '../../theme/styles';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import FooterSpacer from '../../components/Header/FooterSpacer';
import OperatorsSpacer from './OperatorsSpacer';
import usersEmptyIcon from '../../assets/svg/users_empty_icon.svg';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogOperatorCard from '../../components/LogOperatorCard/LogOperatorCard';
import LogRenterCard from '../../components/LogRenterCard/LogRenterCard';
import EventManager from '../../components/EventManager/EventManager';
import AddRenterDialog from '../../components/AddRenterDialog/AddRenterDialog';
import AddOperatorDialog from '../../components/AddOperatorDialog/AddOperatorDialog';
import { accessPointsOnlyFetch } from '../../store/accessPoints/accessPointsSlice';
import { useTranslation } from 'react-i18next';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

export const Operators = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [getOperators, { data: operators, isLoading: operatorsLoading }] =
    useLazyOperatorsQuery();
  const [getRenters, { data: renters, isLoading: rentersLoading }] =
    useLazyRentersQuery();
  const userType = useSelector((state) => state.parkingInfo.userType);
  const editRenter = useSelector((state) => state.renters.editRenter);
  const createRenter = useSelector((state) => state.renters.createRenter);
  const editOperator = useSelector((state) => state.operator.editOperator);
  const createOperator = useSelector((state) => state.operator.createOperator);
  const operator = useSelector((state) => state.parkingInfo.operator);
  const [usersListScrolled, setUsersListScrolled] = useState(false);
  const usersListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const urlStatus = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);
  const [disableOperators, setDisableOperators] = useState(false);
  const [disableRenters, setDisableRenters] = useState(false);
  const [renterName, setRenterName] = useState('');

  useEffect(() => {
    dispatch(accessPointsOnlyFetch());
  }, []);

  const handleResize = useCallback(() => {
    if (containerRef?.current) {
      const items = Math.floor(
        containerRef.current.offsetWidth / ITEM_MIN_WIDTH
      );
      setItemsInRow(items - 1);
    }
  }, [containerRef]);

  useEffect(() => {
    if (userType === 'operator') {
      const operatorOption = operatorAccessOptions.find(
        (option) => option.route === '/users/operators'
      );
      if (
        operator &&
        operatorOption.value in operator &&
        operator[operatorOption.value] === true
      ) {
        setDisableOperators(false);
      } else {
        setDisableOperators(true);
      }
      const renterOption = operatorAccessOptions.find(
        (option) => option.route === '/users/renters'
      );
      if (
        operator &&
        renterOption.value in operator &&
        operator[renterOption.value] === true
      ) {
        setDisableRenters(false);
      } else {
        setDisableRenters(true);
      }
    }
  }, [userType, operator]);

  useEffect(() => {
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, handleResize]);

  useEffect(() => {
    if (urlStatus['*'] === 'operators') {
      if (currentTab !== 0) {
        setCurrentTab(0);
      }
      getOperators();
    } else {
      if (currentTab !== 1) {
        setCurrentTab(1);
      }
      getRenters();
    }
  }, [urlStatus]);

  useEffect(() => {
    if (urlStatus['*'] === 'renters') {
      getRenters({query: renterName});
    }
  }, [renterName]);

  const handleUsersListScroll = () => {
    if (usersListRef.current) {
      const { scrollTop } = usersListRef.current;
      if (scrollTop > 0) {
        setUsersListScrolled(true);
      } else if (usersListScrolled) {
        setUsersListScrolled(false);
      }
    }
  };

  const handleAddOperatorClick = () => {
    dispatch(setCreateOperator(true));
  };

  const handleAddRenterClick = () => {
    dispatch(setCreateRenter(true));
  };

  const handleChangeTab = (event, value) => {
    switch (value) {
      case 0:
        navigate('./operators');
        break;
      case 1:
        navigate('./renters');
        break;
    }
    setCurrentTab(value);
  };

  return (
    <>
      {!isMobile && (
        <AppBar
          sx={{
            width: 'calc(100% - 72px)',
            position: 'absolute',
            top: 0,
            left: '72px',
            backgroundColor: theme.colors.surface.low,
            boxShadow: !usersListScrolled && 'none',
            zIndex: 10,
            borderBottom: `1px solid ${theme.colors.outline.separator}`
          }}
        >
          <Stack
            direction={'row'}
            gap={'16px'}
            justifyContent={'space-between'}
            sx={{
              height: '64px',
              width: '100%',
              p: '16px',
              pb: '8px'
            }}
          >
            <Typography sx={titleTextStyle}>
              {t('pages.operators.access')}
            </Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%', alignItems:'center' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={primaryButtonStyle({ ...theme })}
                onClick={
                  currentTab === 0
                    ? handleAddOperatorClick
                    : handleAddRenterClick
                }
              >
                {currentTab === 0
                  ? t('pages.operators.addOperator')
                  : t('pages.operators.addRenter')}
              </Button>
              {currentTab === 1 && <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'8px'}
                sx={{ px: '16px' }}
              >
                <CarNumberInput
                  fullWidth={false}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          height: '100%',
                          mt: '0 !important',
                          mr: '4px'
                        }}
                      >
                        <img
                          style={{
                            height: 24
                          }}
                          src={searchIcon}
                          alt={t('pages.operators.searchByRenter')}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: renterName && (
                      <InputAdornment position="end">
                        <IconButton
                          disableRipple
                          aria-label="cancel"
                          sx={{ p: 0 }}
                          onClick={() => setRenterName('')}
                        >
                          <img
                            style={{
                              height: 24
                            }}
                            src={searchCancelIcon}
                            alt={t('pages.operators.clear')}
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  variant="filled"
                  id="vehiclePlate"
                  name="vehiclePlate"
                  placeholder={t('pages.operators.searchByRenter')}
                  value={renterName}
                  onChange={(event) => setRenterName(event.target.value)}
                />
              </Stack>}

            </Stack>
          </Stack>
          <Stack direction={'row'}>
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons={false}
              TabIndicatorProps={{
                sx: {
                  backgroundColor: theme.colors.button.primary.default
                }
              }}
              sx={{ minHeight: '42px' }}
            >
              <Tab
                sx={tabStyle({ ...theme })}
                disableRipple
                disabled={disableOperators}
                label={t('pages.operators.operators')}
              />
              <Tab
                sx={tabStyle({ ...theme })}
                disableRipple
                disabled={disableRenters}
                label={t('pages.operators.renters')}
              />
            </Tabs>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={usersListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleUsersListScroll}
      >
        <EventManager />
        <OperatorsSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: theme.colors.surface.low,
                boxShadow: !usersListScrolled && 'none',
                zIndex: 10,
                borderBottom: `1px solid ${theme.colors.outline.separator}`
              }}
            >
              <Stack
                direction={'row'}
                gap={'16px'}
                justifyContent={'space-between'}
                sx={{
                  height: '64px',
                  width: '100%',
                  p: '16px',
                  pb: '8px'
                }}
              >
                <Typography sx={titleTextStyle}>
                  {t('pages.operators.access')}
                </Typography>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={primaryButtonStyle({ ...theme })}
                  onClick={
                    currentTab === 0
                      ? handleAddOperatorClick
                      : handleAddRenterClick
                  }
                >
                  {currentTab === 0
                    ? t('pages.operators.addOperator')
                    : t('pages.operators.addRenter')}
                </Button>
              </Stack>
              {currentTab === 1 && <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'8px'}
                sx={{width: '100%', px: '16px' }}
              >
                <CarNumberInput
                  fullWidth={false}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          height: '100%',
                          mt: '0 !important',
                          mr: '4px'
                        }}
                      >
                        <img
                          style={{
                            height: 24
                          }}
                          src={searchIcon}
                          alt={t('pages.operators.searchByRenter')}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: renterName && (
                      <InputAdornment position="end">
                        <IconButton
                          disableRipple
                          aria-label="cancel"
                          sx={{ p: 0 }}
                          onClick={() => setRenterName('')}
                        >
                          <img
                            style={{
                              height: 24
                            }}
                            src={searchCancelIcon}
                            alt={t('pages.operators.clear')}
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  variant="filled"
                  id="vehiclePlate"
                  name="vehiclePlate"
                  placeholder={t('pages.operators.searchByRenter')}
                  value={renterName}
                  onChange={(event) => setRenterName(event.target.value)}
                />
              </Stack>}
              <Stack direction={'row'}>
                <Tabs
                  value={currentTab}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                  TabIndicatorProps={{
                    sx: {
                      backgroundColor: theme.colors.button.primary.default
                    }
                  }}
                  sx={{ minHeight: '42px' }}
                >
                  <Tab
                    sx={tabStyle({ ...theme })}
                    disableRipple
                    label={t('pages.operators.operators')}
                  />
                  <Tab
                    sx={tabStyle({ ...theme })}
                    disableRipple
                    label={t('pages.operators.renters')}
                  />
                </Tabs>
              </Stack>
            </AppBar>
          </>
        )}

        {(currentTab === 0 && operators && operators.length > 0) ||
        (currentTab === 1 && renters && renters.length > 0) ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {currentTab === 0 &&
                operators.map((item, index) => (
                  <LogOperatorCard key={item.id} operator={item} />
                ))}
              {currentTab === 1 &&
                renters.map((item, index) => (
                  <LogRenterCard key={item.id} renter={item} />
                ))}
              {itemsInRow > 0 &&
                [...Array(itemsInRow)].map((value, index) => (
                  <Box
                    id={index + 1}
                    key={index}
                    sx={{
                      flex: `1 1 ${ITEM_MIN_WIDTH}px`,
                      minWidth: `${ITEM_MIN_WIDTH}px`,
                      maxWidth: `${ITEM_MAX_WIDTH}px`
                    }}
                  />
                ))}
            </Box>
          </>
        ) : (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            gap={'16px'}
          >
            {operatorsLoading || rentersLoading ? (
              <SpinerLogo />
            ) : (
              <>
                <img
                  style={{ height: '40px' }}
                  src={usersEmptyIcon}
                  alt={
                    currentTab === 0
                      ? t('pages.operators.noOperator')
                      : t('pages.operators.noRenter')
                  }
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  {currentTab === 0
                    ? t('pages.operators.noOperator')
                    : t('pages.operators.noRenter')}
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddRenterDialog
        show={createRenter}
        handleClose={() => dispatch(setCreateRenter(false))}
      />
      <AddRenterDialog
        show={Boolean(editRenter)}
        handleClose={() => dispatch(setEditRenter(null))}
        edit={true}
      />
      <AddOperatorDialog
        show={createOperator}
        handleClose={() => dispatch(setCreateOperator(false))}
      />
      <AddOperatorDialog
        show={Boolean(editOperator)}
        handleClose={() => dispatch(setEditOperator(null))}
        edit={true}
      />
    </>
  );
};
