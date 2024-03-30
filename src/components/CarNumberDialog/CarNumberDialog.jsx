import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  styled
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAccessPointById,
  getAccessPointSnapshot
} from '../../api/access-points';
import { getOpenedSessionsRequest } from '../../api/sessions';
import { openApByVehiclePlateFetch } from '../../store/events/eventsSlice';
import { useFormik } from 'formik';
import { colors } from '../../theme/colors';
import {
  closeButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput
} from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';

const defaultValues = {
  vehiclePlate: ''
};

export default function CarNumberDialog({ show, handleClose }) {
  const dispatch = useDispatch();
  const accessPointId = useSelector((state) => state.cameras.accessPointId);
  const [accessPoint, setAccessPoint] = useState(null);
  const [carNumbers, setCarNumbers] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState('');
  let counter = 0;

  useEffect(() => {
    if (accessPointId != null) {
      getAccessPointById(accessPointId)
        .then((res) =>
          setAccessPoint(res.data.filter((item) => item.id == accessPointId)[0])
        )
        .catch((err) => console.error(err));

      getOpenedSessionsRequest(accessPointId)
        .then((res) => setCarNumbers(res.data))
        .catch((err) => console.error(err));
      getAccessPointSnapshot(accessPointId).then((res) => {
        setSnapshot(res.data);
      });
    }
  }, [accessPointId]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      setSelectedNumber('');
      const payload = {
        accessPointid: accessPointId,
        vehiclePlate: values.vehiclePlate
      };
      dispatch(openApByVehiclePlateFetch(payload));
    }
  });

  const handleCarNumberClick = (carNumber) => {
    setSelectedNumber(carNumber);
  };

  const handleChangeNumber = (event) => {
    setSelectedNumber(event.target.value);
    formik.handleChange(event);
  };

  const handleCloseDialog = () => {
    setSelectedNumber('');
    handleClose();
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      scroll="body"
      sx={{ '& .MuiDialog-container': { ...listStyle, position: 'relative' } }}
      PaperProps={{
        style: {
          borderRadius: '24px',
          maxWidth: '960px'
        }
      }}
    >
      <IconButton
        disableRipple
        onClick={handleCloseDialog}
        sx={[
          secondaryButtonStyle,
          {
            position: 'absolute',
            right: '16px',
            top: '16px',
            '&, &:link, &.visited': {
              px: '11px'
            }
          }
        ]}
      >
        <img style={{ width: '24px' }} src={closeIcon} />
      </IconButton>
      <DialogContent sx={{ padding: '16px' }}>
        {snapshot && (
          <img
            style={{
              width: '100%',
              borderRadius: '8px'
            }}
            src={URL.createObjectURL(snapshot)}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
        <Box
          maxWidth="sm"
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'flex',
            padding: '16px',
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '8px',
            flexGrow: 1,
            maxWidth: '500px'
          }}
        >
          <CarNumberInput
            autoFocus
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: { paddingLeft: '12px' }
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder="Введите номер"
            value={selectedNumber}
            onChange={handleChangeNumber}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehiclePlate && Boolean(formik.errors.vehiclePlate)
            }
          />
          <Button
            disableRipple
            variant="contained"
            type="submit"
            sx={closeButtonStyle}
          >
            Открыть
          </Button>
        </Box>
      </DialogActions>
      {accessPoint && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '16px',
              paddingTop: 0
            }}
          >
            {accessPoint.direction === 'out' &&
              carNumbers?.map((number, index) => {
                return (
                  <CarNumberCard
                    key={
                      number.vehicle_plate.full_plate + (counter++).toString()
                    }
                    carNumber={number.vehicle_plate}
                    isTable
                    handleClick={() =>
                      handleCarNumberClick(number.vehicle_plate.full_plate)
                    }
                  />
                );
              })}
          </Box>
        </>
      )}
    </Dialog>
  );
}
