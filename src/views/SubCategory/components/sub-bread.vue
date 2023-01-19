<template>
    <div class="sub-bread">
        <!-- 动画需要有从无到有的过程，可以通过key值来生成结构，当key值发生变化时，结构就会重新生成 -->
        <!-- 注释不能写在面包屑结构里，否则会生成大于号 -->
        <xtx-bread>
            <xtx-bread-item to="/">首页</xtx-bread-item>
            <xtx-bread-item v-if="breadData.top" :to="`/category/${breadData.top.id}`">{{ breadData.top.name
            }}</xtx-bread-item>
            <transition name="fade-right" mode="out-in">
                <xtx-bread-item v-if="breadData.sub" :key="breadData.sub.id">{{ breadData.sub.name }}</xtx-bread-item>
            </transition>
        </xtx-bread>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

export default {
    name: 'SubBread',
    setup() {
        // 获取分类信息
        // 渲染数据时，不需要遍历，所以不要数组数据，从vuex中获取的分类数据是数组，要转换成对象数据
        const route = useRoute()
        const store = useStore()
        const breadData = computed(() => {
            const obj = { top: {}, sub: {} }
            store.state.category.category.forEach(top => {
                // 因为是异步请求，所以要确保先有数据，在对数据进行操作，否则会报错
                top.children && top.children.find(sub => {
                    // 当二级分类的id和当前路由id相等时，获取这时候的二级分类和对应的一级分类
                    if (sub.id === route.params.id) {
                        obj.sub = { id: sub.id, name: sub.name }
                        obj.top = { id: top.id, name: top.name }
                    }
                })
            })
            return obj
        })

        return { breadData }

    }
}
</script>

<style>

</style>