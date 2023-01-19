<template>
    <div class="home-brand" ref="target">
        <home-panel title="热门品牌" subTitle="国际经典 品质保证">
            <template #right>
                <a href="javascript:;" class="iconfont icon-angle-left prev" :class="{ disabled: i === 0 }"
                    @click="prev"></a>
                <a href="javascript:;" class="iconfont icon-angle-right next" :class="{ disabled: i === 1 }"
                    @click="next"></a>
            </template>
            <transition name="fade" mode="">
                <div class="box" v-if="brands">
                    <ul class="list" :style="{ transform: `translateX(${-i * 1240}px)` }">
                        <li v-for="item in brands" :key="item.id">
                            <RouterLink to="/">
                                <img v-lazy="item.picture" alt="">
                            </RouterLink>
                        </li>
                    </ul>
                </div>
                <div v-else class="skeleton">
                    <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px"
                        height="305px" />
                </div>
            </transition>
        </home-panel>
    </div>
</template>

<script>
import { findBrand } from '@/api';
import { useLazy } from '@/hooks';
import HomePanel from './home-panel.vue'
import { ref } from 'vue-demi';
export default {
    name: 'HomeBrand',
    components: { HomePanel },
    setup() {
        const { target, result } = useLazy(() => findBrand(10))
        const i = ref(0)
        const next = () => {
            if (i.value >= 1) return
            i.value = i.value + 1
        }
        const prev = () => {
            if (i.value <= 0) return
            i.value = i.value - 1
        }
        return { brands: result, target, i, next, prev }
    }
}
</script>

<style scoped lang='less'>
.home-panel {
    background: #f5f5f5
}

.iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;

    &::before {
        font-size: 12px;
        position: relative;
        top: -2px
    }

    &.disabled {
        background: #ccc;
        cursor: not-allowed;
    }
}

.box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;

    .list {
        width: 200%;
        display: flex;
        transition: all 1s;

        li {
            margin-right: 10px;
            width: 240px;

            &:nth-child(5n) {
                margin-right: 0;
            }

            img {
                width: 240px;
                height: 305px;
            }
        }
    }
}

.skeleton {
    width: 100%;
    display: flex;

    .item {
        margin-right: 10px;

        &:nth-child(5n) {
            margin-right: 0;
        }
    }
}
</style>