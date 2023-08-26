import styled from 'styled-components'

export const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #00000066;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalWrapper = styled.div`
  background: url('assets/images/bg_confirm.png');
  background-position: center;
  background-size: cover;
  @media only screen and (orientation:portrait)  {
    transform: rotate(90deg);
  }
  position: absolute;
  width: 360px;
  height: 198px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media only screen and (min-width: 860px)  {
    width: 480px;
    height: 264px;
  }

  @media only screen and (min-width: 1024)  {
    width: 640px;
    height: 352px;
  }

  @media only screen and (min-width: 1366px)  {
    width: 860px;
    height: 473px;
  }
`

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  img {
    width: 64px;
    cursor: pointer;
  }

  @media only screen and (min-width: 860px)  {
    img {
      width: 80px;
    }
  }

  @media only screen and (min-width: 1024)  {
    img {
      width: 96px;
    }
  }

  @media only screen and (min-width: 1366px)  {
    img {
      width: 112px;
    }
  }
`