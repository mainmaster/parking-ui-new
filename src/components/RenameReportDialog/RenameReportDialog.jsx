import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack
} from '@mui/material';
import {
  CarNumberInput,
  listStyle,
  primaryButtonStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {updateReport} from "../../api/reports.api";
import {changeCurrentPage, reportFetch} from "../../store/reports/reportsSlice";
import {useDispatch} from "react-redux";

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export function RenameReportDialog({ isOpen, handleClose, report }) {
  const [currentName, setCurrentName] = useState(report.name);
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleChangeCurrentName = (event) => {
    setCurrentName(event.target.value);
  };

  const handleSave = async () => {
    await updateReport({
      ...report,
      name: currentName,
    });
    dispatch(reportFetch());
    handleClose();
  }

  return (
    <Dialog
      open={isOpen}
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
        onClick={handleClose}
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
        {t('components.renameReportDialog.title')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Stack sx={{width: '100%'}}>
          <InputLabel htmlFor="current_name" sx={labelStyle}>
            {t('components.renameReportDialog.name')}
          </InputLabel>
          <CarNumberInput
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: { paddingLeft: '12px' }
            }}
            variant="filled"
            id="current_name"
            name="current_name"
            value={currentName}
            onChange={handleChangeCurrentName}
          />
        </Stack>
        <Button
          disableRipple
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={[primaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
        >
          {t('components.renameReportDialog.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
