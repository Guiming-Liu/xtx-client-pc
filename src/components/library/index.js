// 扩展vue原有的功能：全局组件、自定义指令、挂载到原型。注意：vue3.0没有全局过滤器
// 扩展vue原有的功能，就是插件
// vue2.0插件的写法：导出一个对象，用install函数，默认传入到Vue构造函数，在vue的基础上扩展
// vue3.0插件的写法：导出一个对象，用install函数，默认传入到app应用实例，在app的基础上扩展

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
import Confirm  from './Confirm'
// 封装图片懒加载指令
const defineDirective = (app) => {
    app.directive('lazy', {
        mounted(el, binding) {
            const observer = new IntersectionObserver(([{ isIntersecting }]) => {
                if (isIntersecting) {
                    el.src = binding.value
                    observer.unobserve(el)
                }
                el.onerror = () => {
                    el.src = defaultImg
                }
            }, {
                threshold: 0
            })
            observer.observe(el)
        }
    })
}


// 导入library文件下的所有组件
// 批量导入需要使用函数require.context(dir, deep, matching)
// 参数：1.目录，2.是否加载子目录，3.正则匹配
const importFn = require.context('./', false, /\.vue$/)
export default {
    install(app) {
        // 在app上进行扩展，app提供component  directive函数
        // 如果要挂载原型，用app.config.globalProperties方式
        // app.component(XtxSkeleton.name, XtxSkeleton)
        // app.component(XtxCarousel.name, XtxCarousel)
        // app.component(XtxMore.name, XtxMore)
        // app.component(XtxBread.name, XtxBread)
        // app.component(XtxBreadItem.name, XtxBreadItem)
        defineDirective(app)
        // 批量注册全局组件
        importFn.keys().forEach(key => {
            // 导入组件
            const component = importFn(key).default
            app.component(component.name, component)
        })
        app.config.globalProperties.$message = Message
        app.config.globalProperties.$confirm = Confirm
    }
}