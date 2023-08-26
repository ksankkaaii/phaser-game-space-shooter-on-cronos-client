import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('assets/images/${props => props.bg}.png');
  background-position: center;
  background-size: cover;
  overflow: auto;
}
`

export const ProgressBarWrapper = styled.div`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translate(-50%, 0%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #4a97d2;
  z-index: 9;

  @media only screen and (max-width: 1024px) and (orientation:portrait)  {
    bottom: 16px;
    top: unset;
  }
  
  @media only screen and (max-width: 960px) and (orientation:portrait)  {
      
  }
  
  @media only screen and (max-width: 860px) and (orientation:portrait)  {
      
  }
  
  @media only screen and (max-width: 768px) and (orientation:portrait)  {
      
  }

  @media only screen and (max-width: 1024px) and (orientation:landscape)  {
    bottom: 8px;
    top: unset;
  }
  
  @media only screen and (max-width: 960px) and (orientation:landscape)  {
      
  }
  
  @media only screen and (max-width: 860px) and (orientation:landscape)  {
      
  }
  
  @media only screen and (max-width: 768px) and (orientation:landscape)  {
      
  }

  @media only screen and (max-width: 639px) {
    font-size: 18px;
  }
`

export const Subtitle = styled.div`
  font-size: 18px;
  color: white;
  text-align: center;
  font-weight: normal;
`