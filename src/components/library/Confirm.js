import { createVNode, render } from "vue";
import XtxConfirm from './xtx-confirm.vue'

// 准备div
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 该函数渲染XtxConfirm组件，标题和文本
// 函数返回值是promise对象
export default ({title, text}) => {
    return new Promise((resolve, reject) => {
        const submitCallBack = () => {
            render(null, div)
            resolve()
        }
        const cancelCallBack = () => {
            render(null, div)
            reject(new Error('点击取消'))
        }
        // 1.渲染组件
        // 2.点击确认按钮，触发resolve，同时销毁组件
        // 3.点击取消按钮，触发reject，同时销毁组件
        const vnode = createVNode(XtxConfirm, {title, text, submitCallBack, cancelCallBack})
        render(vnode, div)
    })
}