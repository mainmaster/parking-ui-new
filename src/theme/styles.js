import { colors } from './colors';

export const positiveButtonStyle = {
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

export const openButtonStyle = {
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

export const closeButtonStyle = {
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

export const autoButtonStyle = {
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

export const primaryButtonStyle = {
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

export const secondaryButtonStyle = {
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

export const listStyle = {
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

export const listWithScrollStyle = {
  height: '100dvh',
  overflowY: 'scroll'
};
