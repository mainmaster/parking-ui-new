import {
  listStyle,
  primaryButtonStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import copy from '../../assets/svg/copy.svg';
import { useSnackbar } from 'notistack';

export default function CreatedOrderDialog({ isOpen, handleClose, data }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      {data ? (
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
            {t('components.createdOrder.title')}
          </DialogTitle>
          <DialogContent sx={{ justifyContent: 'center', p: '16px' }}>
            <Box
              maxWidth="sm"
              noValidate
              autoComplete="off"
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
              <Stack direction="row" gap={'8px'}>
                <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                  {t('components.createdOrder.sum')}
                </Typography>
                <Typography sx={{ flex: 3 }}>{data.amount}</Typography>
              </Stack>
              <Stack direction="row" gap={'8px'}>
                <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                  {t('components.createdOrder.email')}
                </Typography>
                <Typography sx={{ flex: 3 }}>{data.email}</Typography>
              </Stack>
              <Stack direction="row" gap={'8px'}>
                <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                  {t('components.createdOrder.description')}
                </Typography>
                <Typography sx={{ flex: 3 }}>{data.description}</Typography>
              </Stack>
              {data.renter && (
                <Stack direction="row" gap={'8px'}>
                  <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                    {t('components.createdOrder.renter')}
                  </Typography>
                  <Typography sx={{ flex: 3 }}>{data.companyName}</Typography>
                </Stack>
              )}
              {data.vehicle_plates && data.vehicle_plates.length ? (
                <Stack direction="row" gap={'8px'}>
                  <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                    {t('components.createdOrder.plate')}
                  </Typography>
                  <Stack sx={{flex: 3}}>
                    {data.vehicle_plates.map((vehicle) => (
                      <Typography>{vehicle.vehicle_plate} {t('components.createdOrder.to')} {vehicle.valid_until}</Typography>
                    ))}
                  </Stack>
                </Stack>
              ) : <></>}
              <Stack direction="row" gap={'8px'}>
                <Typography sx={{ flex: 1, color: '#7F7A84' }}>
                  {t('components.createdOrder.url')}
                </Typography>
                <Typography sx={{ flex: 3, overflowWrap: 'anywhere' }}>
                  {data.url}
                </Typography>
              </Stack>
              <Button
                disableRipple
                fullWidth
                variant="contained"
                onClick={() => {
                  navigator.clipboard.writeText(data.url).then(() => {
                    enqueueSnackbar(t('components.createdOrder.urlCopied'));
                  });
                }}
                startIcon={<img src={copy} alt={'copy'} />}
                sx={primaryButtonStyle({ ...theme })}
              >
                {t('components.createdOrder.copyUrl')}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}
