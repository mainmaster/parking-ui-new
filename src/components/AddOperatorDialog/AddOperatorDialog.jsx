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
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useUpdateOperatorMutation,
  useCreateOperatorMutation
} from '../../api/operator/operator.api';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput
} from '../../theme/styles';
import _ from 'lodash';
import { operatorAccessOptions } from '../../constants';
import { CheckedIcon } from '../Icons/CheckedIcon';
import theme from '../../theme/normal';

const initialValues = {
  username: '',
  password: ''
};

let initialAccessValues = {};
operatorAccessOptions.map((option) => {
  const key = option.value;
  initialAccessValues = { ...initialAccessValues, [key]: false };
});

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchema = yup.object({
  username: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль')
});

export default function AddOperatorDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const operatorEdit = useSelector((state) => state.operator.editOperator);
  const [updateOperator, { isError: isUpdateError }] =
    useUpdateOperatorMutation();
  const [createOperator, { isError: isCreateError }] =
    useCreateOperatorMutation();
  const [accessValues, setAccessValues] = useState(initialAccessValues);
  const theme = useTheme();

  useEffect(() => {
    if (operatorEdit) {
      let values = { ...accessValues };
      operatorAccessOptions.map((option) => {
        const key = option.value;
        const editKey = Object.keys(operatorEdit).find((k) => k === key);
        let value;
        if (option.virtual && option.children) {
          let changeParent = true;
          const firstValue = operatorEdit[option.children[0]] || false;
          option.children.map((child) => {
            if (operatorEdit[child] !== firstValue) {
              changeParent = false;
            }
          });
          if (changeParent) {
            value = firstValue;
          }
        } else {
          value = operatorEdit[key] || false;
        }
        values = { ...values, [key]: value };
      });
      setAccessValues(values);
    } else {
      setAccessValues(initialAccessValues);
    }
  }, [operatorEdit]);

  const handleAccessValueChanged = useCallback(
    (e) => {
      let values = {};
      const option = operatorAccessOptions.find(
        (option) => option.value === e.target.name
      );
      if (option && !option.child && option.children) {
        option.children.map((child) => {
          values = { ...values, [child]: Boolean(e.target.checked) };
        });
      }
      if (option && option.child) {
        const parent = operatorAccessOptions.find(
          (o) => o.value === option.parent
        );
        if (parent) {
          let changeParent = true;
          parent.children.map((child) => {
            if (
              child !== e.target.name &&
              accessValues[child] !== Boolean(e.target.checked)
            ) {
              changeParent = false;
            }
          });
          if (changeParent) {
            values = { ...values, [parent.value]: Boolean(e.target.checked) };
          }
        }
      }
      values = { ...values, [e.target.name]: Boolean(e.target.checked) };
      setAccessValues({ ...accessValues, ...values });
      setSubmited(false);
    },
    [accessValues]
  );

  const formik = useFormik({
    initialValues: operatorEdit ? {} : initialValues,
    enableReinitialize: true,
    validationSchema: operatorEdit ? yup.object({}) : validationSchema,
    onSubmit: (values) => {
      const filteredAccessValues = Object.keys(accessValues)
        .filter((key) => {
          const option = operatorAccessOptions.find(
            (option) => option.value === key
          );
          if (option && option.virtual) {
            return false;
          }
          return true;
        })
        .reduce((obj, key) => {
          return { ...obj, [key]: accessValues[key] };
        }, {});
      let payload = {
        ...values,
        ...filteredAccessValues
      };
      if (edit) {
        payload = {
          ...payload,
          id: operatorEdit.id
        };
        updateOperator(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar('Данные сохранены', { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar('Ошибка, попробуйте позже', {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      } else {
        createOperator(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar('Оператор добавлен', { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar('Ошибка, попробуйте позже', {
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

  const handleCheckboxChange = (e) => {
    setAccessValues({
      ...accessValues,
      [e.target.name]: Boolean(e.target.checked)
    });
    setSubmited(false);
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
  };

  const resetHandle = () => {
    formik.resetForm();
    setAccessValues(initialAccessValues);
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
        {edit ? 'Редактировать оператора' : 'Добавить оператора'}
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
                  Логин
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
                  Пароль
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
          <FormGroup>
            <Typography sx={[labelStyle, { pb: '8px' }]}>Доступ</Typography>
            {operatorAccessOptions.map((option) => (
              <Stack direction={'row'} key={option.value}>
                <Box sx={{ minWidth: '8px' }} />
                <FormControlLabel
                  sx={{ pl: option.child ? '32px' : 0 }}
                  control={
                    <Checkbox
                      disableRipple
                      name={option.value}
                      checked={accessValues[option.value]}
                      onChange={handleAccessValueChanged}
                      checkedIcon={<CheckedIcon />}
                      sx={{ p: '8px' }}
                    />
                  }
                  label={option.name}
                />
              </Stack>
            ))}
          </FormGroup>
          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {edit ? 'Сохранить' : 'Добавить'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
