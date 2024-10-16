import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventFormFilter } from '../EventFormFilter/EventFormFilter';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeCurrentPage,
  eventsOnlyFetch,
  setReportFilters
} from '../../store/events/eventsSlice';
import { getAccessPointsRequest } from '../../api/access-points';
import { getEventCodesRequest, getEventReport } from '../../api/events';
import { useFormik } from 'formik';

export default function GenerateEventReport({ isOpen, handleClose }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedEventCode, setSelectedEventCode] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [timeFromValue, setTimeFromValue] = useState(null);
  const [timeToValue, setTimeToValue] = useState(null);
  const [accessPoints, setAccessPoints] = useState([]);
  const [eventCodes, setEventCodes] = useState([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState('');
  const [submited, setSubmited] = useState(true);
  const filters = useSelector((state) => state.events.reportFilters);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setReportFilters(null));
    };
  }, []);

  useEffect(() => {
    getAccessPointsRequest().then((r) => {
      let access = r.data.map((point) => {
        return {
          name: point.description,
          value: point.id
        };
      });
      setAccessPoints([...access]);
    });
  }, []);

  useEffect(() => {
    getEventCodesRequest().then((r) => {
      const codes = Object.keys(r.data).map((key) => {
        return { value: key, name: r.data[key] };
      });
      setEventCodes(codes);
    });
  }, []);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      getEventReport(filters).then((r) => {
        close();
      });
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    setSelectedEventCode('');
    setSelectedAccessPoint('');
    setFromValue(null);
    setToValue(null);
    setTimeToValue(null);
    setTimeFromValue(null);
    dispatch(setReportFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(eventsOnlyFetch());
    setSubmited(true);
  };

  const handleEventCodeChange = (event) => {
    const eventCode = eventCodes.find(
      (code) => code.name === event.target.value
    );
    if (eventCode) {
      const values = {
        ...filters,
        eventCode: eventCode.value
      };
      dispatch(setReportFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        eventCode: ''
      };
      dispatch(setReportFilters(values));
      setSubmited(false);
    }
    setSelectedEventCode(event.target.value);
  };

  const handleFromDateChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createDateFrom: parseValue
      };
      dispatch(setReportFilters(values));
      setSubmited(false);
    }
    if (newValue) {
      setFromValue(newValue);
    }
  };

  const handleToDateChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createDateTo: parseValue
      };
      dispatch(setReportFilters(values));
      setToValue(parseValue);
      setSubmited(false);
    }
  };

  const handleTimeFromChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[1].split('.')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createTimeFrom: parseValue
      };
      dispatch(setReportFilters(values));
      setTimeFromValue(newValue);
      setSubmited(false);
    }
  };

  const handleTimeToChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[1].split('.')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createTimeTo: parseValue
      };
      dispatch(setReportFilters(values));
      setTimeToValue(newValue);
      setSubmited(false);
    }
  };

  const handleAccessPointChange = (event) => {
    const accessPoint = accessPoints.find(
      (apoint) => apoint.name === event.target.value
    );
    if (accessPoint) {
      const values = {
        ...filters,
        accessPoint: accessPoint.value
      };
      dispatch(setReportFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        accessPoint: ''
      };
      dispatch(setReportFilters(values));
      setSubmited(false);
    }
    setSelectedAccessPoint(event.target.value);
  };

  const close = () => {
    resetHandle();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      scroll="body"
      sx={{
        '& .MuiDialog-container': {
          ...listStyle({ ...theme }),
          position: 'relative'
        }
      }}
      PaperProps={{
        style: {
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          minWidth: '320px',
          margin: 0
        }
      }}
    >
      <IconButton
        disableRipple
        onClick={close}
        sx={[
          secondaryButtonStyle({ ...theme }),
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
        <img style={{ width: '24px' }} src={closeIcon} alt="Close" />
      </IconButton>
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          p: '22px 48px',
          textAlign: 'center'
        }}
      >
        {t('components.generateEventReport.title')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: '16px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <EventFormFilter
            selectedEventCode={selectedEventCode}
            handleEventCodeChange={handleEventCodeChange}
            fromValue={fromValue}
            eventCodes={eventCodes}
            toValue={toValue}
            handleFromDateChanged={handleFromDateChanged}
            handleToDateChanged={handleToDateChanged}
            timeFromValue={timeFromValue}
            timeToValue={timeToValue}
            handleTimeFromChanged={handleTimeFromChanged}
            handleTimeToChanged={handleTimeToChanged}
            selectedAccessPoint={selectedAccessPoint}
            handleAccessPointChange={handleAccessPointChange}
            accessPoints={accessPoints}
            submited={submited}
            filters={filters}
            resetHandle={resetHandle}
            confirmText={t('components.generateEventReport.confirm')}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
}
