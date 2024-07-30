import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useUpdateRenterMutation,
  useCreateRentersMutation
} from '../../api/renters/renters.api';
import { accessPointsOnlyFetch } from 'store/accessPoints/accessPointsSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import checkIcon from '../../assets/svg/multiselect_check_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle
} from '../../theme/styles';
import _ from 'lodash';
import {useTranslation} from "react-i18next";

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchemaCreate = yup.object({
  username: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль'),
  company_name: yup.string().required('Введите компанию'),
  contacts: yup.string(),
  access_points: yup.string()
});

const validationSchemaEdit = yup.object({
  company_name: yup.string().required('Введите компанию'),
  contacts: yup.string(),
  access_points: yup.string()
});

export default function AddRenterDialog({ show, handleClose, edit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const renterEdit = useSelector((state) => state.renters.editRenter);
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const [updateRenter, { isError: isUpdateError }] = useUpdateRenterMutation();
  const [createRenter, { isError: isCreateError }] = useCreateRentersMutation();
  const theme = useTheme();

  const defaultValues = useMemo(() => {
    if (!_.isEmpty(renterEdit)) {
      return {
        company_name: renterEdit.company_name,
        contacts: renterEdit.contacts,
        access_points: renterEdit.access_points.join(','),
        number_of_places: renterEdit.number_of_places
      };
    } else {
      return {
        username: '',
        password: '',
        company_name: '',
        contacts: '',
        access_points: accessPoints.map(({id}) => id).join(','),
        number_of_places: 100,
      };
    }
  }, [renterEdit, show]);

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: edit ? validationSchemaEdit : validationSchemaCreate,
    onSubmit: (values) => {
      let payload = {
        ...values,
        access_points: values.access_points
          .split(',')
          .map((i) => parseInt(i, 10))
          .filter((i) => !isNaN(i))
      };
      if (edit) {
        payload = {
          ...payload,
          id: renterEdit.id
        };
        updateRenter(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar(t('components.addRenterDialog.dataSave'), { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar(t('components.addRenterDialog.errorSave'), {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      } else {
        createRenter(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar(t('components.addRenterDialog.correctAdd'), { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar(t('components.addRenterDialog.errorSave'), {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      }
      handleCloseDialog();
    }
  });

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

  const handleValueChange = (event) => {
    formik.handleChange(event);
    setSubmited(false);
  };

  const handleMultiSelectChange = (event) => {
    const {
      target: { value }
    } = event;
    const points = value.map((item) => item).join(',');
    formik.setFieldValue('access_points', points);
    setSubmited(false);
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
  };

  const resetHandle = () => {
    formik.resetForm();
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
        {edit ? t('components.addRenterDialog.editRenter') : t('components.addRenterDialog.addRenter')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
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
          {!edit && (
            <>
              <Stack>
                <InputLabel htmlFor="username" sx={labelStyle}>
                  {t('components.addRenterDialog.login')}
                </InputLabel>
                <CarNumberInput
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: { paddingLeft: '12px' }
                  }}
                  variant="filled"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={handleValueChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                />
              </Stack>
              <Stack>
                <InputLabel htmlFor="password" sx={labelStyle}>
                  {t('components.addRenterDialog.password')}
                </InputLabel>
                <CarNumberInput
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: { paddingLeft: '12px' }
                  }}
                  variant="filled"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={handleValueChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                />
              </Stack>
            </>
          )}
          <Stack>
            <InputLabel htmlFor="contacts" sx={labelStyle}>
              {t('components.addRenterDialog.contacts')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="contacts"
              name="contacts"
              value={formik.values.contacts}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contacts && Boolean(formik.errors.contacts)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="company_name" sx={labelStyle}>
              {t('components.addRenterDialog.renter')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="company_name"
              name="company_name"
              value={formik.values.company_name}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.company_name &&
                Boolean(formik.errors.company_name)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="access_points" sx={labelStyle}>
              {t('components.addRenterDialog.accessToPoint')}
            </InputLabel>
            <Select
              id="access_points"
              name="access_points"
              multiple
              displayEmpty
              value={formik.values.access_points.split(',')}
              onChange={handleMultiSelectChange}
              onBlur={formik.handleBlur}
              variant="filled"
              IconComponent={(props) => (
                <IconButton
                  disableRipple
                  {...props}
                  sx={{ top: `${0} !important`, right: `4px !important` }}
                >
                  <img
                    style={{
                      width: '24px'
                    }}
                    src={selectIcon}
                    alt="select"
                  />
                </IconButton>
              )}
              sx={selectMenuStyle({ ...theme })}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '8px',
                    border: '1px solid ' + theme.colors.outline.default
                  }
                },
                MenuListProps: {
                  sx: { py: '4px' }
                }
              }}
              renderValue={(selected) => {
                const selectedItems = accessPoints.filter((item) =>
                  selected.includes(item.id.toString())
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedItems.map((item) => item.description).join(', ') ||
                      '...'}
                  </Typography>
                );
              }}
              error={
                formik.touched.access_points &&
                Boolean(formik.errors.access_points)
              }
            >
              <MenuItem
                disableRipple
                value=""
                sx={{
                  p: '8px',
                  pl: '40px',
                  '&.Mui-selected': { backgroundColor: 'transparent' }
                }}
              >
                <Typography component={'h5'}>...</Typography>
              </MenuItem>
              {accessPoints &&
                accessPoints.map((p) => {
                  const selected = formik.values.access_points
                    .split(',')
                    .some((item) => item === p.id.toString());
                  return (
                    <MenuItem
                      key={p.id}
                      id={p.id}
                      disableRipple
                      selected={selected}
                      value={p.id.toString()}
                      sx={{
                        p: '8px',
                        '&.Mui-selected': { backgroundColor: 'transparent' }
                      }}
                    >
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        sx={{ height: '24px' }}
                        alignItems={'center'}
                      >
                        <Box sx={{ width: '24px' }}>
                          {selected && <img src={checkIcon} alt="checked" />}
                        </Box>
                        <Typography
                          component={'h5'}
                          noWrap
                          sx={{ fontWeight: 500, p: 0 }}
                        >
                          {p.description}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  );
                })}
            </Select>
          </Stack>
          <Stack>
            <InputLabel htmlFor='number_of_places' sx={labelStyle}>
              {t('components.addRenterDialog.numberOfPlaces')}
            </InputLabel>
            <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="number_of_places"
                name="number_of_places"
                value={formik.values.number_of_places}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={formik.touched.number_of_places && Boolean(formik.errors.number_of_places)}
            />
          </Stack>
          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {edit ? t('components.addRenterDialog.save') : t('components.addRenterDialog.add')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
