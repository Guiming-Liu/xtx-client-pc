<template>
    <div>
        <ul class="app-header-nav">
            <li><router-link to="/">首页</router-link></li>
            <li v-for="item in category" :key="item.id" @mousemove="show(item)" @mouseleave="(item.open = false)"
                @click="hide(item)">
                <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
                <div class="layer" :class="{ open: item.open }">
                    <ul>
                        <li v-for="subItem in item.children" :key="subItem.id">
                            <router-link :to="`/category/sub/${subItem.id}`">
                                <img :src="subItem.picture" alt="">
                                <p>{{ subItem.name }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>

    </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    name: 'AppHeaderNav',
    setup() {
        const store = useStore()
        store.dispatch('category/getCategory')
        // 以下得到的数据并非响应式数据，所以渲染不出结果
        // const { category } = store.state.category
        // 需要用computed计算属性获得响应式数据
        const category = computed(() => {
            return store.state.category.category
        })
        const show = (item) => store.commit('category/show', item)
        const hide = (item) => store.commit('category/hide', item)
        return { category, show, hide }
    }
}
</script>

<style scoped lang='less'>
.app-header-nav {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    z-index: 998;

    >li {
        margin-right: 40px;
        width: 38px;
        text-align: center;

        >a {
            font-size: 16px;
            line-height: 32px;
            height: 32px;
            display: inline-block;
        }

        &:hover {
            >a {
                color: @xtxColor;
                border-bottom: 1px solid @xtxColor;
            }

            // >.layer {
            //     height: 132px;
            //     opacity: 1;
            // }
        }
    }
}

.layer {
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all .2s .1s;

    &.open {
        height: 132px;
        opacity: 1;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 70px;
        align-items: center;
        height: 132px;

        li {
            width: 110px;
            text-align: center;

            img {
                width: 60px;
                height: 60px;
            }

            p {
                padding-top: 10px;
            }

            &:hover {
                p {
                    color: @xtxColor;
                }
            }
        }
    }
}
</style>