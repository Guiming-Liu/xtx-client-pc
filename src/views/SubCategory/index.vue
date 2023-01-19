<template>
    <div class="subCategory">
        <div class="container">
            <!-- 面包屑 -->
            <sub-bread></sub-bread>
            <!-- 筛选展示区 -->
            <sub-filter @transformFilter="transformFilter"></sub-filter>
            <div class="goods-list">
                <!-- 条件排序区 -->
                <sub-sort @transformSort="transformSort"></sub-sort>
                <!-- 商品展示区 -->
                <ul>
                    <li v-for="item in resGoods" :key="item.id">
                        <goods-item :goods="item"></goods-item>
                    </li>
                </ul>
                <!-- 无限加载组件 -->
                <XtxInfiniteLoading :loading="loading" @infinite="getData"></XtxInfiniteLoading>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, watch } from 'vue-demi'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from '../Category/components/goods-item.vue'
import { useRoute } from 'vue-router'
import { findCategoryGoods } from '@/api'
export default {
    name: 'SubCategory',
    components: { SubBread, SubFilter, SubSort, GoodsItem },
    setup() {
        const route = useRoute()
        const loading = ref(false)
        let reqParams = {
            page: 0,
            pageSize: 20
        }
        // 获取分页查询商品列表
        const resGoods = ref([])
        const getData = () => {
            reqParams.page++
            loading.value = true
            findCategoryGoods(reqParams).then(({ result }) => {
                resGoods.value.push(...result.items)
                if (result.items) loading.value = false
            })
        }
        watch(() => route.params.id, newVal => {
            if (newVal && route.path === `/category/sub/${newVal}`) {
                reqParams.page = 0
                resGoods.value = []
                getData()
            }
        }, { immediate: true })

        // 改变排序
        const transformSort = (sortParams) => {
            reqParams = { ...reqParams, ...sortParams }
            reqParams.page = 0
            resGoods.value = []
            getData()
            console.log(reqParams);
        }

        // 改变筛选条件
        const transformFilter = (filters) => {
            console.log(filters);
            reqParams = { ...reqParams, ...filters }
            reqParams.page = 0
            resGoods.value = []
            getData()
        }
        return { resGoods, getData, loading, transformSort, transformFilter }
    }
}
</script>

<style scoped lang="less">
.goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;
}

ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
        margin-right: 20px;
        margin-bottom: 20px;

        &:nth-child(5n) {
            margin-right: 0;
        }
    }
}
</style>