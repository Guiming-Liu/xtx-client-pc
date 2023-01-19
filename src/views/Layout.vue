<template>
    <div class="layout">
        <!-- 顶部通栏 -->
        <app-topnav></app-topnav>
        <!-- 网站头部 -->
        <app-header></app-header>
        <app-header-sticky></app-header-sticky>
        <!-- 网站内容 -->
        <div class="main">
            <router-view></router-view>
        </div>
        <!-- 网站底部 -->
        <app-footer></app-footer>
    </div>
</template>

<script>
import { findAllCategory } from '@/api'
import { useStore } from 'vuex'
import AppFooter from '../components/app-footer.vue'
import AppHeaderSticky from '../components/app-header-sticky.vue'
import AppHeader from '../components/app-header.vue'
import AppTopnav from '../components/app-topnav.vue'
export default {
    name: 'Layout',
    components: {
        AppTopnav,
        AppHeader,
        AppFooter,
        AppHeaderSticky,
    },
    setup() {
        // const store = useStore()
        // store.dispatch('category/getCategory')
        //     findAllCategory().then(({ result }) => {
        //         store.commit('category/setCategory', result)
        //     })
    }
}
</script>

<style scoped lang="less">
.main {
    min-height: 600px;
}
</style>
