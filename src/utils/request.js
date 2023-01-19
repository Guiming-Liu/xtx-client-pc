// 1. 创建一个新的axios实例
// 2. 配置请求拦截器，如果请求中有token，则在请求头部中携带
// 3. 配置响应拦截器，剥离无效数据，并处理失效的token
// 4. 导出一个函数，用于调用创建好的axios实例，以发送请求，同时返回Promise对象

import router from "@/router"
import store from "@/store"
import axios from "axios"
// 为了让不需要通过axios发送请求的地方也能使用基础地址，所以不放到axios.create里面
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL: baseURL,
  // 如果请求时间超过timeout的值，请求会被中断，默认值是0，永不超时
  timeout: 5000
})

// 给instance添加请求拦截器
instance.interceptors.request.use(request => {
  // 拦截的业务逻辑
  // 进行请求配置的修改
  // 如果本地有token，则在请求头部中携带
  // 1.获取用户信息对象
  const { profile } = store.state.user
  // 2.判断是否有token
  if (profile.token) {
    // 3.如果有，则设置在请求头部
    // headers可以自定义请求头 headers: {'X-Requested-With': 'XMLHttpRequest'}
    request.headers.Authorization = `Bearer ${profile.token}`
  }
  return request
}, err => {
  // 如果拦截请求失败，返回一个promise的错误对象
  return Promise.reject(err)
})

// 给instance添加响应拦截器
// 响应成功，则返回成功后的数据res.data
instance.interceptors.response.use(res => res.data, err => {
  // axios向服务器发送请求时，有两种情况会出现401状态码：
  // 1.服务端要求传递token信息，而实际发送请求时没有传递
  // 2.发送请求时有传递token到达服务器端，但是由于时间比较久，这个token在服务器已经过期了（服务器存储token有效期为2小时）
  // 总之，服务器端有些api接口要求传递token，token失效或没有传递，就会报401错误。
  if (err.response && err.response.status === 401) {
    // 1.清空无效用户信息
    // 2.跳转到登录页面
    // 3.传递跳转前的页面参数（路由地址）给登录页，以便登录成功后返回页面
    store.commit('user/setUser', {})
    // 上面这行代码，意思是提交参数到vuex仓库中user模板里的setUser函数里，清空无效用户信息，即传递一个空对象过去
    // path和fullPath的区别：path传递的路径中不带参数，fullPath可携带参数进行传递
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 默认导出请求工具函数
export const request = (url, method, submitData) => {
  return instance({
    // 在axios中，baseURL和url不一样
    url,
    method,
    // 如果是get，需要用params来传递submitData  ？a=10
    // 如果不是get，则需要用data来传递    请求体传参
    // 用[] 设置一个动态key
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}


