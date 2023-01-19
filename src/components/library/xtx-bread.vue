<script>
import { h } from 'vue-demi'
export default {
    name: 'XtxBread',
    render() {
        // 用法
        // 1.template 标签去掉
        // 2.render函数的返回值就是组件内容
        // 3.vue2.0的h函数是传参进来的，vue3.0中，h 函数是导入进来的
        // 4.h 函数的第一个参数：标签名称，第二个参数：标签属性（对象），第三个参数：子节点
        // 需求
        // 1.创建父标签: xtx-bread
        // 2.获取默认插槽内容
        // 3.去除xtx-bread-item组件的i标签， i标签应该由render函数组织
        // 4.遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
        // 5.把动态创建的节点渲染到xtx-bread标签中
        // render函数是vue2.0的内容，可以使用this来访问vue实例
        // default属性包括了所有非具名插槽中的节点，如果要获取的是具名插槽，使用this.$slots.插槽名
        // this.$slots并非响应式
        const items = this.$slots.default()
        const dynamicItems = []
        items.forEach((item, index) => {
            // 加入第一个item
            dynamicItems.push(item)
            // 判断第一个item的index是否小于数组长度-1，如果是，第一个item的后面添加一个i标签，这里的item是<div class="xtx-bread-item">，i标签不写在里面，写在后面
            if (index < items.length - 1) {
                dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
            }
        })
        return h('div', { class: 'xtx-bread' }, dynamicItems)
    }
}
</script>
<!-- 把scoped去掉，让以下样式作用全局，能影响到xtx-bread-item -->
<style lang='less'>
.xtx-bread {
    display: flex;
    padding: 25px 10px;

    &-item {
        a {
            color: #666;
            transition: all .4s;

            &:hover {
                color: @xtxColor;
            }
        }
    }

    i {
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 22px;
    }
}
</style>