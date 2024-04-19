import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  accessPointsFetch,
  editModalHandler,
  createModalHandler
} from 'store/accessPoints/accessPointsSlice';
import { useTerminalsQuery } from 'api/terminal/terminal.api';
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
import AccessPointsSpacer from './AccessPointsSpacer';
import pointsEmptyIcon from '../../assets/svg/access_points_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddAccessPointDialog from '../../components/AddAccessPointDialog/AddAccessPointDialog';
import LogAccessPointCard from '../../components/LogAccessPointCard/LogAccessPointCard';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const AccessPointsPage = () => {
  const dispatch = useDispatch();
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const cameras = useSelector((state) => state.cameras.cameras);
  const controllers = useSelector((state) => state.controllers.controllers);
  const leds = useSelector((state) => state.leds.leds);
  const workingModes = useSelector((state) => state.workingModes.workingModes);
  const isLoading = useSelector((state) => state.accessPoints.isLoadingFetch);
  const isError = useSelector((state) => state.accessPoints.isErrorFetch);
  const isEditModal = useSelector((state) => state.accessPoints.isEditModal);
  const isCreateModal = useSelector(
    (state) => state.accessPoints.isCreateModal
  );
  const { data: terminals } = useTerminalsQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [pointsListScrolled, setPointsListScrolled] = useState(false);
  const pointsListRef = useRef(null);

  useEffect(() => {
    dispatch(accessPointsFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointsListScroll = () => {
    if (pointsListRef.current) {
      const { scrollTop } = pointsListRef.current;
      if (scrollTop > 0) {
        setPointsListScrolled(true);
      } else if (pointsListScrolled) {
        setPointsListScrolled(false);
      }
    }
  };

  const handleAddPointClick = () => {
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
            boxShadow: !pointsListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>Точки доступа</Typography>
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
                onClick={handleAddPointClick}
              >
                Добавить точку доступа
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={pointsListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handlePointsListScroll}
      >
        <EventManager />
        <AccessPointsSpacer />
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
            <Typography sx={titleTextStyle}>Точки доступа</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle}
              onClick={handleAddPointClick}
            >
              Добавить
            </Button>
          </Stack>
        )}

        {accessPoints && accessPoints.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(accessPoints, ['id']).map((item) => (
                <LogAccessPointCard key={item.id} point={item} />
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
                  alt="Нет точек доступа"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  Нет точек доступа
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddAccessPointDialog
        show={isCreateModal}
        handleClose={() => dispatch(createModalHandler())}
      />
      <AddAccessPointDialog
        show={isEditModal}
        handleClose={() => dispatch(editModalHandler())}
        edit={true}
      />
    </>
  );
};

export default AccessPointsPage;
