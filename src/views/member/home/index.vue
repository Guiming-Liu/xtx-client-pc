<template>
    <div class="member-home">
        <!-- 概览 -->
        <home-overview></home-overview>
        <!-- 收藏 -->
        <home-panel title="我的收藏">
            <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>
        </home-panel>
        <!-- 足迹 -->
        <home-panel title="我的足迹">
            <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>
        </home-panel>
        <!-- 猜你喜欢 -->
        <goods-relevant></goods-relevant>
    </div>
</template>
<script>
import GoodsItem from '../../Category/components/goods-item.vue'
import GoodsRelevant from '../../goods/components/goods-relevant.vue'
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import {findCollect} from '@/api'
import { ref } from 'vue-demi'
export default {
    components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
    name: 'MemberHome',
    setup() {
        const goods = {
            id: '1',
            name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
            picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
            desc: '清汤鲜香 红汤劲爽',
            price: '159.00'
        }

        // 获取收藏数据
        const collectGoods = ref([])
        findCollect({page:1, pageSize:4}).then(data => {
            collectGoods.value = data.result.items
        })
        return {goods, collectGoods}
    }
}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
    left: 5px;
}

:deep(.xtx-carousel) .carousel-btn.next {
    right: 5px;
}
</style>