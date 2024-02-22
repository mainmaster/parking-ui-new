import { colors } from './colors';

export const positiveButtonStyle = {
  '&, &:link, &.visited': {
    my: '8px',
    py: '8px',
    px: '12px',
    textTransform: 'none',
    backgroundColor: colors.button.positive.default,
    border: `1px solid ${colors.mode.open.element}`,
    borderRadius: '8px',
    color: colors.element.primary,
    boxShadow: 'none'
  },
  '&:hover': {
    backgroundColor: colors.button.positive.hover
  },
  '&:active': {
    backgroundColor: colors.button.positive.active
  },
  '&.Mui-disabled': {
    color: colors.element.inactive,
    borderColor: colors.element.inactive,
    backgroundColor: 'transparent'
  }
};

export const secondaryButtonStyle = {
  '&, &:link, &.visited': {
    my: '8px',
    py: '8px',
    px: '12px',
    textTransform: 'none',
    backgroundColor: colors.button.secondary.default,
    border: `1px solid ${colors.outline.default}`,
    borderRadius: '8px',
    color: colors.element.primary,
    boxShadow: 'none'
  },
  '&:hover': {
    backgroundColor: colors.button.secondary.hover
  },
  '&:active': {
    backgroundColor: colors.button.secondary.active
  },
  '&.Mui-disabled': {
    color: colors.element.inactive,
    borderColor: colors.element.inactive,
    backgroundColor: 'transparent'
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
