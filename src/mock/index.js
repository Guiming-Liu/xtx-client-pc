import Mock from "mockjs"
import qs from 'qs'

// mock的配置
Mock.setup({
    // 随机延时500-1000毫秒，模拟网络延迟
    timeout: '500-1000'
})

// 拦截请求接口
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数：生成数据的函数

// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
    const queryString = config.url.split('?')[1]
    const queryObject = qs.parse(queryString)
    const items = []
    for (let i = 0; i < queryObject.pageSize; i++) {
        items.push(Mock.mock({
            id: '@id',
            name: '@ctitle(10,20)',
            desc: '@ctitle(4, 10)',
            price: '@float(100,200,2,2)',
            picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
        }))
    }
    return {
        msg: '获取收藏商品成功',
        result: {
            counts: 35,
            pageSize: '',
            page: '',
            items
        }
    }
})