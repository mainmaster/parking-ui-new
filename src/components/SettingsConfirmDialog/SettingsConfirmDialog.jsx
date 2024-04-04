import {
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';

export default function SettingsConfirmDialog({ blocker }) {
  return (
    <Dialog
      open={blocker.state === 'blocked'}
      onClose={() => blocker.reset()}
      scroll="body"
      sx={{
        '& .MuiDialog-container': { ...listStyle, position: 'relative' }
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
        onClick={() => blocker.reset()}
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
      <DialogContent>
        <Typography>
          Изменения не будут применены, пока не будет нажата кнопка "Сохранить"
          в верхнеи правом углу
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
        <Button
          disableRipple
          variant="contained"
          sx={secondaryButtonStyle}
          onClick={() => blocker.proceed()}
        >
          Выйти
        </Button>
        <Button
          disableRipple
          variant="contained"
          sx={secondaryButtonStyle}
          onClick={() => blocker.reset()}
        >
          Остаться
        </Button>
      </DialogActions>
    </Dialog>
  );
}
