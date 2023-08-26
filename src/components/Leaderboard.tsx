import {
  Wrapper,
  ModalWrapper,
  Content,
  Leagues,
  League,
  Periods,
  Table,
  THead,
  TBody,
  TRow,
  Rank,
  Name,
  Score
}
  from '../styles/Leaderboard'

const Leaderboard = ({ scores, setIsLeaderboard, league, setLeague, period, setPeriod }) => {
  return (
    <Wrapper>
      <ModalWrapper>
        <Content>
          <Leagues>
            <img className='leagues' src="assets/images/lead_leagues.png" alt="leagues" />
            <League>
              <img className={`league default ${league === 0 ? '_active' : ''}`} onClick={() => setLeague(0)} src={`assets/images/lead_default_active.png`} alt="default" />
              <img className={`league ${league === 1 ? '_active' : ''}`} onClick={() => setLeague(1)} src={`assets/images/lead_bronze_active.png`} alt="bronze" />
              <img 
                className={`league ${league === 2 ? '_active' : ''}`} 
                onClick={
                  () => setLeague(2)
                }
                src={
                  `assets/images/lead_silver_active.png`
                } 
                alt="silver" 
              />
              <img className={`league ${league === 3 ? '_active' : ''}`}  onClick={() => setLeague(3)} src={`assets/images/lead_gold_active.png`} alt="gold" />
              <img className={`league ${league === 4 ? '_active' : ''}`}  onClick={() => setLeague(4)} src={`assets/images/lead_diamond_active.png`} alt="diamond" />
              <img className={`league ${league === 5 ? '_active' : ''}`}  onClick={() => setLeague(5)} src={`assets/images/lead_platinum_active.png`} alt="platinum" />
            </League>
            <img className='close' src="assets/images/btn_close.png" alt="close" onClick={() => setIsLeaderboard(false)} />
          </Leagues>
          <Periods>
            <img className={`period ${period === 'weekly' ? '_active' : ''}`} onClick={() => setPeriod('weekly')} src={`assets/images/lead_weekly_active.png`} alt="weekly" />
            <img className={`period ${period === 'monthly' ? '_active' : ''}`} onClick={() => setPeriod('monthly')} src={`assets/images/lead_monthly_active.png`} alt="monthly" />
            <img className={`period ${period === 'all' ? '_active' : ''}`} onClick={() => setPeriod('all')} src={`assets/images/lead_all_active.png`} alt="all" />
          </Periods>
          <Table>
            <THead>
              <Rank>
                <img src="assets/images/lead_rank.png" alt="rank" />
              </Rank>
              <Name>
                <img src="assets/images/lead_name.png" alt="name" />
              </Name>
              <Score>
                <img src="assets/images/lead_score.png" alt="name" />
              </Score>
            </THead>
            <TBody>
              {scores?.map((score, index) => {

                let shipName = score.shipName+ "  (..."+score.account.slice(-4)+")"
                if (shipName.indexOf('Crosmocraft') < 0) shipName = "Crosmocraft #" + score._id 
                return <TRow key={index}>
                  <Rank>{index + 1}</Rank>
                  <Name>{shipName}</Name>
                  <Score>{score.score}</Score>
                </TRow>
              })}
              {(!scores || scores.length === 0) && <div style={{ textAlign: 'center', marginTop: 20 }}>There is no data</div>}
            </TBody>
          </Table>
        </Content>
      </ModalWrapper>
    </Wrapper>
  )
}

export default Leaderboard