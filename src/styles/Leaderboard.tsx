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
  z-index: 9;
`

export const ModalWrapper = styled.div`
  width: 320px;
  height: 556px;
  background: url('assets/images/bg_leaderboard_mobile.png');
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: white;
  font-size: 14px;

  @media only screen and (min-width: 640px) and (orientation:portrait)  {
    width: 332px;
    height: 580px;
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    width: 440px;
    height: 762px;
    font-size: 16px;
  }

  @media only screen and (min-width: 960px) {
    background: url('assets/images/bg_leaderboard.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 820px;
    height: 456px;
  }

  @media only screen and (min-width: 1366px) {
    width: 1090px;
    height: 600px;
  }
`

export const Content = styled.div`
  width: 92%;
  height: 100%;
  margin: 0 auto;
  padding-top: 38px;

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    padding-top: 52px;
  }

  @media only screen and (min-width: 960px) {
    padding-top: 54px;
  }

  @media only screen and (min-width: 1366px) {
    padding-top: 72px;
  }
`

export const Leagues = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin: 0 auto;
  gap: 8px;

  img.leagues {
    width: 76px;
  }

  img.default {
    margin-left: 0;
  }
  
  img.close {
    width: 30px;
    cursor: pointer
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    img.leagues {
      width: 108px;
    }

    img.close {
      width: 36px;
    }
  }

  @media only screen and (min-width: 960px) {
    img.leagues {
      width: 128px;
    }
  }

  @media only screen and (min-width: 1366px) {
    img.leagues {
      width: 128px;
    }

    img.close {
      width: 42px;
    }
  }
`

export const League = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;

  img.league {
    width: 52px;
    cursor: pointer;
    opacity: 0.5;
  }

  img.league._active {
    opacity: 1;
  }

  img.default {

  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    img.league {
      width: 78px;
      cursor: pointer;
    }
  }

  @media only screen and (min-width: 960px) {
    gap: 2px;
    img.league {
      width: 92px;
      cursor: pointer;
    }
  }

  @media only screen and (min-width: 1366px) {
    gap: 2px;
    img.league {
      width: 128px;
      cursor: pointer;
    }
  }
`

export const Periods = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  gap: 8px;

  img.period {
    width: 64px;
    cursor: pointer;
    opacity: 0.5;
  }

  img.period._active {
    opacity: 1;
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    margin-top: 24px;
    img.period {
      width: 88px;
      cursor: pointer;
    }
  }

  @media only screen and (min-width: 960px) {
    margin-top: 16px;
    img.period {
      width: 108px;
    }
  }

  @media only screen and (min-width: 1366px) {
    margin-top: 16px;
    img.period {
      width: 128px;
    }
  }
`

export const Table = styled.div`
  height: 100%;
  margin-top: 16px;

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    margin-top: 32px;
  }

  @media only screen and (min-width: 960px) {
    margin-top: 16px;
  }
`

export const THead = styled.div`
  background: url('assets/images/lead_thead.png');
  background-size: contain;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding-top: 4px;
  padding-bottom: 4px;
  img {
    width: 36px;
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    img {
      width: 48px;
    }
    padding-top: 8px;
    padding-bottom: 8px;
  }

  @media only screen and (min-width: 960px) {
    img {
      width: 56px;
    }
    padding-top: 6px;
    padding-bottom: 6px;
  }

  @media only screen and (min-width: 1366px) {
    img {
      width: 64px;
    }
    padding-top: 8px;
    padding-bottom: 8px;
  }
`

export const TBody = styled.div`
  overflow-y: scroll;
  height: calc(100% - 124px);

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    margin-left: 10px;
    background: #40808a;
    border-radius: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: white; 
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: wheat; 
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    height: calc(100% - 196px);

    /* width */
    ::-webkit-scrollbar {
      width: 14px;
      border-radius: 8px;
    }
  
    /* Track */
    ::-webkit-scrollbar-track {
      border-radius: 8px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
    }
  
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: wheat; 
    }
  }
  
  @media only screen and (min-width: 960px) {
    height: calc(100% - 164px);

    /* width */
    ::-webkit-scrollbar {
      width: 14px;
      border-radius: 8px;
    }
  
    /* Track */
    ::-webkit-scrollbar-track {
      border-radius: 8px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
    }
  
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: wheat; 
    }
  }

  @media only screen and (min-width: 1366px) {
    height: calc(100% - 200px);

    /* width */
    ::-webkit-scrollbar {
      width: 18px;
      border-radius: 10px;
    }
  
    /* Track */
    ::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }
  
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: wheat; 
    }
  }
`

export const TRow = styled.div`
  background: #40808a;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  @media only screen and (min-width: 960px)  {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`

export const Rank = styled.div`
  width: 15%;
  padding-left: 16px;
`

export const Name = styled.div`
  width: 55%;
  text-align: right;

`

export const Score = styled.div`
  width: 30%;
  text-align: right;
  padding-right: 16px;

  img {
    height: 12px;  
  }

  @media only screen and (min-width: 768px) and (orientation:portrait)  {
    img {
      height: 16px;
    }
  }

  @media only screen and (min-width: 960px) {
    img {
      height: 20px;
    }
  }

  @media only screen and (min-width: 1366px) {
    img {
      height: 22px;
    }
  }
`