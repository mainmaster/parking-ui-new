import {CarNumberInput, listStyle, primaryButtonStyle, secondaryButtonStyle} from "../../theme/styles";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel, Stack,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import React, {useCallback} from "react";
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import * as yup from "yup";
import {editVehiclePlate} from "../../store/sessions/sessionsSlice";
import _ from "lodash";
import {enqueueSnackbar} from "notistack";

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchema = yup.object({
  plate: yup.string().required('Введите номер'),
});

export function UpdateVehiclePlateModal({
  isOpen,
  handleClose,
  plate,
  id
}) {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      plate
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload = {
        ...values,
        id
      };
      dispatch(editVehiclePlate(payload));
      formik.resetForm();
      handleClose();
    }
  })
  const theme = useTheme();
  const {t} = useTranslation();

  const handleValueChange = (event) => {
    formik.handleChange(event);
  };

  const handleValidate = useCallback(() => {
    if (!_.isEmpty(formik.errors)) {
      Object.entries(formik.errors).map((error) => {
        enqueueSnackbar(`${error[1]}`, {
          variant: 'error',
          iconVariant: 'warning'
        });
      });
    }
  }, [formik.errors]);

  const handleSubmit = (event) => {
    handleValidate();
    formik.handleSubmit(event);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="body"
      sx={{
        '& .MuiDialog-container': {
          ...listStyle({...theme}),
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
          secondaryButtonStyle({...theme}),
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
        <img style={{width: '24px'}} src={closeIcon} alt="Close"/>
      </IconButton>
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          p: '22px 48px',
          textAlign: 'center'
        }}
      >
        {t('components.updateVehiclePlateModal.title')}
      </DialogTitle>
      <DialogActions sx={{justifyContent: 'center', p: '16px'}}>
        <Box
          maxWidth="sm"
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
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
            <InputLabel htmlFor="plate" sx={labelStyle}>
              {t('components.updateVehiclePlateModal.plate')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: {paddingLeft: '12px'}
              }}
              variant="filled"
              id="plate"
              name="plate"
              value={formik.values.plate}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.plate && Boolean(formik.errors.plate)
              }
            />
          </Stack>
          <Button
            disableRipple
            fullWidth
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({...theme})}
          >
            {t('components.updateVehiclePlateModal.save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
