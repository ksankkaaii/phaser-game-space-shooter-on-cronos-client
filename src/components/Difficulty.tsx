import {
  Wrapper,
  ModalWrapper,
  Content,
  Title,
  Buttons,
}
  from '../styles/Difficulty'

const Difficulty = ({ setIsDifficulty, difficulty, setDifficulty }) => {

  return (
    <Wrapper>
      <ModalWrapper>
        <Content>
          <Title>
            CHOOSE DIFFICULTY
          </Title>
          <Buttons>
            <img 
              className={`difficulty ${difficulty === 'easy' ? '_active' : ''}`} 
              onClick={() => setDifficulty('easy')}
              src={`assets/images/difficulty_easy_active.png`} 
              alt="easy" 
            />
            <img 
              className={`difficulty ${difficulty === 'medium' ? '_active' : ''}`} 
              onClick={() => setDifficulty('medium')}
              src={`assets/images/difficulty_medium_active.png`} 
              alt="medium" 
            />
            <img 
             className={`difficulty ${difficulty === 'hard' ? '_active' : ''}`} 
              onClick={() => setDifficulty('hard')}
              src={`assets/images/difficulty_hard_active.png`} 
              alt="hard"
            />
            <img 
             className={`difficulty ${difficulty === 'extreme' ? '_active' : ''}`} 
              onClick={() => setDifficulty('extreme')}
              src={`assets/images/difficulty_extreme_active.png`} 
              alt="extreme"
            />
          </Buttons>
          <img className='close' src="assets/images/btn_close.png" alt="close" onClick={() => setIsDifficulty(false)} />
        </Content>
      </ModalWrapper>
    </Wrapper>
  )
}

export default Difficulty