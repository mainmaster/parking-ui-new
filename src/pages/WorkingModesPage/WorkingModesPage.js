import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  workingModesFetch,
  editModalHandler,
  createModalHandler,
  deleteWorkingModeFetch
} from 'store/workingModes/workingModesSlice';
import _ from 'lodash';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { colors } from '../../theme/colors';
import {
  listStyle,
  listWithScrollStyle,
  closeButtonStyle
} from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterSpacer from '../../components/Header/FooterSpacer';
import WorkingModesSpacer from './WorkingModesSpacer';
import pointsEmptyIcon from '../../assets/svg/access_points_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddWorkingModeDialog from '../../components/AddWorkingModeDialog/AddWorkingModeDialog';
import LogWorkModeCard from '../../components/LogWorkModeCard/LogWorkModeCard';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const WorkingModesPage = () => {
  const dispatch = useDispatch();
  const workingModes = useSelector((state) => state.workingModes.workingModes);
  const isLoading = useSelector((state) => state.workingModes.isLoadingFetch);
  const isError = useSelector((state) => state.workingModes.isErrorFetch);
  const isEditModal = useSelector((state) => state.workingModes.isEditModal);
  const isCreateModal = useSelector(
    (state) => state.workingModes.isCreateModal
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [modesListScrolled, setModesListScrolled] = useState(false);
  const modesListRef = useRef(null);
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
    dispatch(workingModesFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModesListScroll = () => {
    if (modesListRef.current) {
      const { scrollTop } = modesListRef.current;
      if (scrollTop > 0) {
        setModesListScrolled(true);
      } else if (modesListScrolled) {
        setModesListScrolled(false);
      }
    }
  };

  const handleEditModeClick = (id) => {
    dispatch(editModalHandler(id));
  };

  const handleAddModeClick = () => {
    dispatch(createModalHandler());
  };

  const deleteHandler = (id) => {
    dispatch(deleteWorkingModeFetch(id));
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
            boxShadow: !modesListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>Режимы</Typography>
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
                onClick={handleAddModeClick}
              >
                Добавить режим
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={modesListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handleModesListScroll}
      >
        <EventManager />
        <WorkingModesSpacer />
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
            <Typography sx={titleTextStyle}>Режимы</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle}
              onClick={handleAddModeClick}
            >
              Добавить режим
            </Button>
          </Stack>
        )}

        {workingModes && workingModes.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(workingModes, ['id']).map((item) => (
                <LogWorkModeCard key={item.id} mode={item} />
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
                  src={pointsEmptyIcon}
                  alt="Нет режимов"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  Нет режимов
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddWorkingModeDialog
        show={isCreateModal}
        handleClose={handleAddModeClick}
      />
      <AddWorkingModeDialog
        show={isEditModal}
        handleClose={handleEditModeClick}
        edit={true}
      />
    </>
  );
};

export default WorkingModesPage;
