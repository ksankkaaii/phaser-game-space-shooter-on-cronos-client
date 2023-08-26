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
  width: 320px;
  height: 558px;
  background: url('assets/images/bg_setting_mobile.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;

  img.close {
    position: absolute;
    top: 32px;
    right: 12px;
    width: 30px;
    cursor: pointer;
  }

  @media only screen and (min-width: 560px) {
    font-size: 16px;
  }

  @media only screen and (min-width: 768px) and (orientation: portrait) {
    width: 400px;
    height: 692px;
    font-size: 18px;

    img.close {
      position: absolute;
      top: 40px;
      right: 18px;
      width: 36px;
    }
  }

  @media only screen and (min-width: 960px) { 
    background: url('assets/images/bg_setting.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    width: 818px;
    height: 450px;

    img.close {
      top: 46px;
      right: 24px;
      width: 36px;
    }
  }

  @media only screen and (min-width: 1440px) { 
    width: 952px;
    height: 526px;

    img.close {
      top: 52px;
      right: 28px;
      width: 40px;
    }
  }

`

export const SettingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  @media only screen and (min-width: 960px) { 
    margin-top: 30px;
  }
`

export const SettingRow = styled.div`
  width: 92%;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.selected ? '#0b171a' : '#12262c'};
  border: 2px solid #234955;
  border-radius: 10px;
  cursor: pointer;
  color: ${props => props.selected ? 'var(--color-yellow)' : 'white'};
`

export const Label = styled.div`

`

export const Keyboard = styled.div`

`