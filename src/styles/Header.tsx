import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  align-items: center;

  img.logo {
    width: 48px;
    position: relative;
    z-index: 9;
  }

  @media only screen and (min-width: 560px) {
    img.logo {
      width: 52px;
    }
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {

  }

  @media only screen and (min-width: 768px) and (orientation:portrait) {
    padding: 16px 24px;
    img.logo {
      width: 60px;
    }
  }

  @media only screen and (min-width: 860px) and (orientation:portrait) {

  }

  @media only screen and (min-width: 960px) {
    padding: 20px 32px;
    img.logo {
      width: 70px;
    }
  }

  @media only screen and (min-width: 1366px) {
    img.logo {
      width: 80px;
    }
  }
`

export const ButtonWallet = styled.div`
  background: url('assets/images/btn_connect.png');
  background-size: cover;
  background-position: center;
  width: 192px;
  height: 36px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;

  @media only screen and (min-width: 560px) {
    width: 216px;
    height: 40px;
    font-size: 16px;
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {

  }


  @media only screen and (min-width: 768px) and (orientation:portrait) {

  }

  @media only screen and (min-width: 860px) and (orientation:portrait) {
    width: 248px;
    height: 46px;
    font-size: 18px;
  }

  @media only screen and (min-width: 960px) {
    width: 248px;
    height: 46px;
    font-size: 18px;
  }

  @media only screen and (min-width: 1366px) {
    width: 270px;
    height: 52px;
    font-size: 20px;
  }
`