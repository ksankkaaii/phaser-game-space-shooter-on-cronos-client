import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    margin-top: 10%;
  }

  @media only screen and (max-width: 639px) {
    max-width: 100%;
    margin-top: 10%;
  }

  @media only screen and (max-width: 560px) {
    max-width: 100%;
    margin-top: 45%;
  }
}
`

export const AvatarWrapper = styled.div`
  width: 88%;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    width: 92%;
    max-width: 100%;
  }
  
  @media only screen and (max-width: 639px) {
    width: 92%;
  }
`

export const SubTitle = styled.h3`
  font-size: 25px;
  color: white;
  text-align: center;
  font-weight: normal;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    p {
      font-size: 24px;
      color: #FFFFFF;
    }
    img {
      width: 90%;
    }
  }

  @media only screen and (max-width: 639px) {
    p {
      font-size: 24px;
      color: #FFFFFF;
    }
    img {
      width: 90%;
    }
  }
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 639px) {
    display: block;
  }
`

export const Left = styled.div`
  width: 70%;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    width: 50%;
  }
  
  @media only screen and (max-width: 639px) {
    width: 100%;
    max-width: 100%;
  }

  @media only screen and (max-width: 560px) {
    
  }

  @media only screen and (max-width: 480px) {
    
  }
`

export const Title = styled.div`
  text-align: center;
  margin-bottom: 10px;
  p {
    font-size: 48px;
    color: #FFFFFF;
  }
  img {
    width: 450px;
  }
  
  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    margin-bottom: 8px;
    p {
      font-size: 24px;
      color: #FFFFFF;
    }
    img {
      width: 78%;
    }
  }

  @media only screen and (max-width: 639px) {
    margin-bottom: 16px;
    p {
      font-size: 38px;
      color: #FFFFFF;
    }
    img {
      width: 90%;
    }
  }
`

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
`

export const SwiperWrapper = styled.div`
  width: 425px;
  height: 460px;
  background-size: contain;
  margin: 0 auto;
  display: flex;

  --swiper-navigation-size: 24px;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    width: 226px;
    height: 226px;
  }

  @media only screen and (max-width: 639px) {
    width: 312px;
    height: 312px;
  }

  @media only screen and (max-width: 480px) {
    width: 264px;
    height: 264px;
    max-height: fit-content;
  }

  .swiper-container {
    width: 425px;
    height: 440px;
    border-radius: 8px;
    overflow: hidden;

    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      height: 226px;
    }
    

    @media only screen and (max-width: 639px) {
      width: 312px;
      height: 312px;
    }
  }

  .swiper-container .swiper-button-next::after,
  .swiper-container .swiper-button-prev::after {
    content: none;
  }

  .swiper-slide {
    height: 440px;
    margin-left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      height: 235px;
    }

    @media only screen and (max-width: 480px) {
      width: 264px;
      height: 264px;
    }
  }

  .swiper-slide img.create-game {
    width: 100%;
    height: 100%;
    object-fit: cover
  }

  .swiper-slide p.title {
    position: absolute;
    color: white;
    font-size: 36px;
  }

  .swiper-slide img.ship {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }

    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }

  .swiper-slide img.shield {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;

    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  
  .swiper-slide img.broken {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  .swiper-slide img.crosmonaut {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  .swiper-slide img.background {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  .swiper-slide img.on_background {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
      top: -30px;
    }
  }
  .swiper-slide img.booster {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  .swiper-slide img.weapon {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  
  .swiper-slide img.banner {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 12px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      top: -36px;
      left: 0px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      left: 0px;
    }
  }
  .swiper-slide img.tier {
    position: absolute;
    width: 80px;
    top: 20px;
    right: 33px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      top: 0px;
      left: 0px;
    }
  }
  
  .swiper-slide img.avatarBg {
    position: absolute;
    top: -46px;
    left: 2px;
    width: 421px;
    height: 462px;
    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      height: 226px;
      top: -45px;
      left: 1px;
    }
    @media only screen and (max-width: 480px) {
      width: 264px;
      height: 264px;
      top: -26px;
      left: 0;
      height: calc(100% + 30px);
    }
  }

  .swiper-slide p.name {
    position: absolute;
    top: -15px;
    left: calc(50% );
    transform: translate(-50%, 0);
    font-size: 16px;
    color: var(--color-yellow);

    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 226px;
      width: 226px;
      text-align: center;
      top: -32px;
    }

    @media only screen and (max-width: 480px) {
      top: -20px;
      top: -16px;
      width: 264px;
      text-align: center;
    }
  }

  .swiper-slide p.tier {
    position: absolute;
    left: calc(50% - 10px);
    bottom: 50px;
    transform: translate(-50%, 0);
    font-size: 16px;
    color: var(--color-yellow);
  }
`

export const Arrow = styled.div`
  display: flex;
  align-items: center;
  
  img {
    width: 50px;
    height: 55px;
    cursor: pointer;

    @media only screen and (max-width: 1024px) and (orientation:landscape)  {
      width: 30px;
      height: 30x;
    }

    @media only screen and (max-width: 480px) {
      width: 32px;
      height: 32px;
      margin-top: 26px;
    }
  }
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 300px;
  flex-direction: column;
  margin-top: 65px;

  color: var(--color-yellow);

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    width: 50%;
    height: auto;
    margin-top: 0;
    justify-content: center;
  }

  @media only screen and (max-width: 639px) {
    width: 100%;
    margin-top: 32px;
  }

  @media only screen and (max-width: 480px) {
    width: 100%;
    height: auto;
    margin-top: 32px;
  }
`

export const Reward = styled.div`
  font-size: 23px;
  text-align: center;
  span {
    padding-top: 4px;
  }

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    font-size: 18px;
    margin-bottom: 8px;
  }

  @media only screen and (max-width: 639px) {
    margin-bottom: 8px;
    font-size: 18px;
  }
`

export const UpdateLevel = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  background: rgba(40,13,95,1);
  color: white;
  cursor: pointer;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    font-size: 18px;
    margin-bottom: 8px;
  }

  @media only screen and (max-width: 639px) {
    margin-bottom: 8px;
    font-size: 18px;
  }
`

export const Join = styled.div`
  background: url('assets/images/avatar_join.png');
  font-size: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  width: 132px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    width: 102px;
    height: 38px;
    margin-bottom: 8px;
    font-size: 18px;
  }

  @media only screen and (max-width: 639px) {
    width: 102px;
    height: 38px;
    margin-bottom: 8px;
    font-size: 18px;
  }
`

export const ModeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img.room {
    width: 80px;
    object-fit: cover;
    opacity: 0.45;
    &:hover {
      cursor: pointer;
    }
  }
  img.room.selected {
    opacity: 1 !important
  }

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    margin-bottom: 8px;
    font-size: 18px;
  }

  @media only screen and (max-width: 639px) {
    margin-bottom: 8px;
    font-size: 18px;
  }
`

export const GameMode = styled.div`
  width: 80px;
  margin-right: 4px;
  margin-left: 4px;
  padding: 8px 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  background-image: ${props => props.bgColor};
  color: white;
  cursor: pointer;

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    margin-bottom: 8px;
  }

  @media only screen and (max-width: 639px) {
    margin-bottom: 8px;
  }
`