import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTerminalsQuery } from 'api/terminal/terminal.api';
import {
  setCreateTerminal,
  setEditTerminal
} from '../../store/terminals/terminalsSlice';
import _ from 'lodash';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { listWithScrollStyle, primaryButtonStyle } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterSpacer from '../../components/Header/FooterSpacer';
import TerminalSpacer from './TerminalSpacer';
import terminalEmptyIcon from '../../assets/svg/terminal_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddTerminalDialog from '../../components/AddTerminalDialog/AddTerminalDialog';
import LogTerminalCard from '../../components/LogTerminalCard/LogTerminalCard';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

export const Terminals = () => {
  const dispatch = useDispatch();
  const { data: terminals, isLoading } = useTerminalsQuery();
  const editTerminal = useSelector((state) => state.terminals.editTerminal);
  const createTerminal = useSelector((state) => state.terminals.createTerminal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [terminalListScrolled, setTerminalListScrolled] = useState(false);
  const terminalListRef = useRef(null);
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

  const handleTerminalListScroll = () => {
    if (terminalListRef.current) {
      const { scrollTop } = terminalListRef.current;
      if (scrollTop > 0) {
        setTerminalListScrolled(true);
      } else if (terminalListScrolled) {
        setTerminalListScrolled(false);
      }
    }
  };

  const handleAddTerminalClick = () => {
    dispatch(setCreateTerminal(true));
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
            boxShadow: !terminalListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>Терминалы</Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={primaryButtonStyle({ ...theme })}
                onClick={handleAddTerminalClick}
              >
                Добавить терминал
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={terminalListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleTerminalListScroll}
      >
        <EventManager />
        <TerminalSpacer />
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
            <Typography sx={titleTextStyle}>Терминалы</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={primaryButtonStyle({ ...theme })}
              onClick={handleAddTerminalClick}
            >
              Добавить
            </Button>
          </Stack>
        )}

        {terminals && terminals.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(terminals, ['id']).map((item) => (
                <LogTerminalCard key={item.id} terminal={item} />
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
                  src={terminalEmptyIcon}
                  alt="Нет терминалов"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  Нет терминалов
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddTerminalDialog
        show={createTerminal}
        handleClose={() => dispatch(setCreateTerminal(false))}
      />
      <AddTerminalDialog
        show={Boolean(editTerminal)}
        handleClose={() => dispatch(setEditTerminal(null))}
        edit={true}
      />
    </>
  );
};
