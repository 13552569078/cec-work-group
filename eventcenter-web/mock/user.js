const menudatas = require('../mock/menu.json')

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/bean-sprouts/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const { token } = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: {
          token,
          userId: 1,
          username
        }
      }
    }
  },

  // get menu datas
  {
    url: '/dispatch/menu/get',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: menudatas
      }
    }
  },

  // get user info
  {
    url: '/bean-sprouts/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/bean-sprouts/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 401
  {
    url: '/bean-sprouts/user/auth',
    type: 'post',
    response: (req, res) => {
      res.status(401)
      return {
        errorMsg: 'SSO Unauthenticated',
        errorCode: '401',
        module: {
          sso_login_url: 'https://www.baidu.com'
        }
      }
    }
  }
]
