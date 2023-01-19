import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'
export default createStore({
  state: {
    // 数据
  },
  getters: {
    // vuex的计算属性
  },
  mutations: {
    // 改变数据的函数
  },
  actions: {
    // 请求数据的函数
  },
  modules: {
    // 分模块
    user,
    cart,
    category
  },
  // 使用vuex-persistedstate插件进行持久化，其中user和cart需要持久化
  plugins: [
    createPersistedstate({
      key: 'xtx-client-pc',
      paths: ['user', 'cart']
    })
  ]
})
