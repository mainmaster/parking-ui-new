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

export default function SettingsConfirmDialog({ show, cancel, confirm }) {
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
        Выйти без сохранения?
      </DialogTitle>
      <DialogContent sx={{ px: '16px', py: 0, minHeight: '37px' }}>
        <Typography sx={{ textAlign: 'center' }}>
          Изменения не будут применены, пока не будет нажата кнопка "Сохранить"
          в верхнеи правом углу
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
          Выйти
        </Button>
        <Button
          disableRipple
          fullWidth
          variant="contained"
          sx={secondaryButtonStyle({ ...theme })}
          onClick={cancel}
        >
          Остаться
        </Button>
      </DialogActions>
    </Dialog>
  );
}
