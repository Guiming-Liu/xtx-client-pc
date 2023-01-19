// 实现使用函数调用xtx-message组件的逻辑
import XtxMessage from '@/components/library/xtx-message.vue'
import { createVNode, render } from 'vue'

// 准备DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
    // 实现：根据xtx-message.vue渲染消息提示
    // 1.导入组件
    // 2.根据组件创建虚拟节点
    const vnode = createVNode(XtxMessage, { type, text })
    // 3.准备一个Dom容器
    // 4.把虚拟节点渲染到Dom容器中
    render(vnode, div)
    // 5.开启延时器，移除DOM容器的内容
    clearTimeout(timer)
    timer = setTimeout(() => {
        render(null, div)
    }, 3000);

}