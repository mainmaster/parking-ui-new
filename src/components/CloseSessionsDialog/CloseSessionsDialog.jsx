import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { closeOlderThanDateSessionsFetch } from 'store/sessions/sessionsSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  DateInputStyle
} from '../../theme/styles';
import { DateIcon } from '../Icons/DateIcon';
import {useTranslation} from "react-i18next";

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

export default function CloseSessionsDialog({ show, handleClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [date, setDate] = useState(null);
  const [submited, setSubmited] = useState(true);
  const theme = useTheme();

  const handleCloseSessions = () => {
    try {
      dispatch(closeOlderThanDateSessionsFetch(format(date, 'yyyy-MM-dd')));
      handleClose(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      setDate(newValue);
      setSubmited(false);
    }
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose(false);
  };

  const resetHandle = () => {
    setDate(null);
    setSubmited(true);
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
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
        onClick={handleCloseDialog}
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
        {t('components.closeSessionDialog.closeSessionAfterDate')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
        <Box
          maxWidth="sm"
          sx={{
            display: 'flex',
            padding: '16px',
            paddingTop: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '16px',
            flexGrow: 1,
            maxWidth: '500px'
          }}
        >
          <Stack>
            <InputLabel htmlFor="date" sx={labelStyle}>
              {t('components.closeSessionDialog.date')}
            </InputLabel>
            <DatePicker
              id="date"
              value={date}
              format={'dd.MM.yyyy'}
              maxDate={Date.now()}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  variant: 'filled',
                  sx: DateInputStyle({ ...theme }),
                  placeholder: t('components.closeSessionDialog.date')
                },
                openPickerButton: { disableRipple: true }
              }}
              slots={{
                openPickerIcon: DateIcon
              }}
            />
          </Stack>
          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            fullWidth
            onClick={handleCloseSessions}
            sx={primaryButtonStyle({ ...theme })}
          >
            {t('components.closeSessionDialog.closeSessions')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
