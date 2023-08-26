import axios from 'axios'

import { HeaderToken } from './../types/config/helper'
const score = {
  getScores: (period: string, league: number) => axios.post(`${process.env.REACT_APP_SERVER_API}/score/getScores`, { period, league }),
  saveScoreLog: (account: string, tokenId: string, shipName: string, tier: number, score: number) => axios.post(`${process.env.REACT_APP_SERVER_API}/score/saveScoreLog`, {
    account,
    tokenId,
    shipName,
    tier,
    score
  }, HeaderToken())
}

export default score