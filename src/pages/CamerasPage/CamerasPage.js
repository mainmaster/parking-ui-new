import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import css from './CamerasPage.module.scss';
import { Button, Spinner } from 'react-bootstrap';
// Components
import CameraItem from 'components/CameraItem';
import CreateCameraModal from 'components/Modals/CreateCameraModal';
import EditCameraModal from 'components/Modals/EditCameraModal';
// Store
import {
  camerasFetch,
  editModalHandler,
  createModalHandler,
  deleteCameraFetch
} from 'store/cameras/camerasSlice';
import _ from 'lodash';
import { Box } from '@mui/material';
import React from 'react';

const CamerasPage = () => {
  const dispatch = useDispatch();
  const cameras = useSelector((state) => state.cameras.cameras);
  const isLoadingFetch = useSelector((state) => state.cameras.isLoadingFetch);
  const isErrorFetch = useSelector((state) => state.cameras.isErrorFetch);
  const isEditModal = useSelector((state) => state.cameras.isEditModal);
  const isCreateModal = useSelector((state) => state.cameras.isCreateModal);

  useEffect(() => {
    dispatch(camerasFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editPopupHandler = (id) => {
    dispatch(editModalHandler(id));
  };

  const createPopupHandler = () => {
    dispatch(createModalHandler());
  };

  const deleteHandler = (id) => {
    dispatch(deleteCameraFetch(id));
  };

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  );

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  );

  const emptyData = <div className={css.empty}>Камер нет</div>;

  const cardsContent = (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {cameras.length !== 0
        ? _.sortBy(cameras, ['id'])?.map((item) => (
            <CameraItem
              key={item.id}
              {...item}
              editHandler={() => editPopupHandler(item.id)}
              deleteHandler={() => deleteHandler(item.id)}
            />
          ))
        : emptyData}
    </Box>
  );

  const hasData = !(isLoadingFetch || isErrorFetch);
  const errorMessage = isErrorFetch ? errorContent : null;
  const spinner = isLoadingFetch ? spinnerContent : null;
  const content = hasData ? cardsContent : null;

  return (
    <>
      <div className={css.top}>
        <Button className="mb-4 mt-3" onClick={createPopupHandler}>
          Добавить камеру
        </Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateCameraModal
        show={isCreateModal}
        handleClose={createPopupHandler}
      />
      <EditCameraModal show={isEditModal} handleClose={editPopupHandler} />
    </>
  );
};

export default CamerasPage;
