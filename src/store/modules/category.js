import { request } from "@/utils/request"

export default {
  namespaced: true,
  state: {
    // 分类信息数据
    category: [
      { name: '居家' },
      { name: '美食' },
      { name: '服饰' },
      { name: '母婴' },
      { name: '个护' },
      { name: '严选' },
      { name: '数码' },
      { name: '运动' },
      { name: '杂项' },
    ]
  },
  mutations: {
    // 改变category的值
    setCategory(state, payload) {
      state.category = payload
    },
    show(state, item) {
      const obj = state.category.find(obj => obj.id === item.id)
      obj.open = true
    },
    hide(state,item) {
      const obj = state.category.find(obj => obj.id === item.id)
      obj.open = false
    }
  },
  actions: {
    // 异步请求category数据，并提交给mutations
    async getCategory({ commit }) {
      const { result } = await request('/home/category/head', 'get')
      result.forEach(item => item.open = false)
      commit('setCategory', result)
    }
  }
}
