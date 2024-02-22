import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import css from './Cameras.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Tooltip } from 'react-tooltip';
import { QuestionCircle } from 'react-bootstrap-icons';
import ReactDOMServer from 'react-dom/server';
import cn from 'classnames';
import _ from 'lodash';
// Store
import {
  openApFetch,
  closeApFetch,
  normalApFetch,
  closeApAllFetch,
  normalApAllFetch,
  openApAllFetch,
  getStatusesAccessPointsFetch
} from 'store/events/eventsSlice';
import {
  changeActiveOpenApModal,
  changeActiveOpenApTimeModal
} from 'store/cameras/camerasSlice';
// Components
import OpenApByVehiclePlateModal from 'components/Modals/OpenApByVehiclePlateModal';
import Camera from 'components/Camera';
import OpenApByTimeModal from 'components/Modals/OpenApByTimeModal';
import { camerasFetch } from '../../store/cameras/camerasSlice';
import { Formik } from 'formik';
import {
  clearLedBoardMessage,
  postLedBoardMessage
} from '../../api/access-points';
import { useSnackbar } from 'notistack';
import {
  ArrowLeftSquareFill,
  ArrowRightSquareFill
} from 'react-bootstrap-icons';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { Box } from '@mui/material';
import React from 'react';
import { listStyle } from '../../theme/styles';

const Cameras = () => {
  const dispatch = useDispatch();
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const isFetched = useSelector((state) => state.events.isAccessPointsFetched);
  const isChangedStatus = useSelector((state) => state.events.isChangedStatus);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);
  const isOpenApTimeModal = useSelector(
    (state) => state.cameras.isOpenApTimeModal
  );
  const { data: parkingData } = useParkingInfoQuery();
  const cameras = useSelector((state) => state.cameras.cameras);
  const wsLedMessages = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [titlesLed, setTitlesLed] = useState({});

  const openAp = (camera) => {
    dispatch(openApFetch(camera.id));
  };

  const closeAp = (camera) => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(closeApFetch(payload));
  };

  const normalAp = (camera) => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(normalApFetch(payload));
  };

  const isPreviewLenght = cameras.length !== 0;

  useEffect(() => {
    dispatch(camerasFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let typeWS = process.env.REACT_APP_API_URL.toString().split('/');
    let address = process.env.REACT_APP_API_URL;

    if (typeWS[0] === 'https:') {
      address = address.replace('https:', 'wss:');
    } else {
      address = address.replace('http:', 'ws:');
    }
    if (parkingData) {
    }
    wsLedMessages.current = new WebSocket(
      address + `/wsLedMessages/?parkingID=${parkingData.parkingID}`
    );

    wsLedMessages.current.onmessage = (event) => {
      let data = JSON.parse(event.data);
      let newTitles = titlesLed;

      newTitles[`access_point${data.access_point}`] = {
        line1: data.lines[0],
        line2: data.lines[1]
      };

      setTitlesLed({ ...titlesLed, ...newTitles });
    };
    wsLedMessages.current.open = (event) => {};

    return () => {
      if (wsLedMessages.current?.close) {
        return wsLedMessages.current.close();
      } else {
        return wsLedMessages.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isFetched) {
      dispatch(getStatusesAccessPointsFetch());
    }
  }, [isFetched, dispatch, isChangedStatus]);

  const handleCreateLedMessage = (values, id) => {
    console.log(values);
    postLedBoardMessage({
      ...titlesLed[`access_point${id}`],
      id: id
    }).then(() => {
      enqueueSnackbar('Табло изменено', {
        variant: 'success'
      });
    });
  };

  const handleSetTitles = (event, index, line) => {
    let newArr = { ...titlesLed };
    try {
      if (line == 1) {
        newArr[`access_point${index}`].line1 = event.target.value;
      } else {
        newArr[`access_point${index}`].line2 = event.target.value;
      }
      console.log(newArr);
      setTitlesLed(newArr);
    } catch (e) {
      newArr[`access_point${index}`] = {
        line1: [`access_point${index}`]?.line1 || '',
        line2: [`access_point${index}`]?.line2 || ''
      };
      if (line == 1) {
        newArr[`access_point${index}`].line1 = event.target.value;
      } else {
        newArr[`access_point${index}`].line2 = event.target.value;
      }
      setTitlesLed(newArr);
    }
  };
  return (
    <Box sx={listStyle}>
      <Box>
        {_.sortBy(accessPoints, ['id']).map((camera, index) => (
          <div className={css.camera} key={index}>
            <Tooltip id={`tooltip-${camera.id}`} />
            <div className={css.camera_status}>
              <div
                className={cn(
                  css.circle,
                  camera.status === 'open' && css.green,
                  camera.status === 'working_mode' && css.orange,
                  css.animate
                )}
              />
              <a
                href
                data-tooltip-id={`tooltip-${camera.id}`}
                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                  <div>
                    <div className={css.camera_status_item}>
                      <div className={css.circle} />
                      <span>- закрыт</span>
                    </div>
                    <div className={css.camera_status_item}>
                      <div className={cn(css.circle, css.green)} />
                      <span>- открыт</span>
                    </div>
                    <div className={css.camera_status_item}>
                      <div className={cn(css.circle, css.orange)} />
                      <span>- нормальный режим</span>
                    </div>
                  </div>
                )}
              >
                <QuestionCircle />
              </a>
            </div>
            <div className={css.camera_name}>
              {camera.direction === 'in' ? (
                <>
                  <ArrowRightSquareFill color="#1cd80f" size={30} />
                </>
              ) : (
                <>
                  <ArrowLeftSquareFill color="#de0103" size={30} />
                </>
              )}
              {camera.description}
            </div>
            <div>
              <div className={css.wrapFormLed}>
                <Formik
                  initialValues={{
                    line1: '',
                    line2: ''
                  }}
                  onSubmit={(e) => handleCreateLedMessage(e, camera.id)}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit} id="create-camera">
                      <Form.Control
                        name="line1"
                        type="text"
                        className={css.fieldFormLed}
                        defaultValue={null}
                        value={
                          titlesLed[`access_point${camera.id}`]?.line1 || ''
                        }
                        onChange={(e) => {
                          props.setFieldValue('line1', e.target.value);
                          handleSetTitles(e, camera.id, 1);
                        }}
                      />
                      <Form.Control
                        name="line2"
                        type="text"
                        className={css.fieldFormLed}
                        value={
                          titlesLed[`access_point${camera.id}`]?.line2 || ''
                        }
                        onChange={(e) => {
                          props.setFieldValue('line2', e.target.value);
                          handleSetTitles(e, camera.id, 2);
                        }}
                      />
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <Button size="sm" type="submit">
                          Ввод
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearLedBoardMessage(camera.id);
                          }}
                          size="sm"
                        >
                          Очистить
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
              {isPreviewLenght ? (
                <Camera
                  id={camera.id}
                  src={
                    cameras.find((item) => item.id === camera.cam_id)?.mjpeg_url
                  }
                />
              ) : (
                <Skeleton height={350} />
              )}
            </div>

            <div className={css.camera_btns}>
              <Button onClick={() => openAp(camera)} variant="success">
                Открыть
              </Button>
              <Button
                onClick={() => dispatch(changeActiveOpenApModal(camera.id))}
              >
                Открыть с подтверждением номера
              </Button>
              <Button onClick={() => closeAp(camera)}>Закрыть</Button>
              <Button variant="danger" onClick={() => normalAp(camera)}>
                Нормальный режим
              </Button>
            </div>
          </div>
        ))}
        <OpenApByVehiclePlateModal
          show={isOpenApModal}
          handleClose={() => dispatch(changeActiveOpenApModal())}
        />
        <OpenApByTimeModal
          show={isOpenApTimeModal}
          handleClose={() => dispatch(changeActiveOpenApTimeModal())}
        />
      </Box>
      <div className={css.btns}>
        <Button variant="success" onClick={() => dispatch(openApAllFetch())}>
          Открыть все шлагбаумы
        </Button>
        <Button onClick={() => dispatch(closeApAllFetch())}>
          Закрыть все шлагбаумы
        </Button>
        <Button
          style={{ width: '100%' }}
          variant="danger"
          onClick={() => dispatch(normalApAllFetch())}
        >
          В нормальный режим все шлагбаумы
        </Button>
      </div>
    </Box>
  );
};

export default Cameras;
