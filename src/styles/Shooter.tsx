import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
`

export const ShooterWrapper = styled.div`
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
`

export const MenuWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 90%;
  }

  @media only screen and (min-width: 560px) {
    img {
      width: 84%;
    }
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    img {
      width: 80%;
    }
  }

  @media only screen and (min-width: 768px) and (orientation:portrait) {
    img {
      width: 80%;
    }
  }

  @media only screen and (min-width: 860px) and (orientation:portrait) {
    img {
      width: 80%;
    }
  }

  @media only screen and (min-width: 960px) {
    img {
      width: 50%;
    }
  }

  @media only screen and (min-width: 1024px) {
    img {
      width: 50%;
    }
  }

  @media only screen and (min-width: 1366px) {
    img {
      width: 600px;
    }
  }

  @media only screen and (min-width: 1600px) {
    img {
      width: 700px;
    }
  }
`

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  
  img {
    cursor: pointer;
    margin-top: 8px;
  }
  
  img.play, img.setting {
    width: 180px;
  }

  img.playmulti {
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    }
  }

  @media only screen and (min-width: 560px) {
    img.play, img.setting {
      width: 210px;
    }
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    img.play, img.setting {
      width: 232px;
    }
  }

  @media only screen and (min-width: 768px) and (orientation:portrait) {
    img.play, img.setting {
      width: 264px;
    }
  }

  @media only screen and (min-width: 860px) and (orientation:portrait) {
    img.play, img.setting {
      width: 284px;
    }
  }

  @media only screen and (min-width: 960px){
    img.play, img.setting {
      width: 264px;
    }
  }

  @media only screen and (min-width: 1366px){
    img.play, img.setting {
      width: 284px;
    }
  }
`

export const SettingDiv = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  img {
    width: 42px;
    cursor: pointer;
  }

  @media only screen and (min-width: 560px) {
    right: 16px;
    bottom: 16px;

    img {
      width: 52px;
    }
  }

  @media only screen and (min-width: 640px) and (orientation:portrait) {
    img {
      width: 56px;
    }
  }

  @media only screen and (min-width: 768px) and (orientation:portrait) {

  }

  @media only screen and (min-width: 860px) and (orientation:portrait) {
    img {
      width: 60x;
    }
  }

  @media only screen and (min-width: 960px) {
    img {
      width: 56px;
    }
  }

  @media only screen and (min-width: 1366px) {
    img {
      width: 64px;
    }
  }

  @media only screen and (min-width: 1600px) {
    img {
      width: 70px;
    }
  }

`