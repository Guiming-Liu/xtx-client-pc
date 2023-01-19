// 用户信息模块
export default {
  namespaced: true,
  state: {
    // 用户信息数据
    profile: {
      id: '',
      avatar: '',
      account: '',
      password: '',
      mobile: '',
      nickname: '',
      token: ''
    },
    // 记录需要回跳的地址
    redirectUrl: '/'
  },
  mutations: {
    // 修改用户信息，payload就是用户信息对象
    setUser(state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl(state, url) {
      state.redirectUrl = url
    }
  },
  actions: {
    // 请求用户信息

  }
}
