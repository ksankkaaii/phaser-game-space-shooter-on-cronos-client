import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 220px);
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 770px;
    width: 70%;
    margin-top: -110px;
    margin-left: 9%;
  }
`

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    width: auto;
    margin: 0 auto;
    cursor: pointer;
  }
  
  img.play {
    height: 55px;
    margin-top: 3px;
  }
  
  img.setting {
    height: 45px;
    margin-top: 5px;
  }
`

export const Setting = styled.div`
    position: absolute;
    right: 15px;
    bottom: 15px;

  img {
    width: 90px;
    cursor: pointer;
  }
`