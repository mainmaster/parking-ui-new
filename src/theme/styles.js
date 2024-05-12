//import { colors } from './colors';
import { TextField, styled } from '@mui/material';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../constants';

export const positiveButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.positive.default,
      border: `1px solid ${colors.mode.open.element}`,
      borderRadius: '8px',
      color: colors.element.primary,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.positive.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.positive.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const openButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.open.default,
      border: `1px solid ${colors.button.open.outline}`,
      borderRadius: '8px',
      color: colors.element.primary,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.open.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.open.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const closeButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      minWidth: '90px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.close.default,
      border: `1px solid ${colors.button.close.outline}`,
      borderRadius: '8px',
      color: colors.element.light,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.close.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.close.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const autoButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.auto_mode.default,
      border: `1px solid ${colors.button.auto_mode.outline}`,
      borderRadius: '8px',
      color: colors.element.light,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.auto_mode.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.auto_mode.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const sendButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.primary.default,
      border: `1px solid ${colors.button.primary.outline}`,
      borderRadius: '20px',
      color: colors.element.primary,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.primary.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.primary.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const primaryButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: colors.button.primary.default,
      border: `1px solid ${colors.button.primary.outline}`,
      borderRadius: '8px',
      color: colors.element.light,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: colors.button.primary.hover,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: colors.button.primary.active,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };
};

export const secondaryButtonStyle = ({ colors }) => {
  return {
    '&, &:link, &.visited': {
      height: '40px',
      py: '8px',
      px: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      backgroundColor: `${colors.button.secondary.default} !important`,
      border: `1px solid ${colors.outline.default}`,
      borderRadius: '8px',
      color: colors.element.primary,
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    '&:hover': {
      backgroundColor: `${colors.button.secondary.hover}  !important`,
      boxShadow: 'none'
    },
    '&:active': {
      backgroundColor: `${colors.button.secondary.active} !important`,
      boxShadow: 'none'
    },
    '&.Mui-disabled': {
      color: colors.element.inactive,
      borderColor: colors.element.inactive,
      backgroundColor: 'transparent !important',
      boxShadow: 'none'
    }
  };
};

export const listStyle = ({ colors }) => {
  return {
    height: '100dvh',
    overflowY: 'scroll',
    scrollbarWidth: 'none', // Hide the scrollbar for firefox
    '&::-webkit-scrollbar': {
      display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
    },
    '&-ms-overflow-style:': {
      display: 'none' // Hide the scrollbar for IE
    }
  };
};

export const listWithScrollStyle = ({ colors }) => {
  return {
    height: '100dvh',
    overflowY: 'auto'
  };
};

export const CarNumberInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.surface.low,
  border: '1px solid ' + theme.colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent !important',
    paddingRight: '12px',
    '&:hover': { backgroundColor: 'transparent !important' },
    '& .Mui-focused': { backgroundColor: 'transparent !important' }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: theme.colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

export const CameraMessageInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.surface.low,
  border: '1px solid ' + theme.colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    paddingRight: 0,
    paddingLeft: '12px',
    '&:hover': { backgroundColor: 'transparent !important' },
    '& .Mui-disabled': {
      backgroundColor: 'transparent !important'
    }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: theme.colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

export const DateInputStyle = ({ colors }) => {
  return {
    width: '100%',
    backgroundColor: `${colors.surface.low} !important`,
    border: '1px solid ' + colors.outline.default,
    borderRadius: '20px',
    height: '40px',
    justifyContent: 'center',
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent !important',
      '&:hover': { backgroundColor: 'transparent !important' },
      '& .Mui-focused': { backgroundColor: 'transparent !important' },
      '&:after, &:before': {
        display: 'none'
      }
    },
    '& .MuiFilledInput-input': {
      backgroundColor: colors.surface.low,
      padding: `${0} !important`,
      width: '100%',
      fontWeight: 500,
      color: colors.element.primary,
      marginLeft: '12px'
    },
    '& .MuiIconButton-root': {
      borderRadius: 0
    }
  };
};

export const selectMenuStyle = ({ colors }) => {
  return {
    width: '100%',
    backgroundColor: `${colors.surface.low} !important`,
    border: '1px solid ' + colors.outline.default,
    borderRadius: '20px',
    height: '40px',
    justifyContent: 'center',
    '&:after, &:before': {
      display: 'none'
    },
    '&:hover, & .Mui-focused': {
      backgroundColor: `${colors.surface.low} !important`
    },
    '& .MuiFilledInput-input': {
      backgroundColor: colors.surface.low,
      alignSelf: 'center',
      padding: `${0} !important`,
      paddingRight: '28px !important',
      marginLeft: '12px',
      marginRight: '12px',
      color: colors.element.primary,
      display: 'flex',
      alignItems: 'center',
      '&:hover, &:focus': { backgroundColor: 'transparent !important' }
    }
  };
};

export const switchInputStyle = ({ colors }) => {
  return {
    width: '48px',
    height: '24px',
    p: 0,
    '& .MuiSwitch-switchBase': {
      p: 0,
      border: 2,
      borderColor: colors.toggle.toggled.track.default,
      '&:hover': {
        borderColor: colors.toggle.toggled.track.hover,
        '& + .MuiSwitch-track': {
          backgroundColor: colors.toggle.toggled.track.hover
        }
      },
      '&:active': {
        borderColor: colors.toggle.toggled.track.active,
        '& + .MuiSwitch-track': {
          backgroundColor: colors.toggle.toggled.track.active
        }
      },
      '&.Mui-checked': {
        transform: 'translateX(24px)',
        color: colors.toggle.toggled.thumb,
        border: 2,
        borderColor: colors.toggle.untoggled.track.default,
        '&:hover': {
          borderColor: colors.toggle.untoggled.track.hover,
          '& + .MuiSwitch-track': {
            backgroundColor: colors.toggle.untoggled.track.hover
          }
        },
        '&:active': {
          borderColor: colors.toggle.untoggled.track.active,
          '& + .MuiSwitch-track': {
            backgroundColor: colors.toggle.untoggled.track.active
          }
        },
        '& + .MuiSwitch-track': {
          backgroundColor: colors.toggle.untoggled.track.default,
          opacity: 1,
          border: 0,
          borderRadius: '12 px'
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        backgroundColor: colors.toggle.toggled.track.default,
        opacity: 1,
        border: 0,
        borderRadius: '12px'
      }
    },
    '& .MuiSwitch-track': {
      backgroundColor: colors.toggle.toggled.track.default,
      opacity: 1,
      border: 0,
      borderRadius: '12px'
    }
  };
};

export const desktopMenuStyle = ({ colors }) => {
  return {
    position: 'absolute',
    top: '64px',
    right: '16px',
    width: '360px',
    p: '16px',
    pt: '8px',
    //borderBottom: `1px solid ${colors.outline.surface}`,
    backgroundColor: colors.surface.low,
    borderRadius: '16px',
    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))',
    zIndex: 1
  };
};

export const mobileMenuStyle = ({ colors, border }) => {
  return {
    p: '16px',
    pt: '8px',
    backgroundColor: colors.surface.low,
    borderBottom: border ? `1px solid ${colors.outline.surface}` : 'none'
  };
};

export const mobileFooterStyle = ({ colors, spacers }) => {
  return {
    top: 'auto',
    bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: spacers.footer,
    backgroundColor: colors.surface.low
  };
};

export const mobileMoreHeaderStyle = ({ colors, spacers }) => {
  return {
    zIndex: 1200,
    top: 0,
    bottom: 'auto',
    justifyContent: 'center',
    width: '100%',
    height: spacers.more,
    backgroundColor: colors.surface.low,
    p: '16px',
    pb: '8px'
  };
};

export const mobileMoreListStyle = ({ colors, spacers }) => {
  return {
    width: '100%',
    height: `calc(100% - ${spacers.more} - ${spacers.footer})`,
    maxHeight: `calc(100dvh - ${spacers.more} - ${spacers.footer})`,
    backgroundColor: colors.surface.low,
    position: 'absolute',
    top: spacers.more,
    left: 0,
    right: 0,
    zIndex: 1100,
    overflowY: 'scroll',
    scrollbarWidth: 'none', // Hide the scrollbar for firefox
    '&::-webkit-scrollbar': {
      display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
    },
    '&-ms-overflow-style:': {
      display: 'none' // Hide the scrollbar for IE
    },
    p: '16px',
    gap: '16px'
  };
};

export const mobileMenuButtonStyle = ({ colors }) => {
  return {
    height: '56px',
    width: '100%',
    paddingBottom: '2px',
    borderWidth: 0,
    borderTop: `1px solid ${colors.outline.surface}`,
    backgroundColor: colors.surface.high,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  };
};

export const menuButtonStyle = ({ colors }) => {
  return {
    height: '80px',
    width: '72px',
    pt: '8px',
    borderRight: `1px solid ${colors.outline.surface}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer'
  };
};

export const mobileProfileTextStyle = ({ colors }) => {
  return {
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    color: colors.element.secondary
  };
};

export const menuTextStyle = ({ colors }) => {
  return {
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    textAlign: 'center',
    fontWeight: 500,
    color: colors.element.secondary,
    width: '100%',
    overflowWrap: 'break-word',
    hyphens: 'manual'
  };
};

export const vlMenuTextStyle = ({ colors }) => {
  return {
    fontSize: '1rem',
    lineHeight: '0.9rem',
    letterSpacing: '-2%',
    textAlign: 'center',
    color: colors.element.secondary,
    width: '100%',
    overflowWrap: 'break-word',
    hyphens: 'manual'
  };
};

export const selectedTextStyle = ({ colors }) => {
  return {
    color: colors.button.primary.default
  };
};

export const cardContainerStyle = ({ colors }) => {
  return {
    flex: `1 1 ${ITEM_MIN_WIDTH}px`,
    minWidth: `${ITEM_MIN_WIDTH}px`,
    maxWidth: `${ITEM_MAX_WIDTH}px`,
    border: '1px solid ' + colors.outline.separator,
    borderTop: 'none',
    borderLeft: 'none',
    p: '16px',
    backgroundColor: colors.surface.low
  };
};

export const tabStyle = ({ colors }) => {
  return {
    minHeight: '42px',
    textTransform: 'none',
    fontSize: '1rem',
    lineHeight: '1.125rem',
    fontWeight: 500,
    '&.Mui-selected': {
      color: colors.button.primary.default
    }
  };
};

export const captionTextStyle = ({ colors }) => {
  return {
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    color: colors.element.secondary
  };
};
