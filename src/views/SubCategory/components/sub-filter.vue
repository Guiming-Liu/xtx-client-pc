<template>
    <!-- 筛选区 -->
    <div>
        <div class="sub-filter" v-if="filterLoading && filterData">
            <div class="item">
                <div class="head">品牌：</div>
                <div class="body">
                    <a @click="changeBrand(item.id)" :class="{ active: item.id === filterData.selectedBrandId }"
                        href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{ item.name }}</a>
                </div>
            </div>
            <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
                <div class="head">{{ item.name.slice(0, 2) }}：</div>
                <div class="body">
                    <a @click="changeProp(item, subItem.id)" :class="{ active: subItem.id === item.selectedPropId }"
                        href="javascript:;" v-for="subItem in item.properties" :key="subItem.id">
                        {{ subItem.name }}
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="sub-filter">
            <XtxSkeleton class="item" width="800px" height="40px" />
            <XtxSkeleton class="item" width="800px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
        </div>
    </div>
</template>
<script>
import { findSubFilter } from '@/api'
import { reactive, ref, watch } from 'vue-demi'
import { useRoute } from 'vue-router'
export default {
    name: 'SubFilter',
    setup(props, { emit }) {
        // 获取品牌筛选数据
        // 使用watch来监听，确保切换不同子id时都能从后台获取数据
        const route = useRoute()
        const filterData = reactive({
            selectedBrandId: null,
            brands: [],
            saleProperties: []
            // brands: [{id:null, name:'全部'},...{ id: '', name: '', }],
            // saleProperties: [...{ id: '', name: '', selectedPropId: null,properties: [{id:null, name:'全部'},...{id:'', name: ''}] }]
        })
        const filterLoading = ref(true)
        watch(() => route.params.id, newVal => {
            if (newVal && route.path === `/category/sub/${newVal}`) {
                filterLoading.value = false
                // 当id变化后，先把filterData.brands里的数据重置
                filterData.brands = []
                // 当id变化时，先把filterData.saleProperties里的数据重置
                filterData.saleProperties = []
                findSubFilter(route.params.id).then(({ result }) => {
                    // 获取到品牌数据后，把品牌数据的id和name包装成对象，合并到filterData.brands后面
                    // 给每一组数据加上一个被选中的ID
                    // 1.品牌
                    if (result.brands) {
                        result.brands.forEach(item => {
                            filterData.brands.push({ id: item.id, name: item.name })
                        })
                    }
                    // 合并完品牌数据后，把'全部'这个选项加入filterData.brands最前面
                    filterData.brands.unshift({ id: null, name: '全部' })
                    // 2.属性
                    // 获取销售属性后，把销售属性的id、name和properties包装成数组，合并到filterData.saleProperties后面，并在每一项properties前面插入{id:null, name:'全部'}
                    if (result.saleProperties) {
                        result.saleProperties.forEach(item => {
                            item.selectedPropId = null
                            item.properties.unshift({ id: null, name: '全部' })
                            filterData.saleProperties.push({
                                id: item.id,
                                name: item.name,
                                properties: item.properties
                            })
                        })
                    }
                    // filterLoading值的改变需要在异步调用里，默认是true，即加载结构，当监听到路由id改变时，改为false，即不加载结构，当异步调用结束后，再次改为false，即加载结构
                    filterLoading.value = true
                })
            }
        }, { immediate: true })

        // 记录品牌ID
        const changeBrand = (brandId) => {
            if (filterData.selectedBrandId === brandId) return
            filterData.selectedBrandId = brandId
            emit('transformFilter', getFilters())
        }
        // 记录属性ID
        const changeProp = (saleProp, propId) => {
            // saleProp是当前被选中的销售属性对象，PropId是当前被选中的属性的id
            // 如果当前销售属性对象的被选id和被选中的属性的id相等，则返回，如不相等，则赋值，并添加到attrs中
            if (saleProp.selectedPropId === propId) return
            saleProp.selectedPropId = propId
            emit('transformFilter', getFilters())
        }
        // ps: 写成函数的好处：filters可以定义在函数局部内，不会被全局污染，因此每一次的品牌和销售属性改变，都会按最新的状态拼凑给filters，而不会附加之前的选择
        // 组合筛选参数
        const getFilters = () => {
            // 定义数据结构
            const filters = reactive({ brandId: null, attrs: [] })
            // 设置品牌
            filters.brandId = filterData.selectedBrandId
            // 设置属性
            filterData.saleProperties.forEach(item => {
                if (item.selectedPropId) {
                    const obj = item.properties.find(sub => sub.id === item.selectedPropId)
                    filters.attrs.push({ groupName: item.name, propertyName: obj.name })
                }
            })
            // 当attrs没有数据时，设置为null，即不发送attrs的请求
            if (filters.attrs.length === 0) filters.attrs = null
            return filters
        }
        return { filterData, filterLoading, changeBrand, changeProp }
    }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
    background: #fff;
    padding: 25px;

    .item {
        display: flex;
        line-height: 40px;

        .head {
            width: 80px;
            color: #999;
        }

        .body {
            flex: 1;

            a {
                margin-right: 36px;
                transition: all .3s;
                display: inline-block;

                &.active,
                &:hover {
                    color: @xtxColor;
                }
            }
        }
    }
}

.xtx-skeleton {
    padding: 10px 0;
}
</style>