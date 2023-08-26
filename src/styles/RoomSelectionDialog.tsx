import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
`

export const ButtonWrapper = styled.div`
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const SubTitle = styled.h3`
  font-size: 18px;
  color: var(--color-yellow);
  text-align: center;
  font-weight: normal;
`

export const ProgressBarWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-yellow);

  h3 {
    color: var(--color-yellow);
  }
`