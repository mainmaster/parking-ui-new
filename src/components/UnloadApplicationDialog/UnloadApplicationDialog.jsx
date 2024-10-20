import ApplicationFilterForm from '../ApplicationFilterForm/ApplicationFilterForm';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setUnloadFilter } from '../../store/applications/applicationSlice';
import { useFormik } from 'formik';
import { format } from 'date-fns';
import i18n from '../../translation/index';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import { unloadApplication } from '../../api/applications';

let applicationStatusValues = [
  { value: 'true', name: i18n.t('components.applicationFilter.statusUsed') },
  { value: 'false', name: i18n.t('components.applicationFilter.statusNotUsed') }
];

const defaultValues = {
  companyName: ''
};

export function UnloadApplicationDialog({ isOpen, handleClose }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    applicationStatusValues = [
      {
        value: 'true',
        name: i18n.t('components.applicationFilter.statusUsed')
      },
      {
        value: 'false',
        name: i18n.t('components.applicationFilter.statusNotUsed')
      }
    ];
  }, [i18n.language]);

  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState('');
  const filters = useSelector((state) => state.applications.unloadFilters);

  const userType = useSelector((state) => state.parkingInfo.userType);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    return () => {
      dispatch(setUnloadFilter(null));
    };
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      unloadApplication(filters).then((r) => {
        close();
      });
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(setUnloadFilter(null));
    setFromValue(null);
    setToValue(null);
    setSelectedCompany('');
    setSelectedApplicationStatus('');
  };

  const handleFromDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        validForDateFrom: format(newValue, 'yyyy-MM-dd')
      };
      dispatch(setUnloadFilter(values));
      setFromValue(newValue);
    }
  };

  const handleToDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        validForDateTo: format(newValue, 'yyyy-MM-dd')
      };
      dispatch(setUnloadFilter(values));
      setToValue(newValue);
    }
  };

  const handleCompanyChange = (event) => {
    const values = {
      ...filters,
      companyID: event.target.value
    };
    dispatch(setUnloadFilter(values));
    setSelectedCompany(event.target.value);
  };

  const handleApplicationStatusChange = (event) => {
    const status = applicationStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        isUsed: status.value
      };
      dispatch(setUnloadFilter(values));
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isUsed: ''
      };
      dispatch(setUnloadFilter(values));
    }
    setSelectedApplicationStatus(event.target.value);
  };

  const close = () => {
    handleClose();
    resetHandle();
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
        {t('components.unloadApplicationDialog.title')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: '16px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <ApplicationFilterForm
            fromValue={fromValue}
            toValue={toValue}
            handleFromDateChanged={handleFromDateChanged}
            userType={userType}
            selectedCompany={selectedCompany}
            handleCompanyChange={handleCompanyChange}
            handleToDateChanged={handleToDateChanged}
            selectedApplicationStatus={selectedApplicationStatus}
            handleApplicationStatusChange={handleApplicationStatusChange}
            submited={false}
            resetHandle={resetHandle}
            filters={filters}
            submitedText={t('components.unloadApplicationDialog.confirm')}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
}
