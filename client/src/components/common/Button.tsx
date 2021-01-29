import styled from '@emotion/styled';

export const PureButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  '&[disabled]': {
    cursor: 'not-allowed',
  },
});
