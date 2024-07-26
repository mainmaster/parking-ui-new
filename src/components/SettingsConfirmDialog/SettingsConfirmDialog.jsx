import {
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {useTranslation} from "react-i18next";

export default function SettingsConfirmDialog({ show, cancel, confirm }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Dialog
      open={show}
      onClose={cancel}
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
        onClick={cancel}
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
        <img style={{ width: '24px' }} src={closeIcon} />
      </IconButton>
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          p: '22px 48px',
          textAlign: 'center'
        }}
      >
        {t('components.settingConfirmDialog.outWithoutSave')}?
      </DialogTitle>
      <DialogContent sx={{ px: '16px', py: 0, minHeight: '37px' }}>
        <Typography sx={{ textAlign: 'center' }}>
          {t('components.settingConfirmDialog.changeDontSave')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: '16px' }}>
        <Button
          disableRipple
          fullWidth
          variant="contained"
          sx={secondaryButtonStyle({ ...theme })}
          onClick={confirm}
        >
          {t('components.settingConfirmDialog.exit')}
        </Button>
        <Button
          disableRipple
          fullWidth
          variant="contained"
          sx={secondaryButtonStyle({ ...theme })}
          onClick={cancel}
        >
          {t('components.settingConfirmDialog.stay')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
