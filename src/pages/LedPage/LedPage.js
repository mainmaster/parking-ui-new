import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  deleteLedFetch,
  ledsFetch,
  editModalHandler,
  createModalHandler
} from 'store/led/ledSlice';
import _ from 'lodash';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { colors } from '../../theme/colors';
import { listWithScrollStyle, closeButtonStyle } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterSpacer from '../../components/Header/FooterSpacer';
import LedSpacer from './LedSpacer';
import ledEmptyIcon from '../../assets/svg/led_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddLedDialog from '../../components/AddLedDialog/AddLedDialog';
import LogLedCard from '../../components/LogLedCard/LogLedCard';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const LedPage = () => {
  const dispatch = useDispatch();
  const leds = useSelector((state) => state.leds.leds);
  const isLoading = useSelector((state) => state.leds.isLoadingFetch);
  const isError = useSelector((state) => state.leds.isErrorFetch);
  const isEditModal = useSelector((state) => state.leds.isEditModal);
  const isCreateModal = useSelector((state) => state.leds.isCreateModal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [ledListScrolled, setLedListScrolled] = useState(false);
  const ledListRef = useRef(null);
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef?.current) {
      const items = Math.floor(
        containerRef.current.offsetWidth / ITEM_MIN_WIDTH
      );
      setItemsInRow(items - 1);
    }
  }, [containerRef]);

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
    dispatch(ledsFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLedListScroll = () => {
    if (ledListRef.current) {
      const { scrollTop } = ledListRef.current;
      if (scrollTop > 0) {
        setLedListScrolled(true);
      } else if (ledListScrolled) {
        setLedListScrolled(false);
      }
    }
  };

  const handleEditLedClick = () => {
    dispatch(editModalHandler());
  };

  const handleAddLedClick = () => {
    dispatch(createModalHandler());
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
            backgroundColor: colors.surface.low,
            boxShadow: !ledListScrolled && 'none',
            zIndex: 10
            //borderBottom: `1px solid ${colors.outline.separator}`
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
            <Typography sx={titleTextStyle}>LED Табло</Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={closeButtonStyle}
                onClick={handleAddLedClick}
              >
                Добавить LED Табло
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={ledListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handleLedListScroll}
      >
        <EventManager />
        <LedSpacer />
        {isMobile && (
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
            <Typography sx={titleTextStyle}>LED Табло</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle}
              onClick={handleAddLedClick}
            >
              Добавить LED Табло
            </Button>
          </Stack>
        )}

        {leds && leds.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(leds, ['id']).map((item) => (
                <LogLedCard key={item.id} led={item} />
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
            {isLoading ? (
              <SpinerLogo />
            ) : (
              <>
                <img
                  style={{ height: '40px' }}
                  src={ledEmptyIcon}
                  alt="Нет LED Табло"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  Нет LED Табло
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddLedDialog show={isCreateModal} handleClose={handleAddLedClick} />
      <AddLedDialog
        show={isEditModal}
        handleClose={handleEditLedClick}
        edit={true}
      />
    </>
  );
};

export default LedPage;
