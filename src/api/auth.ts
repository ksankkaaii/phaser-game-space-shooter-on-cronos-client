import axios from 'axios'

const auth = {
  login: async (account: string) => {

    const res = await axios.post(`${process.env.REACT_APP_SERVER_API}/auth/login`, {
      account,
    })
    return res.data
  },
}

export default auth