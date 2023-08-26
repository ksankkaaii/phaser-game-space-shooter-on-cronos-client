import styled from 'styled-components'

export const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #00000066;
  z-index: 9;
`

export const ModalWrapper = styled.div`
  background: url('assets/images/bg_difficulty.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 384px;
  color: white;

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    width: 488px;
    height: 600px;
  }

  @media only screen and (min-width: 1600px) {
    width: 688px;
    height: 768px;
  }
  
`

export const Content = styled.div`
  text-align: center;

  img.close {
    position: absolute;
    width: 30px;
    cursor: pointer;
    top: 54px;
    right: 20px;
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    img.close {
      width: 42px;
      top: 78px;
      right: 28px;
    }
  }

  @media only screen and (min-width: 1600px) {
    img.close {
      width: 48px;
      top: 78px;
      right: 42px;
    }
  }
`

export const Title = styled.div`
  margin-top: 86px;
  margin-bottom: 16px;
  font-size: 24px;

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    margin-top: 164px;
    margin-bottom: 32px;
    font-size: 36px;
  }

  @media only screen and (min-width: 1600px) {
    margin-top: 192px;
    margin-bottom: 40px;
    font-size: 40px;
  }
`

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  img.difficulty {
    width: 108px;
    margin-top: 10px;
    cursor: pointer;
    opacity: 0.5;
  }

  img.difficulty._active {
    opacity: 1;
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    img.difficulty {
      width: 128px;
      margin-top: 12px;
    }
  }

  @media only screen and (min-width: 1600px) {
    img.difficulty {
      width: 144px;
      margin-top: 12px;
    }
  }
`