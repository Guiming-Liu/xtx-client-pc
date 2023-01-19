import { checkAllCart, deleteCart, findCartList, getNewCartGoods, insertCart, mergeLocalCart, updateCart } from "@/api"

// 购物车信息模块
export default {
  namespaced: true,
  state: {
    // 购物车清单
    list: []
  },
  // state里面的商品是所有购物车的商品，包括有效和无效的，我们在头部购物车只展示有效的，所以用计算属性，获得有限商品的数据
  getters: {
    // 有效商品列表  商品库存大于0，并且有效，isEffective为true
    validList(state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品的总件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品的总金额
    validAmount(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count * parseInt(c.nowPrice * 100), 0) / 100
    },

    // 无效商品列表
    invalidList(state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品的总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p,c) => p + parseInt(c.nowPrice*100*c.count), 0)/100
    },
    // 是否全选
    ischeckAll(state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  },
  mutations: {
    // 加入购物车
    insertCart(state, payload) {
      // 约定：加入购物车的字段必须和后端保持一致
      // 字段：id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1.先判断购物车是否已有相同的商品
      // 2.如果有相同的商品，查询它的数量，记录下来，删除购物车的商品，把新的加进来，并把原来的商品数量叠加到的新商品上，把新加入的商品置顶到购物车最上面
      // 3.如果没有相同的商品，直接把新商品保持到最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex >= 0) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },

    // 修改购物车商品信息
    updateCart(state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改
      // 1.goods中必须有skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        // 布尔值false需要使用
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },

    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },

    // 设置购物车
    setCartList(state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并本地购物车
    async mergeCart(context) {
      // 存储token后调用合并Api接口函数，进行购物车合并
      const cartList = context.getters.validList.map(goods => {
        return {
          skuId:goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)
      // 合并成功后，将本地购物车删除
      context.commit('setCartList', [])
    },

    // 加入购物车
    insertCart(context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          insertCart({skuId:payload.skuId, count:payload.count}).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },

    // 获取购物车列表
    findCartList(context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录
          findCartList().then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，再调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功后，调用then
          // 传参数给promise数组
          const promiseArr = context.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    },

    // 修改购物车商品信息
    updateCart(context, goods) {
      // goods中必须有skuId, 其他想修改的属性 selected count
      return new Promise ((resolve, reject) => {
        if(context.rootState.user.profile.token) {
          // 已登录
          updateCart(goods).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          context.commit('updateCart', goods)
          resolve()
        }
      })
    },

    // 有效商品的全选和反选
    checkAllCart(context, selected) {
      return new Promise((resolve, reject) => {
        if(context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({selected, ids}).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 获取有效的商品列表，遍历的去调用修改mutations即可
          context.getters.validList.forEach(item => {
            context.commit('updateCart', {skuId:item.skuId, selected})
          })
          resolve()
        }
      })
    },

    // 删除购物车商品
    deleteCart(context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          deleteCart([skuId]).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    // 批量删除选中商品
    batchDeleteCart(context, isClear) {
      return new Promise((resolve, reject) => {
        if(context.rootState.user.profile.token) {
          // 已登录
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = context.getters[isClear?'invalidList':'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1.获取商品列表，进行遍历调用deleteCart mutations函数
          context.getters[isClear?'invalidList':'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },

    // 修改购物车商品规格
    updateCartSku (context, {oldSkuId, newSku}) {
      return new Promise((resolve, reject) => {
        if(context.rootState.user.profile.token) {
          // 已登录
          // 1.获取原先商品的数量
          // 2.删除原先的商品
          // 3.获取修改的skuId和原先商品数量，做一个加入购物车的操作
          // 4.更新列表
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({skuId:newSku.skuId, count:oldGoods.count}).then(() => {
              return findCartList()
            }).then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // 本地
          // 修改sku的时候，skuId也需要修改，相当于把原来的信息移除，并创建一条心的商品信息
          // 1.获取旧的商品信息
          const oldGoods = context.state.list.find(goods => goods.skuId === oldSkuId)
          // 2.删除旧的商品
          context.commit('deleteCart', oldSkuId)
          // 3.合并一条新的商品信息
          const {skuId, price:nowPrice, inventory: stock, specsText:attrsText} = newSku
          const newGoods = {...oldGoods, skuId, nowPrice, stock, attrsText}
          // 4.插入购物车
          context.commit('insertCart', newGoods)
        }
      })
    }
  }
}
