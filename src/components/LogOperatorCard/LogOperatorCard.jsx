import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import {
  ITEM_MAX_WIDTH,
  ITEM_MIN_WIDTH,
  operatorAccessOptions
} from '../../constants';
import { setEditOperator } from '../../store/operator/operatorSlice';
import { useDeleteOperatorMutation } from '../../api/operator/operator.api';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const cardContainerStyle = {
  flex: `1 1 ${ITEM_MIN_WIDTH}px`,
  minWidth: `${ITEM_MIN_WIDTH}px`,
  maxWidth: `${ITEM_MAX_WIDTH}px`,
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogOperatorCard({ operator }) {
  const [deleteOperator] = useDeleteOperatorMutation();
  const dispatch = useDispatch();
  const urlStatus = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
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
                color: colors.element.secondary
              }}
            >{`№ ${operator.id}`}</Typography>
          </Stack>
          <Stack gap={'4px'}>
            <Typography sx={labelTextStyle}>Доступ</Typography>
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
            sx={secondaryButtonStyle}
            onClick={handleEditOperatorClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeleteOperatorClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
