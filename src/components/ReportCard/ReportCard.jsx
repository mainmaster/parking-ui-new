import { useTranslation } from 'react-i18next';
import React, { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box, Button, IconButton, Menu, MenuItem, Stack, Typography} from '@mui/material';
import { cardContainerStyle, secondaryButtonStyle } from '../../theme/styles';
import TypeAuto from '../TypeAuto';
import download from '/src/assets/svg/download_report_page.svg';
import edit from '/src/assets/svg/edit.svg';
import deleteIcon from '/src/assets/svg/delete.svg';
import {deleteReport, downloadReport} from "../../api/reports.api";
import {RenameReportDialog} from "../RenameReportDialog/RenameReportDialog";
import {reportFetch} from "../../store/reports/reportsSlice";
import {useDispatch} from "react-redux";
import { format } from 'date-fns';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export function ReportCard({ report }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      maxWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleDownloadReport = () => {
    downloadReport(report.name).then(response => {
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${report.name}.xlsx`;
      link.setAttribute('download', filename);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    })
  }

  const getReportType = (type) => {
    switch (type) {
      case 'payments':
        return t('components.reportCard.payment');
      case 'events':
        return t('components.reportCard.events');
      case 'requests':
        return t('components.reportCard.request');
      default:
        return '';
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    await deleteReport(report.id);
    dispatch(reportFetch());
  }

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{report.name}</Typography>
        <Stack gap={'12px'}>
          <Stack direction={'row'} sx={{ minHeight: '20px' }}>
            {report.status === 'waiting' ? (
              <TypeAuto type="reportNotReady" />
            ) : (
              <TypeAuto type="reportReady" />
            )}
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.reportCard.date')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {report.generate_datetime ? format(report.generate_datetime, 'dd.MM.yyyy HH:mm') : '-'}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.reportCard.type')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {getReportType(report.type)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disabled={report.status === 'waiting'}
            disableRipple
            variant="contained"
            fullWidth
            onClick={handleDownloadReport}
            sx={secondaryButtonStyle({ ...theme })}
            endIcon={<img src={download} alt={''} />}
          >
            {t('components.reportCard.download')}
          </Button>
          <IconButton
            disableRipple
            sx={[secondaryButtonStyle({ ...theme })]}
            onClick={() => setIsOpen(true)}
          >
            <img style={{ width: '24px' }} src={edit} />
          </IconButton>
          <IconButton disableRipple sx={[secondaryButtonStyle({ ...theme })]}  onClick={handleMenuClick}>
            <img style={{ width: '24px' }} src={deleteIcon} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="event-menu"
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            PaperProps={{
              elevation: 10,
              sx: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '168px',
                border: `1px solid ${theme.colors.outline.default}`,
                borderRadius: '8px',
                '& .MuiAvatar-root': {},
                '&::before': {}
              }
            }}
            MenuListProps={{ sx: { p: 0 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              id="session"
              sx={{ p: '8px', gap: '8px' }}
              onClick={handleDelete}
            >
              <img
                style={{
                  width: 24,
                  height: 24
                }}
                src={deleteIcon}
                alt={''}
              />
              <Typography>{t('components.reportCard.delete')}</Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
      {isOpen &&
      <RenameReportDialog
        isOpen={isOpen}
        report={report}
        handleClose={handleClose}
      />}
    </Box>
  );
}
