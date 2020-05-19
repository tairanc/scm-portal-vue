import axios from '@/api/interception'

const logout = () => {
  return axios({
    method: 'POST',
    url: '/scm-web' + '/account/user/logout'
  })
}

export default {
  logout
}
