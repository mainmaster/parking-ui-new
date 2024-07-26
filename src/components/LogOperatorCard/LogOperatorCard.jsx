import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import { operatorAccessOptions } from '../../constants';
import { setEditOperator } from '../../store/operator/operatorSlice';
import { useDeleteOperatorMutation } from '../../api/operator/operator.api';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

export default function LogOperatorCard({ operator }) {
  const { t } = useTranslation();
  const [deleteOperator] = useDeleteOperatorMutation();
  const dispatch = useDispatch();
  const urlStatus = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const filteredAccessOptions = useMemo(
    () =>
      operatorAccessOptions.filter(
        (option) =>
          Object.keys(operator).includes(option.value) &&
          operator[option.value] === true
      ),
    [operator]
  );

  const handleEditOperatorClick = () => {
    dispatch(setEditOperator(operator));
  };

  const handleDeleteOperatorClick = () => {
    deleteOperator(operator.id);
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack
        justifyContent={'space-between'}
        sx={{ height: '100%' }}
        gap={'16px'}
      >
        <Stack gap={'16px'}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography sx={titleTextStyle}>{operator.username}</Typography>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: theme.colors.element.secondary
              }}
            >{`№ ${operator.id}`}</Typography>
          </Stack>
          <Stack gap={'4px'}>
            <Typography sx={labelTextStyle}>{t('components.logOperatorCard.access')}</Typography>
            {filteredAccessOptions && (
              <Typography sx={{ fontWeight: 500 }}>
                {filteredAccessOptions.map((option) => option.name).join(', ')}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditOperatorClick}
          >
            {t('components.logOperatorCard.change')}
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleDeleteOperatorClick}
          >
            {t('components.logOperatorCard.delete')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
