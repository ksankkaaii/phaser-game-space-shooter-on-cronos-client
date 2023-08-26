import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 16px;
}
`

export const AvatarWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: center;
`

export const SubTitle = styled.h3`
  font-size: 20px;
  color: white;
  text-align: center;
  font-weight: normal;

  @media only screen and (min-width: 768px) {
    font-size: 24px;
  }

  @media only screen and (min-width: 1024px) {
    font-size: 26px;
  }

  @media only screen and (min-width: 1440px) {
    font-size: 28px;
  }
`

export const Container = styled.div`
  width: 92%;

  @media only screen and (max-width: 959px) and (max-height: 800px) {
    margin-top: 164px;
  }

  @media only screen and (min-width: 960px) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 48px;
  }

  @media only screen and (min-width: 1440px) {
    gap: 64px;
  }
`

export const Left = styled.div`
    width: 100%;

    @media only screen and (min-width: 960px) {
      width: unset;
    }
  }
`

export const Title = styled.div`
  text-align: center;
  margin-top: 32px;
  img {
    width: 280px;
    margin: 0 auto;
  }

  @media only screen and (min-width: 960px) {
    margin-top: 0px;
  }
`

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;

  @media only screen and (min-width: 960px) {
    margin-top: 0px;
  }
`

export const SwiperWrapper = styled.div`
  --swiper-resolution: 260px;
  --swiper-content-resolution: 244px;
  --background-top: 30px;
  --background-height: 220px;
  --ship-title-top: 14px;
  --ship-font-size: 12px;
  --ship-content-top: 16px;
  --tier-text-fontsize: 12px;
  --tier-text-left: 16px;
  --tier-text-top: 32px;
  --tier-image-width: 32px;
  --tier-image-top: 32px;
  --tier-image-right: 16px;
  --weapon-image-left: 2px;
  --background-on: 16px;

  width: var(--swiper-resolution);
  height: var(--swiper-resolution);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 8px;
  margin-right: 8px;
  display: flex;

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    --swiper-resolution: 360px;
    --swiper-content-resolution: 336px;
    --background-top: 36px;
    --background-height: 316px;
    --ship-title-top: 20px;
    --ship-font-size: 16px;
    --ship-content-top: 16px;
    --tier-text-fontsize: 14px;
    --tier-text-left: 24px;
    --tier-text-top: 48px;
    --tier-image-width: 42px;
    --tier-image-top: 46px;
    --tier-image-right: 20px;
    --weapon-image-left: 4px;
    --background-on: 16px;
  }

  @media only screen and (min-width: 768px) and (orientation: portrait) {
    --swiper-resolution: 420px;
    --swiper-content-resolution: 396px;
    --background-top: 42px;
    --background-height: 362px;
    --ship-title-top: 24px;
    --ship-font-size: 18px;
    --ship-content-top: 20px;
    --tier-text-fontsize: 18px;
    --tier-text-left: 24px;
    --tier-text-top: 54px;
    --tier-image-width: 48px;
    --tier-image-top: 52px;
    --tier-image-right: 20px;
    --weapon-image-left: 6px;
    --background-on: 16px;
  }

  @media only screen and (min-width: 1440px) {
    --swiper-resolution: 560px;
    --swiper-content-resolution: 540px;
    --background-top: 60px;
    --background-height: 480px;
    --ship-title-top: 32px;
    --ship-font-size: 22px;
    --ship-content-top: 24px;
    --tier-text-fontsize: 22px;
    --tier-text-left: 30px;
    --tier-text-top: 70px;
    --tier-image-width: 58px;
    --tier-image-top: 70px;
    --tier-image-right: 28px;
    --weapon-image-left: 6px;
    --background-on: 20px;
  }

  --swiper-navigation-size: 24px;

  .swiper-container {
    width: var(--swiper-resolution);
    height: var(--swiper-resolution);
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-container .swiper-button-next::after,
  .swiper-container .swiper-button-prev::after {
    content: none;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img.create-game {
    object-fit: cover
  }

  .swiper-slide img.ship {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }

  .swiper-slide img.shipshield {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }
  
  .swiper-slide img.broken {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }
  .swiper-slide img.crosmonaut {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }
  .swiper-slide img.background {
    width: var(--swiper-content-resolution);
    height: var(--background-height);
    top: var(--background-top);
    position: absolute;
  }
  .swiper-slide img.on_background {
    position: absolute;
    width: var(--swiper-content-resolution);
    bottom: var( --background-on);
  }
  .swiper-slide img.booster {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }
  .swiper-slide img.weapon {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
    left: var(--weapon-image-left);
  }
  
  .swiper-slide img.banner {
    position: absolute;
    width: var(--swiper-content-resolution);
    top: var(--ship-content-top);
  }
  .swiper-slide img.tier {
    position: absolute;
    width: var(--tier-image-width);
    top: var(--tier-image-top);
    right: var(--tier-image-right);
  
  }
  
  .swiper-slide img.avatarBg {
    width: var(--swiper-resolution);
    height: var(--swiper-resolution);
    position: absolute;
    z-index: 2
  }

  .swiper-slide p.name {
    position: absolute;
    top: var(--ship-title-top);
    font-size: var(--ship-font-size);
    color: var(--color-yellow);
    z-index: 3;
  }

  .swiper-slide p.tier {
    position: absolute;
    font-size: var(--tier-text-fontsize);
    left: var(--tier-text-left);
    top: var(--tier-text-top);
    color: var(--color-yellow);
  }
`

export const Arrow = styled.div`
  display: flex;
  align-items: center;
  
  img {
    width: 24px;
    height: 36px;
    cursor: pointer;
  }

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    img {
      width: 32px;
      height: 48px;
    }
  }

  @media only screen and (min-width: 1440px) {
    img {
      width: 42px;
      height: 64px;
    }
  }
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-direction: column;
  margin-top: 48px;
  color: var(--color-yellow);

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    gap: 16px;
  }

  @media only screen and (min-width: 960px) {
    width: unset;
    margin-top: 0px;
  }
`

export const Reward = styled.div`
  font-size: 20px;
  text-align: center;

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    font-size: 24px;
  }

  @media only screen and (min-width: 1440px) {
    font-size: 30px;
  }
`

export const UpdateLevel = styled.div`
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background: rgba(40,13,95,1);
  color: white;
  cursor: pointer;

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    font-size: 24px;
  }

  @media only screen and (min-width: 1440px) {
    font-size: 30px;
  }
`

export const Join = styled.div`
  background: url('assets/images/avatar_join.png');
  font-size: 28px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 156px;
  height: 59px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;

  opacity: ${props => {
    if(props.dataLoading) {
      return `0.5`;
    }
    else {
      return `1`;
    }
  }};

  @media only screen and (min-width: 640px) and (orientation: portrait) {
    font-size: 32px;
  }

  @media only screen and (min-width: 1440px) {
    width: 164px;
    height: 63px;
    font-size: 34px;
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

`