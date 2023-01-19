import { request } from "@/utils/request"

// 获取全部分类数据
export const findAllCategory = () => {
    return request('/home/category/head', 'get')
}

// 获取热门品牌数据
export const findBrand = (limit) => {
    return request('/home/brand', 'get', { limit })
}

// 获取banner广告图
export const findBanner = (distributionSite) => {
    return request('/home/banner', 'get', { distributionSite })
}

// 获取新鲜好物数据
export const findNew = (limit) => {
    return request('/home/new', 'get', { limit })
}

// 获取人气推荐数据
export const findHot = () => {
    return request('/home/hot', 'get')
}

// 获取产品区域数据
export const findGoods = () => {
    return request('/home/goods', 'get')
}

// 获取最新专题数据
export const findSpecial = () => {
    return request('/home/special', 'get')
}

// 获取单个一级分类数据
export const findCategory = (id) => {
    return request('/category', 'get', { id })
}

// 获取二级筛选条件数据
export const findSubFilter = (id) => {
    return request('/category/sub/filter', 'get', { id })
}

// 获取分页查询数据
export const findCategoryGoods = (params) => {
    return request('/category/goods/temporary', 'post', params)
}

// 获取商品详情数据
export const findGoodsDetails = (id) => {
    return request('/goods', 'get', { id })
}

// 获取同类商品推荐（猜你喜欢）数据
/**
 * 
 * @param {String} id - 商品ID 有id查询相关商品，无id查询猜你喜欢
 * @param {Number} limit - 获取条数
 */
export const findRelevant = ({ id, limit = 16 }) => {
    return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热销推荐数据
 * @param {String} id - 商品ID
 * @param {Number} limit - 数量限制
 * @param {Number} type - 热销类型，1为24小时，2为周榜，3为总榜，默认为1
 */
export const findGoodsHot = ({ id, limit, type }) => {
    return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品评价头部
 * @param {String} id - 商品id，即spu id
 */
export const findGoodsEvaluate = (id) => {
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 获取商品评价列表
 * @param {String} id - 商品id，即spu id
 */
export const findGoodsEvaluateList = (id, params) => {
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get')
}

/***
 * 用户名和密码登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
    return request('/login', 'post', { account, password })
}

/**
 * 获取短信验证码
 * @param {String} mobile - 手机号
 */
export const userMobileMsg = (mobile) => {
    return request('/login/code', 'get', { mobile })
}

/**
 * 手机验证码登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 */
export const userMobileLogin = ({ mobile, code }) => {
    return request('/login/code', 'post', { mobile, code })
}

/**
 * 第三方登录
 * @param {String} unionId - 第三方登录唯一标识
 * @param {Integer} source - 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 6) => {
    return request('/login/social', 'post', { unionId, source })
}

/**
 * 第三方账号绑定时，获取短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userQQBindCode = (mobile) => {
    return request('/login/social/code', 'get', {mobile})
}

/**
 * 第三方账号绑定
 * @param {String} unionId - 第三方登录唯一标识
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userQQBindLogin = (unionId, mobile, code) => {
    return request('/login/social/bind', 'post', {unionId, mobile, code})
}

/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
 export const userCheckAccount = (account) => {
    return request('/register/check', 'get', { account })
  }

  /**
 * 完善信息时，获取短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userQQPatchCode = (mobile) => {
    return request('/register/code', 'get', {mobile})
}

/**
 * 第三方账号绑定
 * @param {String} unionId - 第三方登录唯一标识
 * @param {String} account - 用户名
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} password - 密码
 * @returns Promise
 */
 export const userQQPatchLogin = ({unionId, mobile, code, account,password}) => {
    return request(`/login/social/${unionId}/complement`, 'post', {unionId, mobile, code,account,password})
}

/**
 * 获取购物车商品最新库存和有效性信息
 * @param {String} skuId - 商品skuId
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
    return request(`/goods/stock/${skuId}`, 'get')
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
    return request(`goods/sku/${skuId}`, 'get')
}

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} object.skuId - 商品skuId
 * @param {Boolean} object.selected - 商品的选中状态
 * @param {Integer} object.count - 商品的数量
 * returns Promise
 */
export const mergeLocalCart = (cartList) => {
    return request(`/member/cart/merge`, 'post', cartList)
}

/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
export const findCartList = () => {
    return request('/member/cart', 'get')
}

/**
 * 登录后，加入购物车
 * @param {String} skuId - 商品skuId
 * @param {Integer} count - 商品数量
 * @returns Promise
 */
export const insertCart = ({skuId, count}) => {
    return request('/member/cart', 'post', { skuId, count })
}

/**
 * 登录后，删除购物车商品（支持批量删除）
 * @param {Array<string>} ids - 商品skuId的集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
    return request('/member/cart', 'delete', {ids})
}

/**
 * 登录后，修改购物车商品状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = (goods) => {
    return request(`/member/cart/${goods.skuId}`, 'put', goods)
}

/**
 * 登录后，购物车全选/反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
 export const checkAllCart = ({ selected, ids }) => {
    return request('/member/cart/selected', 'put', { selected, ids })
  }

/**
 * 生成订单（即填写订单或结算页）
 * @returns Promise
 */
export const findCheckoutInfo = () => {
    return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} address  - 地址对象
 * @returns Promise
 */
 export const addAddress = (address) => {
    return request('/member/address', 'post', address)
}

/**
 * 修改收货地址信息
 * @param {Object} address  - 地址对象
 * @returns Promise
 */
 export const editAddress  = (address) => {
    return request(`/member/address/${address.id}`, 'put', address)
}

/**
 * 提交订单
 * @param {Object} order  - 订单信息
 * @returns Promise
 */
 export const createOrder   = (order) => {
    return request('/member/order', 'post', order)
}

/**
 * 获取订单详情
 * @param {String} id  - 地址对象
 * @returns Promise
 */
 export const findOrder   = (id) => {
    return request(`/member/order/${id}`, 'get')
}

/**
 * 获取收藏分页数据
 * @param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns
 */
export const findCollect = ({page=1,pageSize=10,collectType=1}) => {
    return request('/member/collect', 'get', {page, pageSize, collectType})
}