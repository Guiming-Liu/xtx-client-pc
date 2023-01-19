<template>
    <div class="xtx-goods-page" v-if="goods">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XxtBreadItem to="/">首页</XxtBreadItem>
                <XxtBreadItem :to="`/category/${goods.categories[1].id}`">{{ goods.categories[1].name }}
                </XxtBreadItem>
                <XxtBreadItem :to="`/catagory/sub/${goods.categories[0].id}`">{{ goods.categories[0].name }}
                </XxtBreadItem>
                <XxtBreadItem>{{ goods.name }}</XxtBreadItem>
            </XtxBread>
            <!-- 商品信息 -->
            <div class="goods-info">
                <div class="media">
                    <goods-image :picture="goods.mainPictures"></goods-image>
                    <goods-sales></goods-sales>
                </div>
                <div class="spec">
                    <goods-name :goods="goods"></goods-name>
                    <goods-sku :goods="goods" @change="changeSku" skuId="1369155862131642369"></goods-sku>
                    <XtxNumbox label="数量" :max="goods.inventory" v-model="num"></XtxNumbox>
                    <XtxButton @click="insertCart()" size="middle" type="primary" style="margin-top:20px">加入购物车</XtxButton>
                </div>
            </div>
            <!-- 商品推荐 -->
            <goods-relevant :goodsId="goods.id"></goods-relevant>
            <!-- 商品详情 -->
            <div class="goods-footer">
                <div class="goods-article">
                    <!-- 商品+评价 -->
                    <div class="goods-tabs">
                        <goods-tabs></goods-tabs>
                    </div>
                    <!-- 注意事项 -->
                    <div class="goods-warn">
                        <goods-warn></goods-warn>
                    </div>
                </div>
                <!-- 24热榜+专题推荐 -->
                <div class="goods-aside">
                    <goods-hot :type="1"></goods-hot>
                    <goods-hot :type="2"></goods-hot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { findGoodsDetails } from '@/api'
import { getCurrentInstance, nextTick, provide, ref, watch } from 'vue-demi'
import GoodsRelevant from './components/goods-relevant.vue'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
    name: 'XtxGoodsPage',
    components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
    setup() {
        const goods = ref(null)
        const num = ref(1)
        const route = useRoute()
        watch(() => route.params.id, newVal => {
            if (newVal && route.path === `/product/${newVal}`) {
                findGoodsDetails(route.params.id).then(data => {
                    // 让goods的数据重新为null，让使用了v-if的组件得以销毁和创建
                    goods.value = null
                    nextTick(() => {
                        goods.value = data.result
                    })
                })
            }
        }, { immediate: true })

        const changeSku = (sku) => {
            if (sku.skuId) {
                goods.value.price = sku.price
                goods.value.oldPrice = sku.oldPrice
                goods.value.inventory = sku.inventory
            }
            // 记录选择后的sku，可能有数据，可能没有数据，是个{}
            currSku.value = sku
        }
        provide('goods', goods)

        // 加入购物车的逻辑
        const store = useStore()
        const currSku = ref(null)
        const insertCart = () => {
            if(currSku.value&&currSku.value.skuId) {
                // 字段：id skuId name attrsText picture price nowPrice selected stock count isEffective
                const {skuId, specsText} = currSku.value
                const {id, name, mainPictures, price, inventory} = goods.value
                store.dispatch('cart/insertCart', {
                    skuId,
                    attrsText: specsText,
                    id,
                    name,
                    picture: mainPictures[0],
                    price,
                    nowPrice: price,
                    selected: true,
                    stock:inventory,
                    count: num.value,
                    isEffective: true
                }).then(() => {
                Message({text:'加入购物车成功', type: 'success'})
                })
            } else {
                Message({text:'请选择完整规格'})
            }
        }
        return { goods, changeSku, num, insertCart }
    }
}
</script>

<style scoped lang='less'>
.goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
    }

    .spec {
        flex: 1;
        padding: 30px 30px 30px 0;
    }
}

.goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
        width: 940px;
        margin-right: 20px;
    }

    .goods-aside {
        width: 280px;
        min-height: 1000px;
    }
}

.goods-tabs {
    min-height: 600px;
    background: #fff;
}

.goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
}
</style>