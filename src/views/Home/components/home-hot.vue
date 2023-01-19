<template>
    <div class="home-hot" ref="target">
        <home-panel title="人气推荐" subTitle="人气火爆 不容错过">
            <!-- transition如果只包裹HomeSkeleton组件，一旦ul生成，很快就会替换骨架屏，动画持续时间很少 -->
            <transition name="fade" mode="">
                <ul ref="pannel" class="goods-list" v-if="hotList">
                    <li v-for="item in hotList" :key="item.id">
                        <RouterLink to="/">
                            <img v-lazy="item.picture" alt="">
                            <p class="name">{{ item.title }}</p>
                            <p class="desc">{{ item.alt }}</p>
                        </RouterLink>
                    </li>
                </ul>
                <home-skeleton v-else></home-skeleton>
            </transition>
        </home-panel>
    </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findHot } from '@/api'
import HomeSkeleton from './home-skeleton.vue'
import { useLazy } from '@/hooks'
export default {
    name: 'HomeHot',
    components: { HomePanel, HomeSkeleton },
    setup() {
        const { target, result } = useLazy(findHot)
        return { hotList: result, target }
    }
}
</script>

<style scoped lang='less'>
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 426px;

    li {
        width: 306px;
        height: 406px;
        .hoverShadow();

        img {
            width: 306px;
            height: 306px;
        }

        p {
            font-size: 22px;
            padding-top: 12px;
            text-align: center;
        }

        .desc {
            color: #999;
            font-size: 18px;
        }
    }
}
</style>