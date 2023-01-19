<template>
    <div class="home-new" ref="target">
        <home-panel :list="goods" title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
            <template #right>
                <XtxMore></XtxMore>
            </template>
            <transition name="fade" mode="">
                <ul class="goods-list" v-if="goods">
                    <li v-for="item in goods" :key="item.id">
                        <RouterLink :to="`/product/${item.id}`">
                            <img v-lazy="item.picture" alt="">
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="price">&yen;{{ item.price }}</p>
                        </RouterLink>
                    </li>
                </ul>
                <home-skeleton v-else></home-skeleton>
            </transition>

        </home-panel>
    </div>
</template>

<script>
import { findNew } from '@/api'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazy } from '@/hooks'
export default {
    components: { HomePanel, HomeSkeleton },
    setup() {
        const { result, target } = useLazy(findNew)
        return { goods: result, target }
    }
}
</script>

<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 406px;

    li {
        width: 306px;
        height: 406px;
        background: #f0f9f4;
        .hoverShadow();

        img {
            width: 306px;
            height: 306px;
        }

        p {
            font-size: 22px;
            padding: 12px 30px 0 30px;
            text-align: center;
        }

        .price {
            color: @priceColor;
        }
    }
}
</style>